/* Sauvegarde locale (réglages + classement avec prénoms). */
(function (G) {
  var R = (G.Rami = G.Rami || {});
  var KEY = 'raamii-v1';
  var def = { theme: 'dark', style: 'joker', lang: 'auto', rules: 'maison', full: true, felt: 'auto', faces: 'light', help: true, chat: false, chatPos: null, coins: 0, owned: [], back: 'nuit', music: true, track: 'calm', volume: 0.5, sfx: true, speed: 1, orient: 'auto', name: '', rank: {}, level: 'medium', rounds: 3 };
  function load() { try { var raw = localStorage.getItem(KEY); return Object.assign({}, def, JSON.parse(raw || '{}')); } catch (e) { return Object.assign({}, def); } }
  var data = load();
  R.Store = {
    get: function (k) { return data[k]; },
    set: function (k, v) { data[k] = v; if (k !== '_ts') data._ts = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {} if (k !== '_ts' && R.Cloud) R.Cloud.changed(); },
    recordGame: function (ranking) {
      var rk = data.rank || {};
      ranking.forEach(function (r, i) {
        if (!r.human) return;
        var e = rk[r.name] || { games: 0, wins: 0, best: null, points: 0 };
        e.games++; if (i === 0) e.wins++; e.points += r.total; if (e.best == null || r.total < e.best) e.best = r.total; rk[r.name] = e;
      });
      this.set('rank', rk);
    },
    table: function () {
      var rk = data.rank || {};
      return Object.keys(rk).map(function (n) { return { name: n, games: rk[n].games, wins: rk[n].wins, best: rk[n].best, avg: Math.round(rk[n].points / rk[n].games) }; })
        .sort(function (a, b) { return b.wins - a.wins || a.avg - b.avg; });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
