/* Fidélisation : cadeau du jour (série de 7 jours), 3 défis par jour, expérience et niveaux.
   Tout est gratuit et se sauvegarde sur l'appareil (et sur le compte en ligne si connecté). */
(function (G) {
  var R = (G.Rami = G.Rami || {});
  var S = function () { return R.Store; };
  var DAILY = [20, 30, 40, 50, 60, 80, 150];
  var POOL = [
    { id: 'play', goal: 1, coins: 30, xp: 40 }, { id: 'win', goal: 1, coins: 60, xp: 80 }, { id: 'meld', goal: 5, coins: 40, xp: 50 },
    { id: 'open', goal: 2, coins: 40, xp: 50 }, { id: 'rounds', goal: 3, coins: 30, xp: 40 }, { id: 'joker', goal: 1, coins: 40, xp: 50 }, { id: 'sec', goal: 1, coins: 100, xp: 150 }
  ];
  function day(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function yesterday() { var d = new Date(); d.setDate(d.getDate() - 1); return day(d); }
  function seedRand(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return R.mulberry32(h >>> 0); }
  function need(l) { return 100 * l * (l + 1) / 2; } // XP total pour passer le niveau l
  var P = R.Progress = {
    DAILY: DAILY,
    daily: function () { return S().get('daily') || { streak: 0, last: null }; },
    canClaim: function () { return this.daily().last !== day(); },
    dayIndex: function () { var d = this.daily(); if (d.last === day()) return (d.streak - 1) % 7; return d.last === yesterday() ? d.streak % 7 : 0; },
    claimDaily: function () {
      if (!this.canClaim()) return 0; var d = this.daily(), i = this.dayIndex(), n = DAILY[i];
      S().set('daily', { streak: (d.last === yesterday() ? d.streak : 0) + 1, last: day() }); R.Shop.earn(n); this.addXp(10); return n;
    },
    missions: function () {
      var m = S().get('missions');
      if (!m || m.day !== day()) {
        var rnd = seedRand('raamii' + day()), pool = POOL.slice(), list = [];
        while (list.length < 3) { var k = Math.floor(rnd() * pool.length); var x = pool.splice(k, 1)[0]; list.push({ id: x.id, goal: x.goal, coins: x.coins, xp: x.xp, prog: 0, claimed: false }); }
        m = { day: day(), list: list }; S().set('missions', m);
      }
      return m.list;
    },
    track: function (id, n) {
      var l = this.missions(), ch = false;
      l.forEach(function (x) { if (x.id === id && x.prog < x.goal) { x.prog = Math.min(x.goal, x.prog + (n || 1)); ch = true; } });
      if (ch) S().set('missions', { day: day(), list: l });
    },
    claimMission: function (id) {
      var l = this.missions(), got = null;
      l.forEach(function (x) { if (x.id === id && x.prog >= x.goal && !x.claimed) { x.claimed = true; got = x; } });
      if (!got) return null; S().set('missions', { day: day(), list: l }); R.Shop.earn(got.coins); var up = this.addXp(got.xp); return { coins: got.coins, xp: got.xp, up: up };
    },
    pending: function () { return (this.canClaim() ? 1 : 0) + this.missions().filter(function (x) { return x.prog >= x.goal && !x.claimed; }).length; },
    xp: function () { return S().get('xp') || 0; },
    level: function () { var x = this.xp(), l = 1; while (x >= need(l)) l++; return l; },
    levelInfo: function () { var l = this.level(), a = need(l - 1), b = need(l); return { level: l, have: this.xp() - a, span: b - a }; },
    addXp: function (n) { var before = this.level(); S().set('xp', this.xp() + n); var after = this.level(); if (after > before) { var c = 50 * after; R.Shop.earn(c); return { level: after, coins: c }; } return null; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
