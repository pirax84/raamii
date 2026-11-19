/* Moteur de jeu du Rami (indépendant de l'interface). */
(function (G) {
  'use strict';
  var R = (G.Rami = G.Rami || {});
  var C = R.CONFIG;

  function T(k, fb, v) { return R.t ? R.t(k, v) : fb; }
  function clone(x) { return JSON.parse(JSON.stringify(x)); }

  function Game(cfg) {
    this.cfg = cfg;
    this.rng = cfg.rng || Math.random;
    this.P = cfg.players.map(function (p, i) {
      return { id: i, name: p.name, human: !!p.human, level: p.level || 'medium', color: p.color, hand: [], opened: false, turns: 0, total: 0, last: 0 };
    });
    this.rounds = cfg.rounds || C.rounds;
    this.round = 0; this.listeners = []; this.melds = []; this.stock = []; this.discard = []; this.reserve = null;
    this.turn = 0; this.phase = 'idle'; this.ended = false; this.nextMeldId = 1;
  }
  var proto = Game.prototype;
  proto.on = function (fn) { this.listeners.push(fn); };
  proto.emit = function (type, data) { var s = this; this.listeners.forEach(function (f) { f(type, data || {}, s); }); };
  proto.cur = function () { return this.P[this.turn]; };

  proto.startRound = function () {
    var deck = R.shuffle(R.makeDeck(), this.rng), n = this.P.length;
    this.P.forEach(function (p) { p.hand = []; p.opened = false; p.turns = 0; p.last = 0; });
    for (var k = 0; k < C.handSize; k++) for (var i = 0; i < n; i++) this.P[i].hand.push(deck.pop());
    this.discard = [deck.pop()]; this.reserve = C.reserve ? deck.pop() : null; this.stock = deck;
    this.melds = []; this.round++; this.over = false; this.winner = null; this.sec = false;
    this.turn = (this.round - 1) % n; this.beginTurn();
    this.emit('roundStart', { round: this.round });
  };

  proto.beginTurn = function () {
    var p = this.cur();
    this.phase = 'draw'; this.took = null; this.openedAtStart = p.opened; this.aiTurn = null;
    this.snap = clone({ hand: p.hand, stock: this.stock, discard: this.discard, reserve: this.reserve, melds: this.melds, opened: p.opened });
    this.emit('turn', { pid: p.id });
  };

  proto.canTake = function (pid, src) {
    var p = this.P[pid];
    if (pid !== this.turn || this.phase !== 'draw' || this.over) return false;
    if (src === 'stock') return this.stock.length > 0 || this.discard.length > 1;
    if (src === 'discard') return (p.turns >= 1 || !C.discardBanFirst) && this.discard.length > 0;
    if (src === 'reserve') return !!this.reserve && !p.opened;
    return false;
  };

  proto.draw = function (pid, src) {
    if (!this.canTake(pid, src)) return { ok: false, err: T('eCantDraw', 'Tu ne peux pas piocher ici maintenant.') };
    var p = this.P[pid], c;
    if (src === 'stock') {
      if (!this.stock.length) { var top = this.discard.pop(); this.stock = R.shuffle(this.discard, this.rng); this.discard = [top]; this.emit('reshuffle'); }
      c = this.stock.pop();
    } else if (src === 'discard') { c = this.discard.pop(); this.took = 'discard'; }
    else { c = this.reserve; this.reserve = null; this.took = 'reserve'; }
    p.hand.push(c); this.phase = 'play'; this.lastDrawn = c.id;
    this.emit('draw', { pid: pid, src: src, card: c });
    return { ok: true, card: c };
  };

  proto.findCards = function (p, ids) {
    var out = [];
    for (var i = 0; i < ids.length; i++) { var c = p.hand.filter(function (x) { return x.id === ids[i]; })[0]; if (!c) return null; out.push(c); }
    return out;
  };
  proto.removeFromHand = function (p, ids) { p.hand = p.hand.filter(function (c) { return ids.indexOf(c.id) < 0; }); };

  proto.provMelds = function (pid) { return this.melds.filter(function (m) { return m.owner === pid && m.prov; }); };

  proto.meld = function (pid, ids) {
    var p = this.P[pid];
    if (pid !== this.turn || this.phase !== 'play') return { ok: false, err: T('eNotNow', T('eNotNow', "Ce n'est pas le moment.")) };
    var cards = this.findCards(p, ids); if (!cards) return { ok: false, err: T('eNoCard', 'Carte introuvable.') };
    var m = R.arrange(cards);
    if (!m) return { ok: false, err: T('eInvalid', 'Combinaison invalide.') };
    m.id = this.nextMeldId++; m.owner = pid; m.prov = !p.opened;
    this.melds.push(m); this.removeFromHand(p, ids);
    this.emit('meld', { pid: pid, meld: m });
    if (!p.opened) {
      var st = R.openingStatus(this.provMelds(pid));
      if (st.ok) { p.opened = true; this.melds.forEach(function (x) { if (x.owner === pid) x.prov = false; }); this.emit('open', { pid: pid }); }
    }
    if (!p.hand.length) this.finish(pid);
    return { ok: true, meld: m };
  };

  proto.openingInfo = function (pid) { return R.openingStatus(this.provMelds(pid)); };

  proto.attach = function (pid, meldId, cardId) {
    var p = this.P[pid];
    if (pid !== this.turn || this.phase !== 'play') return { ok: false, err: T('eNotNow', "Ce n'est pas le moment.") };
    if (!p.opened) return { ok: false, err: T(C.needPure ? 'eMustOpen' : 'eMustOpenC', 'Il faut ouvrir.') };
    var meld = this.melds.filter(function (m) { return m.id === meldId; })[0];
    var card = this.findCards(p, [cardId]); if (!meld || !card) return { ok: false, err: T('eNoCard', 'Introuvable.') };
    var nm = R.tryAttach(meld, card[0]);
    if (!nm) return { ok: false, err: T('eNoFit', 'Ne va pas.') };
    meld.cards = nm.cards; meld.rank = nm.rank; meld.suit = nm.suit; meld.pure = nm.pure;
    this.removeFromHand(p, [cardId]);
    this.emit('attach', { pid: pid, meld: meld, card: card[0] });
    if (!p.hand.length) this.finish(pid);
    return { ok: true };
  };

  proto.rollback = function (reason) {
    var p = this.cur(), s = clone(this.snap);
    p.hand = s.hand; this.stock = s.stock; this.discard = s.discard; this.reserve = s.reserve; this.melds = s.melds; p.opened = s.opened;
    this.phase = 'draw'; this.took = null; this.aiTurn = null;
    this.emit('rollback', { pid: p.id, reason: reason });
  };

  // défausse = fin de tour (nom discard_ pour ne pas masquer la pile this.discard)
  proto.discard_ = function (pid, cardId) {
    var p = this.P[pid];
    if (pid !== this.turn || this.phase !== 'play') return { ok: false, err: T('eNotNow', "Ce n'est pas le moment.") };
    var cs = this.findCards(p, [cardId]); if (!cs) return { ok: false, err: T('eNoCard', 'Carte introuvable.') };
    if (!p.opened && this.provMelds(pid).length) { this.rollback(T(C.needPure ? 'rbOpen' : 'rbOpenC', 'Ouverture incomplète.')); return { ok: false, rolled: true }; }
    if (C.discardMustOpen && this.took === 'discard' && !this.openedAtStart && !p.opened) { this.rollback(T('rbDiscard', 'Il faut ouvrir pendant ce tour.')); return { ok: false, rolled: true }; }
    var last = p.hand.length === 1;
    if (this.took === 'reserve' && !last) { this.rollback(T('rbReserve', 'Seulement pour finir sec.')); return { ok: false, rolled: true }; }
    this.removeFromHand(p, [cardId]); this.discard.push(cs[0]); p.turns++;
    this.emit('discard', { pid: pid, card: cs[0] });
    if (!p.hand.length) { this.finish(pid); return { ok: true }; }
    this.turn = (this.turn + 1) % this.P.length; this.beginTurn();
    return { ok: true };
  };

  proto.finish = function (pid) {
    var self = this, w = this.P[pid]; this.over = true; this.winner = pid; this.phase = 'over';
    this.sec = !this.openedAtStart && this.round > 0;
    var pen = this.sec ? C.penaltySec : C.penaltyClassic, rows = [];
    this.P.forEach(function (q) {
      var pts = 0, why = '';
      if (q.id === pid) { pts = 0; why = self.sec ? T('gWhySec', 'Fin sec') : T('gWhyWin', 'Sorti'); }
      else if (!q.opened) { pts = pen; why = T('gWhyNot', 'Pas ouvert : ' + pen, { n: pen }); }
      else { pts = R.handTotal(q.hand); why = T('gWhyHand', 'Cartes en main'); }
      q.last = pts; q.total += pts; rows.push({ pid: q.id, name: q.name, pts: pts, total: q.total, why: why });
    });
    this.emit('roundEnd', { winner: pid, sec: this.sec, rows: rows, last: this.round >= this.rounds });
  };

  proto.nextRound = function () {
    if (this.round >= this.rounds) { this.ended = true; var rk = this.P.slice().sort(function (a, b) { return a.total - b.total; }); this.emit('gameEnd', { ranking: rk.map(function (p) { return { pid: p.id, name: p.name, total: p.total, human: p.human }; }) }); return; }
    this.startRound();
  };

  R.Game = Game;
})(typeof window !== 'undefined' ? window : globalThis);
