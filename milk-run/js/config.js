// MILK RUN — centrale configuratie.
// Alles wat ooit moet wisselen, wisselt HIER, nergens anders.
//
// 2026-09-01: de Zomerhit-campagne en de wedstrijd zijn afgelopen (finale 29/8;
// Milk Inc. haalde de finale niet). De game blijft als tijdloos Milk Inc.-spel.
// Alle campagnevelden (VOTE_URL, UTM, ROUND_*, FINALE, votingRound) zijn weg.

window.MILKRUN_CONFIG = {
  // Google Apps Script web-app URL (backend/RUNBOOK.md). Draagt nu enkel nog
  // de anonieme tellers + de vrijblijvende nieuwsbrief-opt-in.
  ENDPOINT: 'https://script.google.com/macros/s/AKfycbyaKckaXBJ1leG_FAiK8v0XxB0w03-4h8wqKFaaquwR-EegiwJc0p3s9xssdY02Kv61og/exec',

  // ---- de show, ÉÉN keer gedefinieerd -------------------------------------
  // De les van de campagne: "23+24 OKT" stond op zeven plaatsen hard gecodeerd,
  // dus elke wijziging was een jacht door acht bestanden. Splash, eindscherm en
  // score-kaart lezen nu allemaal HIER. Na EVENT_UNTIL valt alles automatisch
  // terug op EVERGREEN_LINE en verdwijnt de ticketknop. Eén datum, één bestand.
  EVENT_LINE: 'MILK INC. FOREVER · AFAS DOME',
  EVENT_META: '23 + 24 OKT 2026',
  EVENT_URL: 'https://www.afas-dome.be/nl/evenement/milk-inc-4fceea50',
  EVENT_UNTIL: '2026-10-25T00:00:00+02:00',
  EVERGREEN_LINE: 'MILK INC. · 1996 → 2026',

  // Het 2014-eerbetoon ("HET WERD STIL") staat UIT tot Regi & Linda hun zegen
  // geven; de veilige versie is een puur muzikale pauze zonder tekst.
  SHOW_2014_TRIBUTE: false,

  // DE soundtrack: Lesters "MEDICINE 8-bit - MILK RUN", geloopt over de hele
  // run (bron: brand-assets/milk-inc/audio/8bit/medicine-milk-run.mp3).
  // De 2014-stilte dimt ze, The Return brengt ze terug.
  SOUNDTRACK: 'assets/audio/milk-run.m4a',
  SOUNDTRACK_OFFSET: 0,

  SHARE_URL: 'https://popcornbrains.com/milk-run/',

  // Het merk-adres onderaan de deel-kaart. De game LEEFT op popcornbrains.com
  // (de deep-link ?beat= blijft daarheen wijzen), maar de kaart draagt het
  // publieksmerk milkinc.be, dat is waar fans Milk Inc. kennen.
  SHARE_CARD_HOST: 'milkinc.be'
};

// Veilige opslag: Safari met "Blokkeer alle cookies" gooit op localStorage;
// dan vallen we terug op een in-memory object zodat PRESS START blijft werken.
window.MILKRUN_STORE = (function () {
  const mem = {};
  return {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return (k in mem) ? mem[k] : null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { mem[k] = v; } },
    remove(k) { try { localStorage.removeItem(k); } catch (e) { delete mem[k]; } }
  };
})();

// Loopt de show nog? Faalt de datum ooit te parsen, dan behandelen we hem als
// voorbij: liever de tijdloze regel dan een dode ticketknop.
window.MILKRUN_CONFIG.eventActive = function (now) {
  const until = new Date(this.EVENT_UNTIL).getTime();
  if (!isFinite(until)) return false;
  return (now || new Date()).getTime() < until;
};
