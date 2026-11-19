/* Règles du Rami de la maison (voir docs/REGLES.md).
   - 108 cartes, 6 joueurs, 14 cartes chacun
   - Ouverture : 51 points minimum, avec une tierce franche (suite pure d'une couleur, sans joker)
   - Valeurs : As = 1 (suite basse) ou 11 (après le Roi / seul en main), figures = 10, Joker = 75 en main */
(function (G) {
  'use strict';
  var R = (G.Rami = G.Rami || {});
  /* Deux jeux de règles au choix :
     - maison : ta règle (6 joueurs, 108 cartes, 14 cartes, 51 points avec tierce franche, défausse interdite au 1er tour,
                prendre la défausse = ouvrir pendant le tour, carte sous la pioche pour finir sec, Joker 75)
     - classique : Rami classique (13 cartes, 51 points sans obligation de tierce franche, défausse libre, pas de carte sous la pioche, Joker 50) */
  R.RULESETS = {
    maison: { players: 6, handSize: 14, openPoints: 51, needPure: true, reserve: true, discardBanFirst: true, discardMustOpen: true, penaltyClassic: 100, penaltySec: 200, jokerHand: 75 },
    classique: { players: 6, handSize: 13, openPoints: 51, needPure: false, reserve: false, discardBanFirst: false, discardMustOpen: false, penaltyClassic: 100, penaltySec: 200, jokerHand: 50 }
  };
  var CONFIG = R.CONFIG = Object.assign({ id: 'maison', rounds: 3 }, R.RULESETS.maison);
  R.setRules = function (id) { if (!R.RULESETS[id]) id = 'maison'; Object.assign(CONFIG, R.RULESETS[id]); CONFIG.id = id; return CONFIG; };

  function pv(r) { return r === 14 ? 11 : (r >= 10 && r <= 13) ? 10 : r; } // valeur d'une position (As haut = 11, As bas = 1)
  function strip(c) { return { id: c.id, r: c.r, s: c.s, joker: !!c.joker }; }

  function arrangeSet(cards) {
    var n = cards.length; if (n < 3 || n > 4) return null;
    var nat = cards.filter(function (c) { return !c.joker; });
    if (nat.length < 2) return null;
    var r0 = nat[0].r, seen = {}, i;
    for (i = 0; i < nat.length; i++) { if (nat[i].r !== r0 || seen[nat[i].s]) return null; seen[nat[i].s] = 1; }
    return { type: 'set', rank: r0, cards: cards.map(function (c) { var o = strip(c); o.as = r0; return o; }), pure: false };
  }

  function arrangeRun(cards) {
    var n = cards.length; if (n < 3 || n > 14) return null;
    var nat = cards.filter(function (c) { return !c.joker; });
    var jokers = cards.filter(function (c) { return c.joker; });
    if (nat.length < 2) return null;
    var s = nat[0].s, i;
    for (i = 0; i < nat.length; i++) if (nat[i].s !== s) return null;
    var hasAce = nat.some(function (c) { return c.r === 1; });
    var opts = hasAce ? [false, true] : [false];
    for (var o = 0; o < opts.length; o++) {
      var high = opts[o];
      var ranks = nat.map(function (c) { return c.r === 1 && high ? 14 : c.r; });
      var uniq = {}, dup = false; ranks.forEach(function (x) { if (uniq[x]) dup = true; uniq[x] = 1; });
      if (dup) continue;
      var lo = Math.min.apply(null, ranks), hi = Math.max.apply(null, ranks);
      var need = hi - lo + 1 - ranks.length; if (need > jokers.length) continue;
      var extra = jokers.length - need, len = hi - lo + 1 + extra;
      for (var st = Math.max(1, lo - extra); st <= lo; st++) {
        var en = st + len - 1; if (en < hi || en > 14) continue;
        var byRank = {}; nat.forEach(function (c) { byRank[c.r === 1 && high ? 14 : c.r] = c; });
        var ji = 0, out = [];
        for (var p = st; p <= en; p++) {
          var c = byRank[p];
          if (c) { var a = strip(c); a.as = p; out.push(a); } else { var j = strip(jokers[ji++]); j.as = p; out.push(j); }
        }
        return { type: 'run', suit: s, cards: out, pure: jokers.length === 0 };
      }
    }
    return null;
  }

  function arrange(cards) { return arrangeSet(cards) || arrangeRun(cards); }

  function meldPoints(m) {
    var t = 0;
    if (m.type === 'set') return pv(m.rank === 1 ? 14 : m.rank) * m.cards.length;
    m.cards.forEach(function (c) { t += pv(c.as); });
    return t;
  }
  function handValue(c) { return c.joker ? CONFIG.jokerHand : c.r === 1 ? 11 : pv(c.r); }
  function handTotal(cards) { return cards.reduce(function (a, c) { return a + handValue(c); }, 0); }

  function openingStatus(melds) {
    var pts = 0, pure = false;
    melds.forEach(function (m) { pts += meldPoints(m); if (m.type === 'run' && m.pure) pure = true; });
    return { points: pts, pure: pure, ok: pts >= CONFIG.openPoints && (pure || !CONFIG.needPure) };
  }

  function tryAttach(meld, card) {
    var cards = meld.cards.map(strip); cards.push(strip(card));
    var m = meld.type === 'set' ? arrangeSet(cards) : arrangeRun(cards);
    return m;
  }

  R.arrange = arrange; R.arrangeSet = arrangeSet; R.arrangeRun = arrangeRun; R.meldPoints = meldPoints;
  R.handValue = handValue; R.handTotal = handTotal; R.openingStatus = openingStatus; R.tryAttach = tryAttach; R.pv = pv;
})(typeof window !== 'undefined' ? window : globalThis);
