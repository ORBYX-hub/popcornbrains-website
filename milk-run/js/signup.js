// MILK RUN, funnel: splash → game → eindscherm.
//
// 2026-09-01: de wedstrijd is afgelopen. De inschrijfstap die vóór de game stond
// is weg, PRESS START start meteen. Wat blijft is een VRIJBLIJVENDE nieuwsbrief-
// opt-in NA het spelen: nooit een poort, altijd overslaanbaar door ze te negeren.
//
// Nieuwsbrief-POST gaat naar het Apps Script-endpoint (backend/RUNBOOK.md).
// Zonder endpoint: demo-modus, maar ALLEEN op lokale hosts; op een publieke host
// faalt inschrijven dan luid (geen stille dataverdwijning).
// Entries gaan eerst in een outbox (localStorage) en worden pas geschrapt als de
// POST vertrokken is; bij het laden proberen we de outbox opnieuw.

(function () {
  const CFG = window.MILKRUN_CONFIG;
  const AUD = window.MILKRUN_AUDIO;
  const STORE = window.MILKRUN_STORE;
  const $ = id => document.getElementById(id);

  const LOCAL = /^(localhost|127\.|192\.168\.|10\.|100\.)/.test(location.hostname);

  // Instagram/Facebook in-app browsers (en generieke Android WebView): daar is
  // navigator.share (zeker met files) afwezig of onbetrouwbaar. De score-kaart-
  // viewer + kopieer-link is er het HOOFDpad, geen fallback (fix 3/7).
  const WEBVIEW = /instagram|fbav|fban|fb_iab|line\/|; wv\)/i.test(navigator.userAgent || '');

  const BEST_KEY = 'milkrun_best';

  let lastRes = null;   // laatste eindresultaat (voor de deel-kaart)
  let challenge = 0;    // uitdaging-score uit ?beat= (0 = geen uitdaging)

  const screens = { splash: $('screen-splash'), end: $('screen-end') };
  function show(name) {
    for (const k in screens) screens[k].hidden = (k !== name);
    if (!name) for (const k in screens) screens[k].hidden = true;
  }

  // ---- opruimen van de campagne (eenmalig, per toestel) ---------------------
  // Een terugkerende speler mag zijn zomerrecord NIET op 00000 zien springen:
  // de topscores stonden per stemronde (milkrun_best_r1 .. r8), nu op één sleutel.
  function migrateLegacy() {
    if (STORE.get(BEST_KEY) === null) {
      let best = 0;
      for (let r = 1; r <= 8; r++) {
        const v = parseInt(STORE.get('milkrun_best_r' + r) || '0', 10);
        if (v > best) best = v;
      }
      if (best > 0) STORE.set(BEST_KEY, String(best));
    }
    for (let r = 1; r <= 8; r++) STORE.remove('milkrun_best_r' + r);
    // De oude poort-vlag bepaalde of PRESS START naar het formulier ging. Die
    // stap bestaat niet meer, dus de sleutel is dood gewicht.
    STORE.remove('milkrun_signup');
  }

  // ---- backend --------------------------------------------------------------
  // Apps Script stuurt `access-control-allow-origin: *` op zowel de 302 als het
  // uiteindelijke 200-antwoord (geverifieerd 2026-09-01), dus we lezen het antwoord
  // gewoon uit. Het oude `mode: 'no-cors'` maakte elk antwoord opaque, en daardoor
  // was elke mislukking onzichtbaar: precies de faalvorm die we nergens willen.
  // Het content-type blijft form-urlencoded, dus dit blijft een simple request en
  // er komt geen preflight (Apps Script beantwoordt geen OPTIONS).
  function post(payload) {
    const body = new URLSearchParams(payload).toString();
    return fetch(CFG.ENDPOINT, {
      method: 'POST', keepalive: true,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    }).then(r => r.text());
  }

  // Antwoorden van de backend. Het voorvoegsel is essentieel: versie 2 antwoordde
  // op een onbekend type met een KAAL 'ok'. Zou een geslaagde news-schrijfactie ook
  // 'ok' zeggen, dan konden we "geschreven" niet onderscheiden van "deze backend
  // kent type=news niet" en zouden we een adres weggooien dat nooit is aangekomen.
  const NEWS_OK = ['news-ok', 'news-dup'];   // aangekomen en afgehandeld
  const NEWS_BAD = 'news-bad';               // geweigerd, opnieuw proberen heeft geen zin

  function dropFromOutbox(payload) {
    setOutbox(outbox().filter(r => JSON.stringify(r) !== JSON.stringify(payload)));
  }

  // Levert 'ok' | 'geweigerd' | 'onbereikbaar'. Bij 'onbereikbaar' BLIJFT de rij in
  // de outbox staan, zodat ze bij een volgend bezoek opnieuw vertrekt.
  function deliverNews(payload) {
    return post(payload).then(body => {
      const t = String(body || '').trim();
      if (NEWS_OK.indexOf(t) > -1) { dropFromOutbox(payload); return 'ok'; }
      if (t === NEWS_BAD) { dropFromOutbox(payload); return 'geweigerd'; }
      return 'onbereikbaar';
    }).catch(() => 'onbereikbaar');
  }

  function outbox() {
    try { return JSON.parse(STORE.get('milkrun_outbox') || '[]'); } catch (e) { return []; }
  }
  function setOutbox(rows) { STORE.set('milkrun_outbox', JSON.stringify(rows)); }

  const OUTBOX_TTL = 7 * 24 * 3600 * 1000; // een niet-verzonden opt-in vervalt

  function flushOutbox() {
    if (!CFG.ENDPOINT) return;
    // Wedstrijd-inschrijvingen die nooit vertrokken zijn, kunnen niet meer winnen
    // en worden door de backend niet meer aanvaard. Ze stilletjes blijven herposten
    // is zinloos verkeer; ze wegdoen is eerlijker dan doen alsof ze nog meetellen.
    // Een oude nieuwsbrief-rij vervalt ook: een adres eindeloos bewaren omdat één
    // POST ooit faalde, is geen bewaartermijn maar een lek.
    const now = Date.now();
    const rows = outbox().filter(r => r && r.type === 'news' &&
      (!r.at || (now - new Date(r.at).getTime()) < OUTBOX_TTL));
    // Alleen de vervallen/legacy rijen meteen weggooien. De rest blijft staan tot
    // haar eigen POST vertrokken is, zoals de kop van dit bestand belooft: wist je
    // ze vooraf, dan is de rij weg zodra iemand de tab sluit vóór de fetch settelt.
    setOutbox(rows);
    rows.forEach(row => { deliverNews(row); });
  }

  function send(payload) {
    if (!CFG.ENDPOINT) {
      if (LOCAL) { // demo-modus voor lokale tests
        const rows = JSON.parse(STORE.get('milkrun_demo_rows') || '[]');
        rows.push(Object.assign({ at: new Date().toISOString() }, payload));
        STORE.set('milkrun_demo_rows', JSON.stringify(rows));
        return Promise.resolve('ok');
      }
      return Promise.resolve(payload.type === 'news' ? 'onbereikbaar' : 'ok');
    }
    if (payload.type === 'news') {
      // outbox-first: de rij staat op schijf VOOR ze vertrekt, en verdwijnt pas
      // als de backend bevestigt dat ze aangekomen is.
      setOutbox(outbox().concat([payload]));
      return deliverNews(payload);
    }
    return post(payload).catch(() => {});
  }
  const ping = type => send({ type });

  // ---- nieuwsbrief ----------------------------------------------------------
  const newsForm = $('news-form');
  const NEWS_KEY = 'milkrun_news';

  // Toont de eindstand ipv het formulier. Zonder dit krijgt iemand die al
  // ingeschreven is bij ELKE volgende run opnieuw een leeg formulier voorgeschoteld,
  // en de backend appendt onvoorwaardelijk, dus dat levert dubbele rijen op.
  function markNewsDone() {
    const done = $('news-done');
    if (done) done.hidden = false;
    if (newsForm) newsForm.hidden = true;
  }

  function handleNews(f, doneEl) {
    const email = f.querySelector('[name=email]').value.trim();
    const optinRegoli = f.querySelector('[name=optin_regoli]').checked;
    const optinSony = f.querySelector('[name=optin_sony]').checked;
    const trap = f.querySelector('[name=website]').value; // honeypot
    const err = f.querySelector('.form-error');
    err.textContent = '';
    // Bot: naar buiten toe niet te onderscheiden van een geslaagde inschrijving,
    // maar de demper laat wel een spoor na (een demper die stil iets opeet is
    // precies de faalvorm die we nergens willen).
    if (trap) { ping('hp'); if (doneEl) markNewsDone(); return true; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = 'VUL EEN GELDIG E-MAILADRES IN.'; return false; }
    // Zonder aangevinkte toestemming is er geen enkele grond om dit adres te
    // bewaren, dus dan slaan we het ook niet op (AVG art. 6.1.a).
    if (!optinRegoli && !optinSony) { err.textContent = 'VINK AAN WAAROVER JE NIEUWS WIL ONTVANGEN.'; return false; }
    if (!CFG.ENDPOINT && !LOCAL) { err.textContent = 'INSCHRIJVEN KAN EVEN NIET. SPELEN WEL!'; return false; }
    // Pas iets beweren als de backend bevestigd heeft dat de rij aangekomen is.
    // Zolang dat niet zo is, blijft het formulier staan en blijft de rij in de
    // outbox, zodat ze bij een volgend bezoek alsnog vertrekt.
    const knop = f.querySelector('button[type=submit]');
    const knopLabel = knop ? knop.textContent : '';
    if (knop) { knop.disabled = true; knop.textContent = 'BEZIG...'; }
    send({
      type: 'news', email, at: new Date().toISOString(),
      optin_regoli: optinRegoli ? 'ja' : 'nee',
      optin_sony: optinSony ? 'ja' : 'nee'
    }).then(uitkomst => {
      if (knop) { knop.disabled = false; knop.textContent = knopLabel; }
      if (uitkomst === 'ok') {
        STORE.set(NEWS_KEY, 'done');
        if (doneEl) markNewsDone();
        return;
      }
      err.textContent = uitkomst === 'geweigerd'
        ? 'DIT ADRES WERD NIET AANVAARD. CONTROLEER HET.'
        : 'INSCHRIJVEN LUKT EVEN NIET. WE PROBEREN HET STRAKS OPNIEUW.';
    });
    return true;
  }

  // ---- game-koppeling ------------------------------------------------------
  function startGame() {
    // Elke start is een user gesture: ontgrendel/hervat audio hier, zodat ook
    // de EERSTE run muziek heeft.
    AUD.unlock();
    show(null);
    $('share-view').hidden = true;
    ping('play');
    window.MILKRUN_GAME.start();
  }

  function fmtScore(n) { return String(n).padStart(5, '0'); }

  function onEnd(res) {
    lastRes = res;
    ping(res.win ? 'win' : 'over');
    $('end-title').textContent = res.win ? 'U WIN' : 'GAME OVER';
    // ook een verlies is een prestatie (fix 3/7): toon hoe ver je vloog
    $('end-sub').textContent = res.win
      ? 'JE VLOOG 30 JAAR MILK INC. UIT'
      : (res.year >= 2026
          ? 'JE HAALDE 2026 · NET NIET GELAND'
          : res.year > 1996
          ? 'JE VLOOG ' + (res.year - 1996) + ' JAAR VER · TOT ' + res.year
          : 'GESTRAND BIJ DE START · DE KOE WIL NOG EENS');
    $('end-score').textContent = fmtScore(res.score);
    const best = Math.max(res.score, parseInt(STORE.get(BEST_KEY) || '0', 10));
    STORE.set(BEST_KEY, String(best));
    $('end-best').textContent = 'BESTE SCORE: ' + fmtScore(best);

    // uitdaging (deep-link ?beat=): vier winst of toon het te kloppen doel
    const ch = $('end-challenge');
    if (ch) {
      if (challenge && res.score > challenge) {
        ch.textContent = 'JE KLOPTE DE UITDAGING · ' + fmtScore(challenge);
        ch.hidden = false;
      } else if (challenge) {
        ch.textContent = 'NOG NIET GEKLOPT · DOEL ' + fmtScore(challenge);
        ch.hidden = false;
      } else {
        ch.hidden = true;
      }
    }

    show('end');
  }

  // ---- de show op het eindscherm -------------------------------------------
  // Leest ALLES uit config.js. Na EVENT_UNTIL valt de ticketknop vanzelf weg en
  // blijft de tijdloze regel staan, zodat dit scherm niet opnieuw veroudert.
  function paintEvent() {
    const tix = $('cta-tickets'), line = $('event-line'), meta = $('event-meta');
    if (CFG.EVENT_URL && CFG.eventActive(new Date())) {
      tix.href = CFG.EVENT_URL;
      tix.hidden = false;
      line.textContent = CFG.EVENT_LINE;
      meta.textContent = CFG.EVENT_META;
      meta.hidden = false;
    } else {
      tix.hidden = true;
      line.textContent = CFG.EVERGREEN_LINE;
      meta.textContent = '';
      meta.hidden = true;
    }
  }

  // ---- events --------------------------------------------------------------
  $('btn-start').addEventListener('click', () => { AUD.unlock(); startGame(); });

  newsForm.addEventListener('submit', e => {
    e.preventDefault();
    handleNews(newsForm, $('news-done'));
  });

  $('btn-replay').addEventListener('click', () => { AUD.unlock(); startGame(); });
  $('cta-tickets').addEventListener('click', () => ping('tickets'));

  // Deel-knop: succes alleen claimen als het kopiëren echt lukte.
  const shareBtn = $('btn-share');
  const shareLabel = shareBtn.textContent;
  let shareTimer = null;
  function legacyCopy(text) {
    return new Promise((res, rej) => {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      ok ? res() : rej(new Error('copy faalde'));
    });
  }
  // Android-webviews HEBBEN navigator.clipboard maar weigeren writeText vaak
  // (NotAllowedError): bij een reject alsnog de execCommand-weg proberen
  // (review r3, bevestigd: anders faalt KOPIEER DE LINK exact in de webviews
  // waarvoor de viewer gebouwd is).
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(() => legacyCopy(text));
    }
    return legacyCopy(text);
  }
  function flashShare(text) {
    clearTimeout(shareTimer);
    shareBtn.textContent = text;
    shareTimer = setTimeout(() => { shareBtn.textContent = shareLabel; }, 1600);
  }
  function resetShare() { clearTimeout(shareTimer); shareBtn.textContent = shareLabel; }

  function shareUrlWith(score) {
    const u = CFG.SHARE_URL || '';
    return u + (u.indexOf('?') > -1 ? '&' : '?') + 'beat=' + score;
  }
  // Vergelijkende share (fix 3/7, de Wordle-les): een vraag lokt een antwoord uit.
  function shareText(res) {
    const url = shareUrlWith(res.score);
    if (res.win) {
      return 'IK VLOOG 30 JAAR MILK INC. UIT · SCORE ' + fmtScore(res.score) +
        '. KLOP JE MIJ? ' + url;
    }
    if (res.year >= 2026) {
      // verder dan 2026 kan niet: bij een verlies in het eindjaar wordt de
      // score de uitdaging (review r3)
      return 'IK HAALDE 2026 IN MILK RUN · SCORE ' + fmtScore(res.score) +
        '. KLOP JE MIJN SCORE? ' + url;
    }
    if (res.year) {
      return 'IK GERAAKTE TOT ' + res.year + ' IN MILK RUN · SCORE ' + fmtScore(res.score) +
        '. KAN JIJ VERDER? ' + url;
    }
    return 'IK VLOOG DOOR 30 JAAR MILK INC. · SCORE ' + fmtScore(res.score) +
      '. KLOP JE MIJ? ' + url;
  }
  // share_ok telt maximaal ÉÉN keer per share_tap (review r3: anders kan de
  // kopieerknop de conversieratio boven 100% duwen).
  let shareOkSent = false;
  function shareOk() {
    if (shareOkSent) return;
    shareOkSent = true;
    ping('share_ok');
  }

  function textShare(text) {
    if (navigator.share && !WEBVIEW) {
      navigator.share({ text }).then(() => { shareOk(); resetShare(); }).catch(resetShare);
      return;
    }
    copyText(text).then(
      () => { shareOk(); flashShare('GEKOPIEERD!'); },
      () => flashShare('KOPIËREN LUKTE NIET')
    );
  }
  function downloadCard(out, text) {
    if (out && out.blob && window.URL && URL.createObjectURL) {
      try {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(out.blob);
        a.download = 'milk-run-score.png';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
        copyText(text).catch(() => {});
        flashShare('KAART OPGESLAGEN');
        shareOk();
        return;
      } catch (e) {}
    }
    textShare(text);
  }

  shareBtn.addEventListener('click', () => {
    ping('share_tap'); // taps en voltooide shares apart meten (fix 3/7)
    shareOkSent = false;
    const res = lastRes || {
      win: $('end-title').textContent === 'U WIN',
      score: parseInt($('end-score').textContent, 10) || 0,
      year: 0
    };
    const text = shareText(res);
    // 1) probeer een ÉCHTE afbeelding te delen (score-card) — dat is wat mensen delen
    if (window.MILKRUN_SHARECARD && (WEBVIEW || navigator.canShare)) {
      flashShare('KAART MAKEN...');
      window.MILKRUN_SHARECARD.build(res).then(out => {
        if (WEBVIEW) { openCardViewer(out, text); return; } // in-app browser: viewer is het hoofdpad
        if (out.file && navigator.canShare({ files: [out.file] })) {
          navigator.share({ files: [out.file], text, title: 'MILK RUN' })
            .then(() => { shareOk(); resetShare(); }).catch(resetShare);
        } else if (navigator.share) {
          navigator.share({ text }).then(() => { shareOk(); resetShare(); })
            .catch(err => {
              // annuleren is geen falen: geen download, geen share_ok (review r3)
              if (err && err.name === 'AbortError') { resetShare(); return; }
              downloadCard(out, text);
            });
        } else {
          downloadCard(out, text);
        }
      }).catch(() => textShare(text));
    } else {
      textShare(text);
    }
  });

  // ---- score-kaart-viewer (webview-hoofdpad): tonen, link kopiëren, sluiten ----
  const shareView = $('share-view'), shareImg = $('share-img');
  const copyBtn = $('btn-copylink');
  const copyLabel = copyBtn.textContent;
  let copyTimer = null, shareImgUrl = null;
  function flashCopy(t) {
    clearTimeout(copyTimer);
    copyBtn.textContent = t;
    copyTimer = setTimeout(() => { copyBtn.textContent = copyLabel; }, 1600);
  }
  function openCardViewer(out, text) {
    resetShare();
    try {
      if (shareImgUrl) { URL.revokeObjectURL(shareImgUrl); shareImgUrl = null; }
      if (out && out.blob && window.URL && URL.createObjectURL) {
        shareImgUrl = URL.createObjectURL(out.blob);
        shareImg.src = shareImgUrl;
      } else if (out && out.canvas) {
        shareImg.src = out.canvas.toDataURL('image/png');
      } else { textShare(text); return; }
      shareView.hidden = false;
    } catch (e) { textShare(text); }
  }
  $('btn-shareclose').addEventListener('click', () => { shareView.hidden = true; });
  copyBtn.addEventListener('click', () => {
    const res = lastRes || {
      win: $('end-title').textContent === 'U WIN',
      score: parseInt($('end-score').textContent, 10) || 0,
      year: 0
    };
    copyText(shareText(res)).then(
      () => { shareOk(); flashCopy('GEKOPIEERD!'); },
      () => flashCopy('KOPIËREN LUKTE NIET')
    );
  });

  const mute = $('btn-mute');
  function muteLabel() { mute.textContent = AUD.isMuted() ? 'GELUID: UIT' : 'GELUID: AAN'; }
  mute.addEventListener('click', () => { AUD.setMuted(!AUD.isMuted()); muteLabel(); });
  muteLabel();

  // ---- init ----------------------------------------------------------------
  window.MILKRUN_GAME.init({
    stage: $('stage'),
    canvas: $('game'),
    hud: {
      year: $('hud-year'), label: $('hud-label'),
      score: $('hud-score'), meter: $('hud-meter'), banner: $('banner'),
      strip: $('strip'), tutor: $('tutor')
    },
    onEnd
  });
  // Uitdaging via ?beat=score: toon het op de splash (fix 2/7 punt 4).
  (function initChallenge() {
    const m = /[?&]beat=(\d{1,7})/.exec(location.search);
    if (!m) return;
    challenge = parseInt(m[1], 10) || 0;
    const el = $('challenge');
    if (challenge && el) { el.textContent = 'JE BENT UITGEDAAGD · KLOP ' + fmtScore(challenge); el.hidden = false; }
  })();
  migrateLegacy();
  if (STORE.get(NEWS_KEY) === 'done') markNewsDone();
  paintEvent();
  flushOutbox();
  show('splash');
})();
