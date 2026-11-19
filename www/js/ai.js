/* Intelligence artificielle : 3 niveaux (easy = Débutant, medium = Malin, hard = Expert). */
(function (G) {
  'use strict';
  var R = (G.Rami = G.Rami || {});
  var SUITS = ['S', 'H', 'D', 'C'];
  function key(r, s) { return r + s; }

  // ---------- Recherche de combinaisons dans une main ----------
  function build(cards) {
    var cnt = {}, groups = {}, jokers = [];
    cards.forEach(function (c) {
      if (c.joker) { jokers.push(c); return; }
      var k = key(c.r, c.s); cnt[k] = (cnt[k] || 0) + 1; (groups[k] = groups[k] || []).push(c);
    });
    return { cnt: cnt, groups: groups, jokers: jokers };
  }

  function candidates(b) {
    var out = [], seen = {}, J = b.jokers.length;
    function add(keys, jk, fake) {
      var m = R.arrange(fake); if (!m) return;
      var sig = m.type + ':' + keys.slice().sort().join(',') + ':' + jk;
      if (seen[sig]) return; seen[sig] = 1;
      out.push({ keys: keys, jk: jk, pts: R.meldPoints(m), pure: m.pure && m.type === 'run', type: m.type });
    }
    var s, lo, hi, p;
    for (var si = 0; si < 4; si++) {
      s = SUITS[si];
      for (lo = 1; lo <= 12; lo++) for (hi = lo + 2; hi <= 14; hi++) {
        var keys = [], fake = [], miss = 0;
        for (p = lo; p <= hi; p++) {
          var r = p === 14 ? 1 : p, k = key(r, s);
          if (b.cnt[k]) { keys.push(k); fake.push({ r: r, s: s }); } else miss++;
          if (miss > 1) break;
        }
        if (miss > 1 || keys.length < 2 || miss > J) continue;
        for (var j = 0; j < miss; j++) fake.push({ r: 0, s: 'J', joker: true });
        add(keys, miss, fake);
      }
    }
    for (var r2 = 1; r2 <= 13; r2++) {
      var have = SUITS.filter(function (x) { return b.cnt[key(r2, x)]; });
      if (have.length >= 3) {
        var subs = [];
        if (have.length === 4) subs.push(have); 
        for (var a = 0; a < have.length; a++) { var sub = have.filter(function (_, i) { return i !== a; }); if (have.length === 4) subs.push(sub); }
        if (have.length === 3) subs.push(have);
        subs.forEach(function (sb) { add(sb.map(function (x) { return key(r2, x); }), 0, sb.map(function (x) { return { r: r2, s: x }; })); });
      }
      if (have.length >= 2 && J >= 1) {
        for (var i = 0; i < have.length; i++) for (var k2 = i + 1; k2 < have.length; k2++) {
          add([key(r2, have[i]), key(r2, have[k2])], 1, [{ r: r2, s: have[i] }, { r: r2, s: have[k2] }, { r: 0, s: 'J', joker: true }]);
        }
      }
    }
    out.sort(function (x, y) { return y.pts - x.pts; });
    return out;
  }

  // mode 'open' : maximiser les points (>= minPts, avec tierce franche) ; 'any' : maximiser ; 'out' : laisser le moins de cartes
  function search(cards, opt) {
    opt = opt || {};
    var b = build(cards), cands = candidates(b), best = null, nodes = 0;
    var cnt = Object.assign({}, b.cnt), J = b.jokers.length;
    var chosen = [], total = cards.length;
    function consider() {
      var pts = 0, pure = false, used = 0;
      chosen.forEach(function (c) { pts += c.pts; pure = pure || c.pure; used += c.keys.length + c.jk; });
      var left = total - used;
      var needP = R.CONFIG.needPure !== false, minO = R.CONFIG.openPoints || 51;
      if (opt.mode === 'open') { if (pts < (opt.minPts || minO) || (needP && !pure)) return; }
      if (opt.mode === 'out') { if (left > (opt.maxLeft || 0)) return; if (opt.needOpen && (pts < minO || (needP && !pure))) return; }
      if (opt.mustInclude && !chosen.some(function (c) { return c.keys.indexOf(opt.mustInclude) >= 0; })) return;
      var score = opt.mode === 'out' ? -left * 1000 + pts : pts;
      if (!best || score > best.score) best = { score: score, items: chosen.slice(), pts: pts, left: left };
    }
    function dfs(i) {
      if (++nodes > 25000) return;
      if (chosen.length) consider();
      for (var x = i; x < cands.length; x++) {
        var c = cands[x], okk = c.jk <= J, k;
        for (k = 0; okk && k < c.keys.length; k++) {
          var need = 0; for (var q = 0; q < c.keys.length; q++) if (c.keys[q] === c.keys[k]) need++;
          if ((cnt[c.keys[k]] || 0) < need) okk = false;
        }
        if (!okk) continue;
        c.keys.forEach(function (kk) { cnt[kk]--; }); J -= c.jk; chosen.push(c);
        dfs(x);
        chosen.pop(); J += c.jk; c.keys.forEach(function (kk) { cnt[kk]++; });
        if (nodes > 25000) return;
      }
    }
    dfs(0);
    if (!best) return null;
    // Réalisation : on associe de vraies cartes
    var pool = {}; Object.keys(b.groups).forEach(function (k) { pool[k] = b.groups[k].slice(); });
    var jk = b.jokers.slice(), melds = [];
    best.items.forEach(function (c) {
      var ids = c.keys.map(function (k) { return pool[k].pop().id; });
      for (var i = 0; i < c.jk; i++) ids.push(jk.pop().id);
      melds.push(ids);
    });
    return { melds: melds, points: best.pts, left: best.left };
  }

  // ---------- Heuristiques ----------
  function usefulness(card, hand) {
    if (card.joker) return 99;
    var u = 0;
    hand.forEach(function (o) {
      if (o.id === card.id || o.joker) return;
      if (o.r === card.r && o.s !== card.s) u += 3;
      if (o.r === card.r && o.s === card.s) u += 0.5;
      if (o.s === card.s) { var d = Math.abs(o.r - card.r); if (card.r === 1 && o.r >= 12) d = Math.min(d, 14 - o.r + 0); if (d === 1) u += 3; else if (d === 2) u += 1.5; }
    });
    return u;
  }
  function pickDiscard(hand, level, rng) {
    var cards = hand.filter(function (c) { return !c.joker; });
    if (!cards.length) return hand[0];
    var scored = cards.map(function (c) { return { c: c, s: R.handValue(c) * (level === 'easy' ? 0.2 : 0.55) - usefulness(c, hand) * 4 }; });
    scored.sort(function (a, b) { return b.s - a.s; });
    if (level === 'easy') return scored[Math.floor(rng() * Math.min(3, scored.length))].c;
    return scored[0].c;
  }

  function after(cards, add) { return cards.concat([add]); }

  // Décide d'où piocher
  function chooseSource(game, p) {
    var rng = game.rng, level = p.level;
    var top = game.discard[game.discard.length - 1];
    var canD = game.canTake(p.id, 'discard'), canR = game.canTake(p.id, 'reserve');
    if (level === 'hard' && canR) {
      var r = search(after(p.hand, game.reserve), { mode: 'out', maxLeft: 1, needOpen: !p.opened });
      if (r) return 'reserve';
    }
    if (canD && level !== 'easy') {
      var k = key(top.r, top.s);
      if (!p.opened) {
        var o = search(after(p.hand, top), { mode: 'open', mustInclude: top.joker ? undefined : k });
        var o0 = search(p.hand, { mode: 'open' });
        if (o && (!o0 || o.points > o0.points + 5) && (level === 'hard' || !o0)) return 'discard';
      } else if (level === 'hard' || rng() < 0.6) {
        var a = search(after(p.hand, top), { mode: 'any', mustInclude: top.joker ? undefined : k });
        var a0 = search(p.hand, { mode: 'any' });
        if (a && (!a0 || a.points > a0.points)) return 'discard';
      }
    }
    return 'stock';
  }

  // Une action par appel ; renvoie false si aucune action possible (on défausse alors).
  function step(game, p) {
    var rng = game.rng, level = p.level;
    if (game.phase === 'draw') { game.draw(p.id, chooseSource(game, p)); return; }
    // phase 'play'
    var st = game.aiTurn = game.aiTurn || { pid: p.id, n: 0 };
    if (st.pid !== p.id) st = game.aiTurn = { pid: p.id, n: 0 };
    if (++st.n > 40) { return finishTurn(game, p); }
    var hand = p.hand;
    if (st.queue && st.queue.length) { var ids = st.queue.shift(); var rq = game.meld(p.id, ids); if (rq.ok || game.over) return; st.queue = []; }
    // 1) fin sèche / sortie complète si possible
    if (!p.opened) {
      var out = search(hand, { mode: 'out', maxLeft: 1, needOpen: true });
      if (out && (out.left === 0 || level !== 'easy')) { return layAll(game, p, out); }
      var o = search(hand, { mode: 'open' });
      if (o && !(level === 'easy' && rng() < 0.25)) { return layAll(game, p, o); }
      return discard(game, p);
    }
    // ouverte : poser de nouvelles combinaisons
    var more = search(hand, { mode: 'any' });
    if (more && (level !== 'easy' || rng() < 0.7)) {
      var first = more.melds[0];
      var r = game.meld(p.id, first); if (r.ok) return; 
    }
    // coller des cartes sur les combinaisons de la table
    if (level !== 'easy' || rng() < 0.6) {
      for (var i = 0; i < hand.length; i++) {
        for (var m = 0; m < game.melds.length; m++) {
          if (game.melds[m].prov && game.melds[m].owner !== p.id) continue;
          if (R.tryAttach(game.melds[m], hand[i])) { var rr = game.attach(p.id, game.melds[m].id, hand[i].id); if (rr.ok) return; }
        }
      }
    }
    return discard(game, p);
  }
  function layAll(game, p, res) { // pose la première combinaison ; les suivantes sont mises en file d'attente
    game.aiTurn.queue = res.melds.slice(1);
    var r = game.meld(p.id, res.melds[0]);
    if (!r.ok) { game.aiTurn.queue = []; return discard(game, p); }
  }
  function discard(game, p) { game.discard_(p.id, pickDiscard(p.hand, p.level, game.rng).id); }
  function finishTurn(game, p) { discard(game, p); }

  R.AI = { search: search, step: step, usefulness: usefulness };
})(typeof window !== 'undefined' ? window : globalThis);
