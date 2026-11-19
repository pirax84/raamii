/* Compte en ligne Raamii (Supabase) : connexion, sauvegarde des pièces / réglages / classement,
   enregistrement des parties et classement en ligne. Si Supabase n'est pas configuré (config.js vide),
   tout reste hors ligne et le jeu fonctionne normalement. */
(function (G) {
  var R = (G.Rami = G.Rami || {});
  var cfg = G.RAAMII_CLOUD || {}, sb = null, user = null, profile = null, listeners = [], pushT = null, applying = false, lastSync = null, busy = false;
  var SYNC_KEYS = ['coins', 'owned', 'back', 'rank', 'theme', 'style', 'felt', 'faces', 'lang', 'rules', 'music', 'track', 'volume', 'sfx', 'help', 'chat', 'speed', 'orient', 'level', 'rounds', 'name', 'dragSeen', 'xp', 'daily', 'missions', 'feltsOwned', 'homeMusic', 'sfxVol', 'turnTime'];
  try {
    if (cfg.url && cfg.anonKey && G.supabase && G.supabase.createClient) {
      sb = G.supabase.createClient(cfg.url, cfg.anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'raamii-auth' } });
    }
  } catch (e) { sb = null; }
  function emit() { listeners.forEach(function (f) { try { f(); } catch (e) {} }); }
  function snapshot() { var o = {}; SYNC_KEYS.forEach(function (k) { o[k] = R.Store.get(k); }); return o; }
  function applyRemote(d) { applying = true; Object.keys(d || {}).forEach(function (k) { if (SYNC_KEYS.indexOf(k) >= 0) R.Store.set(k, d[k]); }); applying = false; }
  function loadProfile() {
    if (!sb || !user) return Promise.resolve(null);
    return sb.from('profiles').select('*').eq('id', user.id).maybeSingle().then(function (r) { profile = r.data || null; emit(); return profile; });
  }
  function sync() {
    if (!sb || !user || busy) return Promise.resolve(false);
    busy = true; emit();
    return sb.from('user_data').select('data, updated_at').eq('user_id', user.id).maybeSingle().then(function (r) {
      var localTs = R.Store.get('_ts') || 0, remoteTs = r.data ? Date.parse(r.data.updated_at) : 0;
      if (r.data && remoteTs > localTs) { applyRemote(r.data.data); R.Store.set('_ts', remoteTs); return true; }
      return push().then(function () { return false; });
    }).then(function (changed) { busy = false; lastSync = new Date(); emit(); return changed; }, function () { busy = false; emit(); return false; });
  }
  function push() {
    if (!sb || !user) return Promise.resolve();
    var ts = new Date(R.Store.get('_ts') || Date.now()).toISOString();
    return sb.from('user_data').upsert({ user_id: user.id, data: snapshot(), updated_at: ts }).then(function () { lastSync = new Date(); emit(); });
  }
  if (sb) {
    sb.auth.getSession().then(function (r) { user = r.data && r.data.session ? r.data.session.user : null; emit(); if (user) { loadProfile(); sync(); } });
    sb.auth.onAuthStateChange(function (ev, session) {
      var was = user && user.id; user = session ? session.user : null; emit();
      if (user && user.id !== was) { loadProfile(); sync(); }
      if (!user) profile = null;
    });
  }
  R.Cloud = {
    enabled: function () { return !!sb; },
    user: function () { return user; },
    profile: function () { return profile; },
    busy: function () { return busy; },
    lastSync: function () { return lastSync; },
    onChange: function (f) { listeners.push(f); },
    signUp: function (email, password, pseudo) {
      if (!sb) return Promise.reject(new Error('off'));
      return sb.auth.signUp({ email: email, password: password, options: { data: { pseudo: pseudo || email.split('@')[0] } } }).then(function (r) {
        if (r.error) throw r.error; return { needConfirm: !r.data.session };
      });
    },
    signIn: function (email, password) {
      if (!sb) return Promise.reject(new Error('off'));
      return sb.auth.signInWithPassword({ email: email, password: password }).then(function (r) { if (r.error) throw r.error; return true; });
    },
    signOut: function () { return sb ? sb.auth.signOut() : Promise.resolve(); },
    sync: sync,
    /* appelé par le stockage local à chaque changement : envoi groupé 3 s plus tard */
    changed: function () { if (!sb || !user || applying) return; clearTimeout(pushT); pushT = setTimeout(push, 3000); },
    recordGame: function (info) {
      if (!sb || !user) return Promise.resolve();
      return sb.rpc('record_game', { p_rules: info.rules, p_rounds: info.rounds, p_players: info.players, p_ranking: info.ranking, p_total: info.total, p_won: info.won }).then(function () { return loadProfile(); });
    },
    leaderboard: function () {
      if (!sb) return Promise.resolve([]);
      return sb.from('profiles').select('pseudo, games, wins, best').gt('games', 0).order('wins', { ascending: false }).order('best', { ascending: true }).limit(20).then(function (r) { return r.data || []; });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
