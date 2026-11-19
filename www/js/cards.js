/* Cartes : 108 cartes = 2 jeux de 52 + 4 jokers. r : 1 (As) à 13 (Roi), 0 = joker. */
(function (G) {
  'use strict';
  var R = (G.Rami = G.Rami || {});
  var SUITS = ['S', 'H', 'D', 'C']; // Pique, Coeur, Carreau, Trèfle
  var SUIT_NAMES = { S: 'pique', H: 'cœur', D: 'carreau', C: 'trèfle' };
  function label(r) { return r === 1 ? 'A' : r === 11 ? 'J' : r === 12 ? 'Q' : r === 13 ? 'K' : r === 0 ? 'JK' : String(r); }
  function nameOf(c) {
    if (c.joker) return 'Joker';
    var n = { 1: 'As', 11: 'Valet', 12: 'Dame', 13: 'Roi' }[c.r] || String(c.r);
    return n + ' de ' + SUIT_NAMES[c.s];
  }
  function makeDeck() {
    var d = [], id = 0, k, s, r;
    for (k = 0; k < 2; k++) for (s = 0; s < 4; s++) for (r = 1; r <= 13; r++) d.push({ id: id++, r: r, s: SUITS[s] });
    for (k = 0; k < 4; k++) d.push({ id: id++, r: 0, s: 'J', joker: true });
    return d;
  }
  function shuffle(a, rng) {
    rng = rng || Math.random;
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  R.SUITS = SUITS; R.label = label; R.nameOf = nameOf; R.makeDeck = makeDeck; R.shuffle = shuffle; R.mulberry32 = mulberry32;
})(typeof window !== 'undefined' ? window : globalThis);
