/* Boutique et monétisation.
   - Pièces : gagnées en jouant (gratuit, fonctionne déjà).
   - Dos de cartes : achetables avec les pièces (fonctionne déjà).
   - Achats intégrés (packs de pièces), pubs récompensées, VIP, tournois : structures prêtes,
     désactivées tant qu'aucun fournisseur (Google Play Billing, AdMob, serveur) n'est branché. Rien n'est jamais facturé ici. */
(function (G) {
  var R = (G.Rami = G.Rami || {});
  var S = function () { return R.Store; };
  var BACKS = [{ id: 'nuit', price: 0 }, { id: 'aurore', price: 100 }, { id: 'lagon', price: 150 }, { id: 'corail', price: 200 }];
  R.Shop = {
    BACKS: BACKS,
    REWARD: { game: 10, win: 50 },
    coins: function () { return S().get('coins') || 0; },
    earn: function (n) { S().set('coins', this.coins() + n); return n; },
    owns: function (id) { var b = BACKS.filter(function (x) { return x.id === id; })[0]; return !!b && (b.price === 0 || (S().get('owned') || []).indexOf(id) >= 0); },
    buy: function (id) {
      var b = BACKS.filter(function (x) { return x.id === id; })[0]; if (!b) return { ok: false };
      if (this.owns(id)) return { ok: true };
      if (this.coins() < b.price) return { ok: false, err: 'notEnough' };
      S().set('coins', this.coins() - b.price); var o = (S().get('owned') || []).slice(); o.push(id); S().set('owned', o); return { ok: true };
    },
    equip: function (id) { if (this.owns(id)) S().set('back', id); },
    /* Achats intégrés : à brancher plus tard (ex. Google Play Billing via Capacitor). */
    IAP: { provider: null, products: [{ id: 'coins_500', coins: 500 }, { id: 'coins_1500', coins: 1500 }, { id: 'coins_5000', coins: 5000 }],
      ready: function () { return !!this.provider; }, purchase: function () { return Promise.reject(new Error('not_configured')); } },
    /* Pubs récompensées : à brancher plus tard (ex. AdMob). */
    Ads: { provider: null, reward: 30, ready: function () { return !!this.provider; }, showRewarded: function () { return Promise.reject(new Error('not_configured')); } },
    /* Abonnement VIP : à brancher avec les achats intégrés. */
    VIP: { plans: [{ id: 'vip_month', period: 'P1M' }, { id: 'vip_year', period: 'P1Y' }], active: function () { return false; }, ready: function () { return false; } },
    /* Tournois : nécessitent le serveur multijoueur (voir docs/MULTIJOUEUR.md). */
    Tournaments: { needsServer: true, ready: function () { return false; }, list: function () { return Promise.resolve([]); } }
  };
})(typeof window !== 'undefined' ? window : globalThis);
