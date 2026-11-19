/* Interface : menu, réglages, classement, règles, table de jeu. */
(function (G) {
  'use strict';
  var R = G.Rami, t = R.t, S = R.Store, A = R.Audio, M = R.Media, Sh = R.Shop;
  var doc = G.document;
  function $(s) { return doc.querySelector(s); }
  var COLORS = ['#9B87F5', '#E5679C', '#FF8A6B', '#2FCDBE', '#4F7BFF', '#9B87F5'];
  var BOTS = ['Léa', 'Hugo', 'Nina', 'Maman', 'Karim'];
  var ICON = {
    mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg>',
    micoff: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3M3 3l18 18"/></svg>',
    ace: '<svg viewBox="0 0 64 64"><g transform="rotate(-20 32 54)"><rect x="18" y="10" width="28" height="40" rx="5" fill="#2FCDBE"/><rect x="21.5" y="13.5" width="21" height="33" rx="3" fill="none" stroke="#B8F1EA" stroke-width="1.6"/></g><g transform="rotate(18 32 54)"><rect x="18" y="10" width="28" height="40" rx="5" fill="#6F57E6"/><rect x="21.5" y="13.5" width="21" height="33" rx="3" fill="none" stroke="#C9BBFF" stroke-width="1.6"/></g><g><rect x="18" y="12" width="28" height="40" rx="5" fill="#FFFFFF" stroke="#14214A" stroke-width="2"/><text x="21.3" y="21" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="8" fill="#14214A">A</text><text x="42.7" y="49.5" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="8" fill="#14214A" text-anchor="middle" transform="rotate(180 40.3 46.8)">A</text><path transform="translate(22 22) scale(.83)" d="M12 2C6 8 3 11 3 14a4.5 4.5 0 008 3c0 3-1 4-3 5h8c-2-1-3-2-3-5a4.5 4.5 0 008-3c0-3-3-6-9-12z" fill="#14214A"/></g></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 016 0"/></svg>',
    cam: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="3"/><path d="M16 11l5-3v8l-5-3"/></svg>',
    camoff: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="3"/><path d="M16 11l5-3v8l-5-3M3 3l18 18"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    dots: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M8 5l11 7-11 7z"/></svg>', pause: '<svg viewBox="0 0 24 24"><rect x="7" y="5" width="4" height="14"/><rect x="13" y="5" width="4" height="14"/></svg>',
    robot: '<svg viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="12" rx="3"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/><path d="M12 3v4"/></svg>',
    people: '<svg viewBox="0 0 24 24"><circle cx="9" cy="9" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M3 20a6 6 0 0112 0M15 20a5 5 0 016 0"/></svg>',
    gift: '<svg viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="12" rx="2"/><path d="M3 13h18M12 9v12M12 9c-2-4-6-4-6-1 0 1 1 1 6 1zM12 9c2-4 6-4 6-1 0 1-1 1-6 1z"/></svg>',
    spk: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/></svg>',
    spkoff: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
    burger: '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    sort: '<svg viewBox="0 0 24 24"><path d="M7 4v16M4 7l3-3 3 3M17 20V4M14 17l3 3 3-3"/></svg>',
    bulb: '<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z"/></svg>',
    trophy: '<svg viewBox="0 0 24 24"><path d="M6 4h12v4a6 6 0 01-12 0zM9 20h6M12 14v6"/></svg>',
    book: '<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h7"/></svg>',
    gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/></svg>'
  };
  var Pg = R.Progress, unlocked = false, meldView = null, tmr = { deadline: 0, total: 0, last: 0, pid: -1, warned: false }, vote = null, accDraft = { email: '', pw: '', pseudo: '' }, C2 = R.Cloud, drag = null, dragId = null, lastDragEnd = 0, doFlip = false, helpOpen = false, scoresOpen = false, sortMode = 0, lay = null, relayT = null, installEvt = null, rulesView = null, newId = null, helpCache = { k: '', v: [] }, drawnT = null, chatMsgs = [], chatOpen = false, chatUnread = false;
  var game = null, mode = 'solo', view = 0, sel = [], covered = false, aiTimer = null, toastT = null, dealing = false, screen = 'menu', hasHumans = 1;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function musicFor(name) {
    if (!unlocked) return;
    if (name === 'table') { if (A.current() === 'home') A.stop(); return; }
    if (S.get('homeMusic') !== false) { if (A.current() !== 'home') { A.config({ music: true }); A.play('home'); } } else if (A.current() === 'home') A.stop();
  }
  function show(name) { screen = name; musicFor(name); doc.querySelectorAll('.screen').forEach(function (s) { s.classList.toggle('on', s.id === name); }); }
  function applyTheme() {
    var v = S.get('theme'), th = v === 'auto' ? (G.matchMedia && G.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : v;
    doc.documentElement.dataset.theme = th; doc.documentElement.dataset.style = S.get('style') || 'joker'; doc.documentElement.dataset.back = S.get('back') || 'nuit'; doc.documentElement.dataset.felt = S.get('felt') || 'auto'; doc.documentElement.dataset.faces = S.get('faces') || 'light';
    R.lang = S.get('lang') === 'auto' || !S.get('lang') ? R.detectLang() : S.get('lang'); doc.documentElement.lang = R.lang; doc.title = t('appName');
    var m = doc.querySelector('meta[name=theme-color]'); if (m) m.content = th === 'light' ? '#FFFFFF' : '#050B1F';
  }
  function applyOrientation() {
    lockOrient(); applyLayout(true);
  }
  function wantLay() { if (isNative()) return 'land'; var o = S.get('orient'); if (o === 'portrait') return 'port'; if (o === 'landscape') return 'land'; return G.matchMedia && G.matchMedia('(orientation: landscape)').matches ? 'land' : 'port'; }
  function applyLayout(animate) {
    var l = wantLay(); if (l === lay) return; var first = lay === null; lay = l; doc.documentElement.dataset.lay = l; helpCache.k = '';
    if (!first && animate && game && screen === 'table') { var tb = $('#table'); tb.classList.remove('relay'); void tb.offsetWidth; tb.classList.add('relay'); clearTimeout(relayT); relayT = setTimeout(function () { tb.classList.remove('relay'); }, 700); }
    if (game && screen === 'table') render();
  }
  function isNative() { return !!(G.Capacitor && G.Capacitor.isNativePlatform && G.Capacitor.isNativePlatform()); }
  function isStandalone() { return isNative() || (G.matchMedia && (G.matchMedia('(display-mode: fullscreen)').matches || G.matchMedia('(display-mode: standalone)').matches)) || G.navigator.standalone === true; }
  function fsSupported() { return !!(doc.documentElement.requestFullscreen || doc.documentElement.webkitRequestFullscreen); }
  function inFs() { return !!(doc.fullscreenElement || doc.webkitFullscreenElement); }
  function enterFs() {
    if (isStandalone() || inFs() || !fsSupported()) return Promise.resolve(false);
    var el = doc.documentElement, f = el.requestFullscreen || el.webkitRequestFullscreen;
    try { var r = f.call(el, { navigationUI: 'hide' }); return (r && r.then ? r : Promise.resolve()).then(function () { lockOrient(); return true; }).catch(function () { return false; }); } catch (e) { return Promise.resolve(false); }
  }
  function exitFs() { try { (doc.exitFullscreen || doc.webkitExitFullscreen).call(doc); } catch (e) {} }
  function lockOrient() { var o = S.get('orient'); try { if (!screen_orientation()) return; if (o === 'auto') G.screen.orientation.unlock(); else G.screen.orientation.lock(o === 'portrait' ? 'portrait' : 'landscape').catch(function () {}); } catch (e) {} }
  function screen_orientation() { return G.screen && G.screen.orientation && G.screen.orientation.lock; }
  function audioCfg() { A.config({ music: S.get('music'), sfx: S.get('sfx'), volume: S.get('volume'), sfxVol: S.get('sfxVol') != null ? S.get('sfxVol') : 0.8 }); }
  function toast(msg, bad) { var el = $('#toast'); el.textContent = msg; el.style.display = 'block'; clearTimeout(toastT); toastT = setTimeout(function () { el.style.display = 'none'; }, 2600); if (bad) A.sfx('error'); }

  // ---------- Menu ----------
  function logo() { return '<div class="logo"><span class="lm">' + ICON.ace + '</span>' + t('appName').toUpperCase() + '</div>'; }
  function mbtn(act, c, ic, title, sub) { return '<button class="mbtn" data-act="' + act + '"><span class="ic" style="background:' + c + '">' + ICON[ic] + '</span><span><b>' + title + '</b><small>' + sub + '</small></span></button>'; }
  function renderMenu() {
    var li = Pg.levelInfo(), pend = Pg.pending(), hm = S.get('homeMusic') !== false;
    $('#menu').innerHTML = '<div class="menu"><div class="row">' + logo() + '<span class="sp"></span><button class="ib" data-act="homeMute" aria-label="' + t(hm ? 'soundOn' : 'soundOff') + '" title="' + t(hm ? 'soundOn' : 'soundOff') + '">' + (hm ? ICON.spk : ICON.spkoff) + '</button><button class="ib" data-act="themeToggle" aria-label="' + t('theme') + '">' + ICON.gear + '</button></div>' +
      '<div class="row lvl"><button class="lvc" data-act="daily"><b>' + t('levelN', { n: li.level }) + '</b><span class="bar"><i style="width:' + Math.round(100 * li.have / li.span) + '%"></i></span><small>' + t('xpTo', { a: li.have, b: li.span }) + '</small></button><span class="coinb"><span class="coin"></span>' + Sh.coins() + '</span></div>' +
      '<div class="hero" aria-hidden="true">' + [['A', 'H', -12], ['K', 'S', 0], ['Q', 'D', 12]].map(function (c, i) { return '<div style="transform:rotate(' + c[2] + 'deg);margin:0 -8px;--cw:62px;z-index:' + (i === 1 ? 2 : 1) + '">' + R.CardView.html({ id: 'm' + i, r: c[0] === 'A' ? 1 : c[0] === 'K' ? 13 : 12, s: c[1] }) + '</div>'; }).join('') + '</div>' +
      mbtn('solo', '#2FCDBE', 'robot', t('solo'), t('soloSub')) + mbtn('friends', '#E5679C', 'people', t('friends'), t('friendsSub')) +
      mbtn('daily', '#2FCDBE', 'gift', t('daily') + (pend ? ' <i class="pdot">' + pend + '</i>' : ''), t('dailySub')) + mbtn('rank', '#FF8A6B', 'trophy', t('ranking'), '') + mbtn('shop', '#C9BBFF', 'bag', t('shop'), t('shopSub')) + mbtn('rules', '#9B87F5', 'book', t('rules'), t('menuRulesSub')) + mbtn('settings', '#4F7BFF', 'gear', t('settings'), t('theme') + ', ' + t('music') + ', ' + t('language')) + '<p class="vers">' + t('appName') + ' · v' + R.VERSION + '</p></div>';
  }

  // ---------- Préparation d'une partie ----------
  function chips(name, vals, cur) { return '<div class="row" style="flex-wrap:wrap">' + vals.map(function (v) { return '<button class="chip' + (String(v[0]) === String(cur) ? ' on' : '') + '" data-act="' + name + '" data-v="' + v[0] + '">' + v[1] + '</button>'; }).join('') + '</div>'; }
  var setup = { level: 'medium', rounds: 3, n: 3, names: ['', '', '', '', '', ''] };
  function renderSetup() {
    var h = '<div class="menu"><div class="row"><button class="ib" data-act="menu" aria-label="' + t('back') + '">' + ICON.back + '</button><h2>' + (mode === 'solo' ? t('solo') : t('friends')) + '</h2></div>';
    if (mode === 'solo') h += '<div class="tile"><p class="muted" style="margin:0 0 8px">' + t('yourName') + '</p><input class="field" id="nm0" maxlength="16" placeholder="' + esc(t('namePh')) + '" value="' + esc(setup.names[0] || S.get('name') || '') + '"></div><div class="tile"><p class="muted" style="margin:0 0 8px">' + t('level') + '</p>' + chips('level', [['easy', t('easy')], ['medium', t('medium')], ['hard', t('hard')]], setup.level) + '</div>';
    else {
      h += '<div class="tile"><p class="muted" style="margin:0 0 8px">' + t('players') + '</p>' + chips('n', [[2, '2'], [3, '3'], [4, '4'], [5, '5'], [6, '6']], setup.n) + '</div><div class="tile" style="display:flex;flex-direction:column;gap:8px">';
      for (var i = 0; i < setup.n; i++) h += '<input class="field" id="nm' + i + '" maxlength="16" placeholder="' + t('yourName') + ' ' + (i + 1) + '" value="' + esc(setup.names[i] || '') + '">';
      h += '</div>';
    }
    h += '<div class="tile"><p class="muted" style="margin:0 0 8px">' + t('rulesSet') + '</p>' + rulesPicker() + '</div>';
    h += '<div class="tile"><p class="muted" style="margin:0 0 8px">' + t('rounds') + '</p>' + chips('rounds', [[1, '1'], [3, '3'], [5, '5']], setup.rounds) + '</div><button class="btn" data-act="start">' + t('play') + '</button></div>';
    $('#setup').innerHTML = h;
  }
  function rulesPicker() {
    var cur = S.get('rules') || 'maison';
    return '<div class="stps">' + [['maison', 'rsMaison', 'rsMaisonSub'], ['classique', 'rsClassic', 'rsClassicSub']].map(function (r) {
      return '<button class="stp rpk' + (cur === r[0] ? ' on' : '') + '" data-act="rulesPick" data-v="' + r[0] + '" aria-pressed="' + (cur === r[0]) + '"><b>' + t(r[1]) + '</b><small class="tdesc" style="margin:0;text-align:center">' + t(r[2]) + '</small></button>';
    }).join('') + '</div>';
  }
  function readNames() { for (var i = 0; i < 6; i++) { var el = $('#nm' + i); if (el) setup.names[i] = el.value.trim(); } }

  function start() {
    readNames(); var players = [];
    if (mode === 'solo') {
      var me = setup.names[0] || t('me'); S.set('name', setup.names[0] || ''); players.push({ name: me, human: true, color: COLORS[0] });
      BOTS.forEach(function (n, i) { players.push({ name: n, level: setup.level, color: COLORS[i + 1] }); });
    } else {
      for (var i = 0; i < setup.n; i++) players.push({ name: setup.names[i] || t('playerN', { n: i + 1 }), human: true, color: COLORS[i] });
    }
    hasHumans = players.filter(function (p) { return p.human; }).length; R.setRules(S.get('rules') || 'maison');
    if (S.get('full')) enterFs();
    game = new R.Game({ players: players, rounds: setup.rounds }); game.turnTime = S.get('turnTime') != null ? S.get('turnTime') : 120;
    game.on(onEvent); view = 0; sel = []; show('table'); startMusic();
    dealing = true; game.startRound(); setTimeout(function () { dealing = false; }, 900);
  }
  function startMusic() { if (S.get('music')) A.play(S.get('track')); }

  // ---------- Événements du jeu ----------
  function onEvent(type, d) {
    if (type === 'turn') { startTimer();
      sel = []; var p = game.cur();
      if (p.human) { view = (hasHumans > 1) ? p.id : 0; covered = hasHumans > 1; if (hasHumans === 1) A.sfx('turn'); }
    }
    if (type === 'draw') { A.sfx(game.P[d.pid].human ? 'draw' : 'flick'); var dp = game.P[d.pid]; if (dp.human && d.pid === view && !covered) { newId = d.card.id; showDrawn(d.card); } }
    if (type === 'discard') A.sfx('discard');
    if (type === 'meld') { A.sfx('meld'); if (game.P[d.pid].human) { Pg.track('meld'); Pg.addXp(5); if (d.meld.cards.some(function (c) { return c.joker; })) Pg.track('joker'); } }
    if (type === 'attach') A.sfx('place');
    if (type === 'open') { if (game.P[d.pid].human) Pg.track('open');
      A.sfx('open'); toast(t('opened', { name: game.P[d.pid].name })); }
    if (type === 'rollback') toast(d.reason, true);
    if (type === 'reshuffle') { A.sfx('shuffle'); toast(t('reshuffle')); }
    if (type === 'roundStart') { dealing = true; A.sfx('shuffle'); setTimeout(function () { A.sfx('deal'); }, 1450); setTimeout(function () { dealing = false; }, 900); }
    if (type === 'roundEnd') { if (hasHumans) { Pg.track('rounds'); var wu = game.P[d.winner].human; var up = Pg.addXp(20 + (wu ? 50 : 0)); if (wu && d.sec) Pg.track('sec'); if (up) setTimeout(function () { toast2(t('levelUp', { n: up.level, c: up.coins })); }, 1200); } setTimeout(function () { roundEnd(d); }, 900); A.sfx(game.P[d.winner].human ? 'win' : 'flick'); }
    if (type === 'gameEnd') { S.recordGame(d.ranking); Pg.track('play'); if (d.ranking[0].human) Pg.track('win'); var won = Sh.REWARD.game + (d.ranking[0].human ? Sh.REWARD.win : 0); Sh.earn(won); d.coins = won; gameEnd(d);
      if (C2 && C2.user()) { var hu = d.ranking.filter(function (r) { return r.human; })[0]; C2.recordGame({ rules: R.CONFIG.id, rounds: game.rounds, players: game.P.length, ranking: d.ranking, total: hu ? hu.total : 0, won: !!d.ranking[0].human }); } }
  }

  function roundEnd(d) {
    var w = game.P[d.winner];
    var rows = d.rows.slice().sort(function (a, b) { return a.total - b.total; }).map(function (r) {
      return '<span class="' + (r.pid === d.winner ? 'win' : '') + '">' + esc(r.name) + '<br><small class="muted">' + esc(r.why) + '</small></span><span class="' + (r.pts >= 100 && r.pid !== d.winner ? 'pen' : '') + '">+' + r.pts + '</span><b>' + r.total + '</b>';
    }).join('');
    $('#mround').querySelector('.box').innerHTML = '<h2>' + t('roundOver') + ' ' + game.round + '/' + game.rounds + '</h2><p style="margin:0"><b>' + esc(w.name) + '</b> ' + (d.sec ? '— ' + t('sec') : '') + '</p>' + (d.sec ? '<p class="muted" style="margin:0">' + t('secSub') + '</p>' : '') +
      '<div class="score"><small class="muted"></small><small class="muted">' + t('roundCol') + '</small><small class="muted">' + t('total') + '</small>' + rows + '</div><button class="btn" data-act="next">' + (d.last ? t('gameOver') : t('nextRound')) + '</button>';
    $('#mround').classList.add('on');
  }
  function gameEnd(d) {
    var rows = d.ranking.map(function (r, i) { return '<span class="' + (i === 0 ? 'win' : '') + '">' + (i + 1) + '. ' + esc(r.name) + '</span><span></span><b>' + r.total + '</b>'; }).join('');
    $('#mround').querySelector('.box').innerHTML = '<h2>' + t('gameOver') + '</h2><p style="margin:0">' + t('winner') + ' : <b>' + esc(d.ranking[0].name) + '</b></p><div class="score"><small></small><small></small><small class="muted">' + t('total') + '</small>' + rows + '</div><p style="margin:0;align-self:center" class="coinb"><span class="coin"></span>' + t('coinsWon', { n: d.coins || 0 }) + '</p><div class="row"><button class="btn" data-act="again">' + t('again') + '</button><button class="btn ghost" data-act="menu">' + t('menu') + '</button></div>';
    $('#mround').classList.add('on'); A.sfx('win');
  }

  // ---------- Table ----------
  var AREAS = { 1: ['s2'], 2: ['s1', 's3'], 3: ['s1', 's2', 's3'], 4: ['s1', 's3', 's4', 's5'], 5: ['s1', 's2', 's3', 's4', 's5'] };
  function stIcons(mic, cam) {
    return '<span class="st"><i class="' + (mic ? 'on' : '') + '" title="' + t(mic ? 'micOn' : 'micOff') + '" aria-label="' + t(mic ? 'micOn' : 'micOff') + '">' + (mic ? ICON.mic : ICON.micoff) + '</i><i class="' + (cam ? 'on' : '') + '" title="' + t(cam ? 'camOn' : 'camOff') + '" aria-label="' + t(cam ? 'camOn' : 'camOff') + '">' + (cam ? ICON.cam : ICON.camoff) + '</i></span>';
  }
  function fmtT(sec) { sec = Math.max(0, Math.ceil(sec)); return Math.floor(sec / 60) + ':' + ('0' + (sec % 60)).slice(-2); }
  function seatHTML(p, pos) {
    var turn = game.turn === p.id && !game.over, cnt = p.hand.length, remote = M.remote(p.id);
    return '<div class="seat v2 rs' + (turn ? ' turn' : '') + (p.opened ? ' opened' : '') + '" data-act="seeMelds" data-v="' + p.id + '" style="--sx:' + pos.x + '%;--sy:' + pos.y + '%" aria-label="' + esc(p.name) + ', ' + cnt + ' ' + t('cards') + (p.opened ? ', ' + t('openedTip') : '') + '" title="' + esc(p.name) + ' · ' + p.total + ' ' + t('pts') + '">' +
      '<div class="av" style="background:' + p.color + '">' + esc(p.name[0].toUpperCase()) + '<b class="cnt">' + cnt + '</b></div><div class="nm">' + esc(p.name) + '</div>' +
      (remote ? '<div class="vt live"><video autoplay playsinline data-remote="' + p.id + '"></video></div>' : '') + '</div>';
  }
  function meldRow(m) {
    return '<div class="mrow' + (m.prov ? ' prov' : '') + '" data-meld="' + m.id + '">' + m.cards.map(function (c) { return R.CardView.html(c); }).join('') + '</div>';
  }
  var HL = ['#00E5FF', '#FF3DCB', '#8B6BFF', '#FF8A3D', '#3DFFB5'];
  function combos(hand) {
    var k = hand.map(function (c) { return c.id; }).sort().join(',');
    if (helpCache.k === k) return helpCache.v;
    var r = R.AI.search(hand, { mode: 'any' }), out = [];
    if (r) r.melds.forEach(function (ids, i) {
      var cs = ids.map(function (id) { return hand.filter(function (c) { return c.id === id; })[0]; }), m = R.arrange(cs);
      if (m) out.push({ ids: ids, color: HL[i % HL.length], label: m.type === 'run' ? t('helpRun') : cs.length === 4 ? t('helpSquare') : t('helpSet'), cards: cs });
    });
    helpCache = { k: k, v: out }; return out;
  }
  function comboName(cb) {
    var nat = cb.cards.filter(function (c) { return !c.joker; });
    if (!nat.length) return cb.label;
    var sym = { S: '♠', H: '♥', D: '♦', C: '♣' };
    return cb.label === t('helpRun') ? cb.label + ' ' + sym[nat[0].s] : cb.label + ' ' + R.label(nat[0].r);
  }
  function renderTable() {
    if (!game) return;
    if (drag && drag.on && !drag.allowRender) { drag.pending = true; return; }
    var me = game.P[view], ms = M.state(), my = game.turn === view && !game.over;
    var others = game.P.filter(function (p) { return p.id !== view; });
    others = others.slice().sort(function (a, b) { return ((a.id - view + 6) % 6) - ((b.id - view + 6) % 6); });
    var ANG = { 1: [270], 2: [215, 325], 3: [180, 270, 360], 4: [180, 240, 300, 360], 5: [180, 226, 270, 314, 360] }[others.length] || [];
    function at(deg, rx, ry) { var r = deg * Math.PI / 180; return { x: (50 + rx * Math.cos(r)).toFixed(1), y: (50 + ry * Math.sin(r)).toFixed(1) }; }
    var seatR = lay === 'land' ? [45, 42] : [41, 43], meldR = lay === 'land' ? [30, 22] : [28, 27];
    var seats = others.map(function (p, i) { var q = at(ANG[i], seatR[0], seatR[1]); if (lay === 'land') q.y = (+q.y + 4).toFixed(1); return seatHTML(p, q); }).join('');
    var MZ = lay === 'land' ? { 180: [20, 64], 215: [24, 38], 226: [24, 40], 270: [64, 18], 314: [76, 40], 325: [76, 38], 360: [80, 64], mine: [72, 86] }
                            : { 180: [17, 67], 215: [24, 26], 226: [22, 27], 270: [50, 20], 314: [78, 27], 325: [76, 26], 360: [83, 67], mine: [50, 79] };
    var mzOf = function (q, deg, mine) {
      var ms = game.melds.filter(function (m) { return m.owner === q.id; }); if (!ms.length) return '';
      var xy = MZ[mine ? 'mine' : deg] || [50, 50], po = { x: xy[0], y: xy[1] };
      return '<div class="mz' + (mine ? ' mine' : '') + '" data-act="seeMelds" data-v="' + q.id + '" style="--mx:' + po.x + '%;--my:' + po.y + '%;--oc:' + q.color + '" aria-label="' + esc(t('seeMelds', { name: q.name })) + '">' + ms.map(meldRow).join('') + '</div>';
    };
    var melds = others.map(function (p, i) { return mzOf(p, ANG[i], false); }).join('') + mzOf(me, 90, true);
    var top = game.discard[game.discard.length - 1];
    var canS = my && game.phase === 'draw' && game.canTake(view, 'stock'), canD = my && game.phase === 'draw' && game.canTake(view, 'discard'), canR = my && game.phase === 'draw' && game.canTake(view, 'reserve');
    var drawz = '<div class="drawz">' +
      (game.reserve ? '<button class="pile rsv' + (canR ? ' can' : '') + '" data-act="reserve" aria-label="' + t('reserve') + ' : ' + esc(R.nameOf(game.reserve)) + '">' + R.CardView.html(game.reserve) + '</button>' : '') +
      '<button class="pile stk' + (canS ? ' can' : '') + '" data-act="stock" aria-label="' + t('draw') + ' (' + game.stock.length + ')"><div class="stack">' + R.CardView.back() + R.CardView.back() + '</div></button><b class="cntb" aria-hidden="true">' + game.stock.length + '</b></div>';
    var piles = '<div class="piles">' + drawz + '</div>', dscH = '<div class="dsc2 piles"><button class="pile dsc' + (canD ? ' can' : '') + '" data-act="discardPile" aria-label="' + t('discardPile') + '">' + (top ? R.CardView.html(top) : '<div class="card empty"></div>') + '</button></div>';
    var cbs = (!covered && S.get('help')) ? combos(me.hand) : [], hlOf = {};
    cbs.forEach(function (cb) { cb.ids.forEach(function (id) { hlOf[id] = cb.color; }); });
    var n = me.hand.length, mid = (n - 1) / 2, stepDeg = Math.min(3.4, 46 / Math.max(n, 1)), k = mid > 0 ? 22 / (mid * mid) : 0;
    var hand = covered ? me.hand.map(function () { return R.CardView.back(); }).join('') : me.hand.map(function (c, i) {
      var off = i - mid, st = '--rot:' + (off * stepDeg).toFixed(2) + 'deg;--ty:' + (off * off * k - 22).toFixed(1) + 'px;animation-delay:' + (i * 40) + 'ms' + (hlOf[c.id] ? ';--hl:' + hlOf[c.id] : '');
      var cls = (dealing ? 'deal ' : '') + (hlOf[c.id] ? 'cmb ' : '') + (c.id === newId ? 'newc ' : '') + (c.id === dragId ? 'dragsrc' : '');
      return R.CardView.html(c, { sel: sel.indexOf(c.id) >= 0, cls: cls.trim(), style: st });
    }).join('');
    var loupe = '';
    if (false) { var lc = me.hand.filter(function (c) { return c.id === sel[0]; })[0]; if (lc) loupe = '<div class="loupe">' + R.CardView.html(lc) + '</div>'; }
    // une seule ligne d'état, courte
    var status, chip = '';
    if (covered) status = ''; else if (my && game.phase === 'draw') status = t('stDraw'); else if (my) status = t('stPlay'); else status = t('stWait', { name: esc(game.cur().name) });
    var plan = (my && game.phase === 'play' && sel.length >= 3) ? planMeld(sel) : null;
    if (my && game.phase === 'play' && sel.length >= 2) {
      if (!plan) chip = '<span class="opc bad" title="' + esc(t('incomplete')) + '">? ' + t('pts') + '</span>';
      else if (me.opened) chip = '<span class="opc ok" title="' + t('selPts') + '">+' + plan.pts + ' ' + t('pts') + '</span>';
      else chip = '<span class="opc' + (plan.open.ok ? ' ok' : '') + '" title="' + t('opening') + '">' + plan.open.points + '/' + R.CONFIG.openPoints + (R.CONFIG.needPure ? ' · ' + (plan.open.pure ? '✓' : '✗') : '') + '</span>';
    } else if (my && game.phase === 'play' && !me.opened) { var oi = game.openingInfo(view); chip = '<span class="opc' + (oi.ok ? ' ok' : '') + '" title="' + t('opening') + '">' + oi.points + '/' + R.CONFIG.openPoints + (R.CONFIG.needPure ? ' · ' + (oi.pure ? '✓' : '✗') : '') + '</span>'; }

    if (!S.get('dragSeen') && !covered && game.round === 1) status = t('dragHint');
    var selCards = me.hand.filter(function (c) { return sel.indexOf(c.id) >= 0; });
    var canMeld = !!(plan && (me.opened || plan.open.ok)), canDis = my && game.phase === 'play' && sel.length === 1;
    var meTile = ms.cam && M.stream() ? '<div class="vt live"><video autoplay muted playsinline data-local="1"></video></div>' : '';
    var helpPop = helpOpen && !covered ? '<div class="pop helpop" role="dialog" aria-label="' + t('helpTitle') + '"><b>' + t('helpTitle') + '</b><div class="row" style="flex-wrap:wrap;gap:6px">' + (cbs.length ? cbs.map(function (cb, i) { return '<button class="hc" data-act="pickCombo" data-v="' + i + '" style="--hl:' + cb.color + '">' + esc(comboName(cb)) + '</button>'; }).join('') : '<span class="muted">' + t('noCombo') + '</span>') + '</div></div>' : '';
    var scorePop = scoresOpen ? '<div class="pop scorep" role="dialog" aria-label="' + t('scores') + '"><b>' + t('scores') + ' · ' + t('roundCol') + ' ' + game.round + '/' + game.rounds + '</b>' + game.P.slice().sort(function (a, b) { return a.total - b.total; }).map(function (q) { return '<div class="sr2"><i class="od" style="background:' + q.color + '">' + esc(q.name[0].toUpperCase()) + '</i><span>' + esc(q.name) + (q.opened ? ' <small class="muted">✓</small>' : '') + '</span><b>' + q.total + '</b></div>'; }).join('') + '</div>' : '';
    var cp = game.cur(), who = covered ? '' : (my ? t('stYou') : esc(cp.name));
    var tpill = '<div class="tpill' + (my ? ' me' : '') + '" role="status"><i class="od" style="background:' + cp.color + '">' + esc(cp.name[0].toUpperCase()) + '</i><span class="tw">' + who + '</span>' + (tmr.total ? '<b class="tms">' + fmtT((tmr.deadline - Date.now()) / 1000) + '</b>' : '') + '<small class="rd">' + game.round + '/' + game.rounds + '</small></div>';
    var tools = '<div class="tools"><button class="ib" data-act="sortCycle" aria-label="' + t('sortTip') + '" title="' + t('sortTip') + '">' + ICON.sort + '</button>' +
      (S.get('help') ? '<button class="ib' + (helpOpen ? ' on' : '') + '" data-act="helpPop" aria-label="' + t('helpTip') + '" title="' + t('helpTip') + '">' + ICON.bulb + (cbs.length ? '<b class="nb">' + cbs.length + '</b>' : '') + '</button>' : '') +
      '<button class="ib' + (scoresOpen ? ' on' : '') + '" data-act="scores" aria-label="' + t('scores') + '" title="' + t('scores') + '">' + ICON.trophy + '</button>' + helpPop + '</div>';
    var h = '<div class="stage" aria-hidden="true"><div class="felt"></div></div><div class="tb">' +
      '<div class="hd"><button class="ib" data-act="pause" aria-label="' + t('tableSettings') + '" title="' + t('tableSettings') + '">' + ICON.burger + '</button>' + tpill + tools + '</div>' +
      '<div class="ce"><div class="felt2" aria-hidden="true"></div><div class="ring">' + seats + melds + '<div class="ctr">' + piles + '</div>' + dscH + '</div>' + scorePop + meldPanel() + '</div>' +
      '<div class="ac v2"><div class="mechip' + (my ? ' turn' : '') + '"><div class="av" style="background:' + me.color + '">' + esc(me.name[0].toUpperCase()) + '</div><span>' + esc(me.name) + '</span>' + meTile + '</div>' + chip +
      '<span class="sp"></span>' + (canMeld ? '<button class="btn pill" data-act="meld">' + t('meld') + '</button>' : '') + (canDis ? '<button class="btn pill" data-act="toDiscard">' + t('toDiscard') + '</button>' : '') + '</div>' +
      '<div class="hn' + (me.hand.length > 14 ? ' c8' : '') + '" id="hand">' + hand + '</div></div>';
    var el = $('#table'), old = {};
    if (doFlip) el.querySelectorAll('#hand .card[data-id]').forEach(function (c) { old[c.dataset.id] = c.getBoundingClientRect(); });
    el.innerHTML = h + '<div class="toast" id="toast" style="display:none"></div>';
    if (doFlip) { doFlip = false; el.querySelectorAll('#hand .card[data-id]').forEach(function (c) {
      var o = old[c.dataset.id]; if (!o || +c.dataset.id === dragId) return; var r = c.getBoundingClientRect(), dx = o.left - r.left, dy = o.top - r.top;
      if (!dx && !dy) return; c.style.transition = 'none'; c.style.translate = dx + 'px ' + dy + 'px';
      requestAnimationFrame(function () { c.style.transition = 'translate .22s cubic-bezier(.2,.8,.2,1), transform .15s'; c.style.translate = '0 0'; });
    }); }
    var v1 = el.querySelector('video[data-local]'); if (v1 && M.stream()) { v1.srcObject = M.stream(); v1.play && v1.play().catch(function () {}); }
    el.querySelectorAll('video[data-remote]').forEach(function (v) { var s = M.remote(+v.dataset.remote); if (s) v.srcObject = s; });
    $('#cover').classList.toggle('on', covered && !game.over);
    if (covered) $('#cover').innerHTML = '<div class="box" style="text-align:center"><h2>' + t('passTo') + '</h2><p style="font-size:28px;margin:4px 0"><b>' + esc(game.cur().name) + '</b></p><button class="btn" data-act="uncover">' + t('iAm') + '</button></div>';
  }
  function meldPanel() {
    if (meldView === null || !game.P[meldView]) return '';
    var q = game.P[meldView], ms = game.melds.filter(function (m) { return m.owner === q.id; });
    return '<div class="pop meldp" role="dialog" aria-label="' + esc(t('seeMelds', { name: q.name })) + '"><div class="row"><i class="od" style="background:' + q.color + '">' + esc(q.name[0].toUpperCase()) + '</i><b style="flex:1">' + esc(t('seeMelds', { name: q.name })) + '</b><button class="ib" data-act="closeMelds" aria-label="' + t('close2') + '" style="width:34px;height:34px">' + ICON.back + '</button></div>' +
      (ms.length ? '<div class="mpl">' + ms.map(meldRow).join('') + '</div>' : '<p class="tdesc" style="margin:0">' + t('noMelds') + '</p>') + '</div>';
  }
  // Pose de plusieurs combinaisons d'un coup : la sélection est découpée automatiquement
  function planMeld(ids) {
    var cards = ids.map(cardOf); if (cards.some(function (c) { return !c; }) || cards.length < 3) return null;
    var groups = R.arrange(cards) ? [ids.slice()] : null;
    if (!groups) { var r = R.AI.search(cards, { mode: 'out', maxLeft: 0 }); if (!r || r.left) return null; groups = r.melds; }
    var ar = groups.map(function (g) { return R.arrange(g.map(cardOf)); }); if (ar.some(function (m) { return !m; })) return null;
    var pts = ar.reduce(function (a, m) { return a + R.meldPoints(m); }, 0);
    return { groups: groups, pts: pts, open: R.openingStatus(game.provMelds(view).concat(ar)) };
  }
  // ---------- Chronomètre du tour ----------
  function startTimer() { var tt = game ? (game.turnTime != null ? game.turnTime : (S.get('turnTime') || 0)) : 0; tmr.total = tt; tmr.deadline = Date.now() + tt * 1000; tmr.last = Date.now(); tmr.pid = game ? game.turn : -1; tmr.warned = false; }
  function tickTimer() {
    var now = Date.now(), dt = now - (tmr.last || now); tmr.last = now;
    if (!game || game.over || game.ended || screen !== 'table' || !tmr.total) return;
    if ($('.modal.on') || covered || (drag && drag.on)) { tmr.deadline += dt; }
    var left = (tmr.deadline - now) / 1000, p = Math.max(0, Math.min(1, left / tmr.total));
    doc.querySelectorAll('.tmr').forEach(function (e) { e.style.setProperty('--p', p); e.classList.toggle('low', left <= 15); });
    doc.querySelectorAll('.tms').forEach(function (e) { e.textContent = fmtT(left); e.classList.toggle('low', left <= 15); });
    var cp = game.cur();
    if (cp.human && left <= 10 && !tmr.warned) { tmr.warned = true; A.sfx('turn'); }
    if (cp.human && left <= 0) timeUp(cp);
  }
  function timeUp(p) {
    tmr.deadline = Date.now() + 999999;
    for (var i = 0; i < 3 && !game.over && game.cur() === p; i++) {
      if (game.phase === 'draw') game.draw(p.id, 'stock');
      var c = p.hand.filter(function (x) { return x.id === game.lastDrawn; })[0] || p.hand[p.hand.length - 1];
      var r = game.discard_(p.id, c.id); if (r.ok) break;
    }
    sel = []; newId = null; toast(t('timeUp')); render(); scheduleAI();
  }
  // ---------- Vote unanime pour changer le temps par tour ----------
  function tmLabel(v) { return v ? t('tmMin', { n: v / 60 }) : t('tmUnl'); }
  function startVote(v) {
    var cur = game.turnTime != null ? game.turnTime : S.get('turnTime');
    if (v === cur) return;
    vote = { v: v, cur: cur, res: {} }; vote.res[view] = true;
    game.P.forEach(function (p, i) { if (!p.human) setTimeout(function () { if (!vote) return; vote.res[p.id] = Math.random() < (v === 0 ? 0.55 : 0.85); renderVote(); }, 700 + i * 450); });
    $('#mpause').classList.remove('on'); $('#mvote').classList.add('on'); renderVote();
  }
  function renderVote() {
    if (!vote) return; var box = $('#mvote').querySelector('.box'), done = game.P.every(function (p) { return vote.res[p.id] !== undefined; });
    var no = game.P.filter(function (p) { return vote.res[p.id] === false; })[0];
    var h = '<h2>' + t('voteTitle', { v: tmLabel(vote.v) }) + '</h2><p class="tdesc" style="margin:0">' + t('voteAsk') + '</p><div class="vlist">' + game.P.map(function (p) {
      var r = vote.res[p.id], st = r === true ? '<span class="vy">✓ ' + t('voteYes') + '</span>' : r === false ? '<span class="vn">✗ ' + t('voteNo2') + '</span>' : (p.human ? '<span class="row" style="gap:6px"><button class="btn pill" data-act="voteYes" data-v="' + p.id + '">' + t('accept') + '</button><button class="btn ghost pill" data-act="voteNo" data-v="' + p.id + '">' + t('refuse') + '</button></span>' : '<span class="muted">' + t('voteWait') + '</span>');
      return '<div class="sr2"><i class="od" style="background:' + p.color + '">' + esc(p.name[0].toUpperCase()) + '</i><span>' + esc(p.name) + '</span>' + st + '</div>';
    }).join('') + '</div>';
    if (no || done) {
      var ok = !no; if (ok && !vote.applied) { vote.applied = true; game.turnTime = vote.v; S.set('turnTime', vote.v); startTimer(); A.sfx('open'); } else if (!ok && !vote.applied) { vote.applied = true; A.sfx('error'); }
      h += '<p class="vres ' + (ok ? 'ok' : 'ko') + '">' + (ok ? t('voteOk', { v: tmLabel(vote.v) }) : t('voteKo', { name: esc(no.name), v: tmLabel(vote.cur) })) + '</p><button class="btn" data-act="voteClose">' + t('close2') + '</button>';
    }
    box.innerHTML = h;
  }
  // ---------- Glisser-déposer des cartes dans la main ----------
  function cardOf(id) { var h = game.P[view].hand; for (var i = 0; i < h.length; i++) if (h[i].id === id) return h[i]; return null; }
  function initHandDrag() {
    var ghost = null;
    function place(e) { if (!ghost) return; ghost.style.transform = 'translate(' + (e.clientX - ghost._w / 2) + 'px,' + (e.clientY - ghost._h * 0.62) + 'px) rotate(3deg)'; }
    function targetAt(e) { var el = doc.elementFromPoint(e.clientX, e.clientY); if (!el) return null; return el.closest('[data-act="discardPile"]') || el.closest('.mrow[data-meld]'); }
    function markTarget(tg) { doc.querySelectorAll('.droptgt').forEach(function (x) { if (x !== tg) x.classList.remove('droptgt'); }); if (tg) tg.classList.add('droptgt'); }
    function reorder(e) {
      var hn = $('#hand'); if (!hn) return; var r = hn.getBoundingClientRect();
      if (e.clientY < r.top - 40 || e.clientY > r.bottom + 30 || e.clientX < r.left - 30 || e.clientX > r.right + 30) return;
      var best = null, bd = 1e9;
      hn.querySelectorAll('.card[data-id]').forEach(function (c) {
        var id = +c.dataset.id; if (id === drag.id) return; var b = c.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2, d = Math.pow(cx - e.clientX, 2) + Math.pow((cy - e.clientY) * 1.6, 2);
        if (d < bd) { bd = d; best = { id: id, after: e.clientX > cx }; }
      });
      if (!best) return;
      var p = game.P[view], hand = p.hand.filter(function (c) { return c.id !== drag.id; }), idx = -1;
      for (var i = 0; i < hand.length; i++) if (hand[i].id === best.id) idx = i;
      if (idx < 0) return; hand.splice(best.after ? idx + 1 : idx, 0, cardOf(drag.id));
      var before = p.hand.map(function (c) { return c.id; }).join(), after = hand.map(function (c) { return c.id; }).join();
      if (before === after) return;
      p.hand = hand; doFlip = true; drag.allowRender = true; renderTable(); drag.allowRender = false;
    }
    doc.addEventListener('pointerdown', function (e) {
      var c = e.target.closest && e.target.closest('#hand .card[data-id]'); if (!c || !game || covered || game.over) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      drag = { id: +c.dataset.id, sx: e.clientX, sy: e.clientY, on: false, pid: e.pointerId, w: c.offsetWidth, h: c.offsetHeight };
    });
    doc.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.pid) return;
      if (!drag.on) {
        if (Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy) < 9) return;
        drag.on = true; dragId = drag.id; var card = cardOf(drag.id); if (!card) { drag = null; dragId = null; return; }
        ghost = doc.createElement('div'); ghost.id = 'dragghost'; ghost.innerHTML = R.CardView.html(card); ghost.style.setProperty('--gw', drag.w + 'px'); ghost._w = drag.w; ghost._h = drag.h;
        doc.body.appendChild(ghost); sel = sel.filter(function (x) { return x !== drag.id; }); A.sfx('select');
        drag.allowRender = true; renderTable(); drag.allowRender = false;
      }
      e.preventDefault(); place(e); markTarget(targetAt(e)); reorder(e);
    }, { passive: false });
    function end(e, cancel) {
      if (!drag || (e && e.pointerId !== drag.pid)) return;
      var d = drag; drag = null;
      if (!d.on) return;
      lastDragEnd = Date.now(); if (ghost) { ghost.remove(); ghost = null; } markTarget(null); dragId = null;
      if (!S.get('dragSeen')) S.set('dragSeen', true);
      var tg = !cancel && e ? targetAt(e) : null;
      if (tg && humanTurn() && game.phase === 'play') {
        if (tg.dataset.act === 'discardPile') { newId = null; var r3 = game.discard_(view, d.id); if (!r3.ok && !r3.rolled) toast(r3.err, true); }
        else { var r4 = game.attach(view, +tg.dataset.meld, d.id); if (!r4.ok) toast(r4.err, true); }
      }
      render(); scheduleAI();
    }
    doc.addEventListener('pointerup', function (e) { end(e, false); });
    doc.addEventListener('pointercancel', function (e) { end(e, true); });
  }
  function showDrawn(c) {
    var el = $('#drawn'); if (!el) return;
    el.classList.remove('on'); void el.offsetWidth;
    el.innerHTML = '<b>' + t('drew') + '</b>' + R.CardView.html(c);
    el.classList.add('on'); clearTimeout(drawnT); drawnT = setTimeout(function () { el.classList.remove('on'); }, 1500);
  }
  function render() { renderTable(); }
  function scheduleAI() {
    clearTimeout(aiTimer);
    if (!game || screen !== 'table' || game.over || game.ended) return;
    var p = game.cur(); if (p.human) return;
    var d = (S.get('speed') || 1) * 650 * (game.phase === 'draw' ? 1.1 : 0.8);
    aiTimer = setTimeout(function () {
      if (!game || game.over || game.cur() !== p) return;
      if ($('.modal.on')) { scheduleAI(); return; }
      R.AI.step(game, p); render(); scheduleAI();
    }, d);
  }

  // ---------- Actions ----------
  function humanTurn_() { return game && !game.over && game.turn === view && !covered; }
  function humanTurn() { return humanTurn_(); }
  function tapCard(id) {
    if (!humanTurn()) return; var i = sel.indexOf(id);
    if (i >= 0) sel.splice(i, 1); else sel.push(id); newId = null; A.sfx('select'); render();
  }
  function arrangeHand(sorted) {
    var p = game.P[view], hand = p.hand.slice(), out = [];
    if (!sorted) {
      var r = R.AI.search(hand, { mode: 'any' });
      if (r) r.melds.forEach(function (ids) { ids.forEach(function (id) { var c = hand.filter(function (x) { return x.id === id; })[0]; if (c) { out.push(c); hand.splice(hand.indexOf(c), 1); } }); });
    }
    var order = { S: 0, H: 1, D: 2, C: 3, J: 4 };
    hand.sort(function (a, b) { return sorted ? (a.r - b.r) || (order[a.s] - order[b.s]) : (order[a.s] - order[b.s]) || (a.r - b.r); });
    p.hand = out.concat(hand); A.sfx('shuffle'); render();
  }
  function act(a, el) {
    A.unlock();
    switch (a) {
      case 'solo': mode = 'solo'; setup.level = S.get('level'); setup.rounds = S.get('rounds'); renderSetup(); show('setup'); break;
      case 'friends': mode = 'friends'; setup.rounds = S.get('rounds'); renderSetup(); show('setup'); break;
      case 'rank': renderRank(); show('rank'); break;
      case 'shop': renderShop(); show('shop'); break;
      case 'daily': renderDaily(); show('daily'); break;
      case 'claimDaily': { var g = Pg.claimDaily(); if (g) { A.sfx('win'); toast2(t('dailyGot', { n: g })); } renderDaily(); return; }
      case 'claimMission': { var r9 = Pg.claimMission(el.dataset.v); if (r9) { A.sfx('open'); toast2(r9.up ? t('levelUp', { n: r9.up.level, c: r9.up.coins }) : '+' + r9.coins); } renderDaily(); return; }
      case 'homeMute': S.set('homeMusic', S.get('homeMusic') === false); unlocked = true; A.unlock(); musicFor('menu'); renderMenu(); return;
      case 'tableSettings': $('#mpause').classList.add('on'); renderPause(); return;
      case 'pickCombo': { if (!humanTurn() || game.phase !== 'play') return; var cb = combos(game.P[view].hand)[+el.dataset.v]; if (cb) { sel = cb.ids.slice(); A.sfx('select'); } helpOpen = false; break; }
      case 'rules': renderRules(); show('rules'); break;
      case 'settings': renderSettings(); show('settings'); break;
      case 'menu': chatOpen = false; $('#mround').classList.remove('on'); $('#mpause').classList.remove('on'); clearTimeout(aiTimer); game = null; covered = false; A.stop(); M.stopAll(); renderMenu(); show('menu'); break;
      case 'themeToggle': S.set('theme', S.get('theme') === 'dark' ? 'light' : 'dark'); applyTheme(); break;
      case 'level': setup.level = el.dataset.v; S.set('level', setup.level); readNames(); renderSetup(); break;
      case 'rounds': setup.rounds = +el.dataset.v; S.set('rounds', setup.rounds); readNames(); renderSetup(); break;
      case 'n': readNames(); setup.n = +el.dataset.v; renderSetup(); break;
      case 'start': start(); break;
      case 'again': $('#mround').classList.remove('on'); start(); break;
      case 'next': $('#mround').classList.remove('on'); sel = []; game.nextRound(); render(); scheduleAI(); return;
      case 'uncover': startTimer(); covered = false; $('#cover').classList.remove('on'); break;
      case 'pause': $('#mpause').classList.add('on'); renderPause(); break;
      case 'resume': $('#mpause').classList.remove('on'); break;
      case 'quit': if (G.confirm ? true : true) act('menu'); return;
      case 'mic': case 'cam': M.toggle(a).then(function () { render(); if ($('#mpause').classList.contains('on')) renderPause(); }).catch(function (e) { toast(e && e.name === 'NotAllowedError' ? t('mediaDenied') : t('mediaNone'), true); }); return;
      case 'stock': case 'reserve': case 'discardPile':
        if (!game || game.over || covered) return;
        if (game.phase === 'draw' && game.turn === view) {
          var src = a === 'stock' ? 'stock' : a === 'reserve' ? 'reserve' : 'discard';
          if (!game.canTake(view, src)) { toast(src === 'discard' ? t('noDiscardFirst') : src === 'reserve' ? t('reserveOnly') : t('cantDraw'), true); return; }
          game.draw(view, src);
        } else if (a === 'discardPile' && game.phase === 'play' && sel.length === 1) { var r = game.discard_(view, sel[0]); sel = []; if (!r.ok && !r.rolled) toast(r.err, true); }
        break;
      case 'arrange': doFlip = true; arrangeHand(false); return;
      case 'sortCycle': doFlip = true; sortMode = (sortMode + 1) % 2; arrangeHand(sortMode === 0); return;
      case 'seeMelds': meldView = meldView === +el.dataset.v ? null : +el.dataset.v; helpOpen = scoresOpen = false; break;
      case 'closeMelds': meldView = null; break;
      case 'voteYes': case 'voteNo': if (vote) { vote.res[+el.dataset.v] = a === 'voteYes'; renderVote(); } return;
      case 'voteClose': vote = null; $('#mvote').classList.remove('on'); break;
      case 'helpPop': helpOpen = !helpOpen; scoresOpen = false; break;
      case 'scores': scoresOpen = !scoresOpen; helpOpen = false; break;
      case 'sort': arrangeHand(true); return;
      case 'meld': {
        var pl = planMeld(sel); if (!pl) { toast(t('incomplete'), true); break; }
        if (!game.P[view].opened && !pl.open.ok) { toast(t('needMore', { n: R.CONFIG.openPoints, p: pl.open.points }), true); break; }
        var bad = null; pl.groups.forEach(function (g) { if (game.over) return; var r2 = game.meld(view, g); if (!r2.ok) bad = bad || r2.err; });
        if (bad) toast(bad, true); sel = []; break; }
      case 'toDiscard': { newId = null; var r3 = game.discard_(view, sel[0]); sel = []; if (!r3.ok && !r3.rolled) toast(r3.err, true); break; }
    }
    render(); scheduleAI();
  }
  function sw(act, on, label) { return '<button class="sw' + (on ? ' on' : '') + '" data-act="' + act + '" role="switch" aria-checked="' + !!on + '" aria-label="' + label + '"></button>'; }
  var FELTS = [['auto', 'conic-gradient(#22397A 0 50%,#1F6B45 0)'], ['nuit', '#1B3170'], ['vert', '#1A5E3C'], ['violet', '#2E2478'], ['lagon', '#11697A'], ['ardoise', '#323A4F'], ['prune', '#3A1F5C'], ['ocean', '#0E3A5C']];
  function facePreview(f) {
    var cur = (S.get('faces') || 'light') === f, st = S.get('style') || 'joker';
    var cs = [{ id: 'f1' + f, r: 13, s: 'S' }, { id: 'f2' + f, r: 1, s: 'H' }, { id: 'f3' + f, r: 9, s: 'C' }];
    return '<button class="stp' + (cur ? ' on' : '') + '" data-act="faces" data-v="' + f + '" aria-pressed="' + cur + '"><div class="fzp fz-' + f + '" data-style="' + st + '">' + cs.map(function (c) { return R.CardView.html(c); }).join('') + '</div><b>' + t(f === 'light' ? 'facesLight' : 'facesDark') + '</b></button>';
  }
  function stylePreview(st, cur) {
    var cs = [{ id: 'p1' + st, r: 13, s: 'S' }, { id: 'p2' + st, r: 12, s: 'H' }, { id: 'p3' + st, r: 7, s: 'D' }, { id: 'p4' + st, r: 0, s: 'J', joker: true }];
    return '<button class="stp' + (cur === st ? ' on' : '') + '" data-act="style" data-v="' + st + '" aria-pressed="' + (cur === st) + '"><div class="pvf" data-style="' + st + '">' + cs.map(function (c) { return R.CardView.html(c); }).join('') + '</div><b>' + t(st === 'joker' ? 'styleJoker' : 'styleClassic') + '</b></button>';
  }
  function accountTile() {
    var h = '<div class="tile acc"><p class="muted" style="margin:0 0 6px">' + t('account') + '</p>';
    if (!C2 || !C2.enabled()) return h + '<p class="tdesc" style="margin:0">' + t('accOff') + '</p></div>';
    var u = C2.user();
    if (!u) return h + '<p class="tdesc" style="margin:0 0 8px">' + t('accSub') + '</p>' +
      '<input class="field" id="accEmail" type="email" autocomplete="email" inputmode="email" placeholder="' + esc(t('email')) + '" value="' + esc(accDraft.email) + '">' +
      '<input class="field" id="accPw" type="password" autocomplete="current-password" placeholder="' + esc(t('password')) + '" style="margin-top:8px">' +
      '<input class="field" id="accPseudo" maxlength="16" autocomplete="nickname" placeholder="' + esc(t('pseudo')) + '" value="' + esc(accDraft.pseudo) + '" style="margin-top:8px">' +
      '<div class="row" style="margin-top:10px;flex-wrap:wrap"><button class="btn" data-act="accIn">' + t('signIn') + '</button><button class="btn ghost" data-act="accUp">' + t('signUp') + '</button></div></div>';
    var pr = C2.profile(), name = (pr && pr.pseudo) || u.email, ls = C2.lastSync();
    return h + '<p style="margin:0"><b>' + esc(t('connectedAs', { name: name })) + '</b></p><p class="tdesc" style="margin:2px 0 8px">' + esc(u.email) + ' · ' + (C2.busy() ? t('syncing') : ls ? t('synced', { t: ls.toLocaleTimeString(R.lang || 'fr', { hour: '2-digit', minute: '2-digit' }) }) : '') + '</p>' +
      '<div class="row" style="flex-wrap:wrap"><button class="btn" data-act="accSync">' + t('syncNow') + '</button><button class="btn ghost" data-act="accOut">' + t('signOut') + '</button></div></div>';
  }
  function settingsBody(inGame) {
    var tr = A.TRACKS, cur = A.current(), langs = [['auto', t('langAuto')]].concat(Object.keys(R.LANGS).map(function (k) { return [k, R.LANGS[k]]; }));
    return (inGame ? '<p class="muted" style="margin:0;font-size:13px">' + t('inGameSub') + '</p>' : accountTile()) +
      '<div class="li"><span>' + t('music') + '</span><span class="sp"></span>' + sw('musicSw', S.get('music'), t('music')) + '</div>' +
      '<div class="li"><div class="lt"><b>' + t('homeMusic') + '</b><p class="tdesc">' + t('homeMusicSub') + '</p></div>' + sw('homeSw', S.get('homeMusic') !== false, t('homeMusic')) + '</div>' +
      Object.keys(tr).filter(function (k) { return k !== 'home'; }).map(function (k) { return '<div class="li"><button class="round" data-act="track" data-v="' + k + '" aria-label="' + t('tr_' + k) + '">' + (cur === k ? ICON.pause : ICON.play) + '</button><b>' + t('tr_' + k) + '</b></div>'; }).join('') +
      '<div class="li"><span>' + t('volume') + '</span><input type="range" id="vol" min="0" max="100" value="' + Math.round(S.get('volume') * 100) + '" aria-label="' + t('volume') + '"></div>' +
      '<div class="li"><span>' + t('sfx') + '</span><span class="sp"></span>' + sw('sfxSw', S.get('sfx'), t('sfx')) + '</div>' +
      '<div class="li"><span>' + t('sfxVol') + '</span><input type="range" id="sfxvol" min="0" max="100" value="' + Math.round((S.get('sfxVol') != null ? S.get('sfxVol') : 0.8) * 100) + '" aria-label="' + t('sfxVol') + '"></div>' +
      '<div class="tile"><p class="muted" style="margin:0 0 8px">' + t('sfxTest') + '</p><div class="sfxg">' + A.SFX_TEST.map(function (k) { return '<button class="sfxb" data-act="sfxTry" data-v="' + k + '"><span class="round" aria-hidden="true">' + ICON.play + '</span>' + t('s_' + k) + '</button>'; }).join('') + '</div></div>' +
      '<div class="li"><div class="lt"><b>' + t('help') + '</b><p class="tdesc">' + t('helpSub') + '</p></div>' + sw('helpSw', S.get('help'), t('help')) + '</div>' +
      '<div class="li"><div class="lt"><b>' + t('chat') + '</b><p class="tdesc">' + t('chatSub') + '</p></div>' + sw('chatSw', S.get('chat'), t('chat')) + '</div>' +
      '<div class="tile"><p class="muted" style="margin:0 0 8px">' + t('rulesSet') + '</p>' + rulesPicker() + (game ? '<p class="tdesc">' + t('rulesNext') + '</p>' : '') + '</div>' +
      (isNative() ? '' : '<div class="li"><div class="lt"><b>' + t('full') + '</b><p class="tdesc">' + t('fullSub') + '</p></div>' + sw('fullSw', S.get('full'), t('full')) + '</div>') +
      (isNative() ? '' : isStandalone() ? '<div class="li"><b>' + t('installDone') + ' ✓</b></div>' : '<div class="li"><div class="lt"><b>' + t('install') + '</b><p class="tdesc">' + t('installSub') + (installEvt ? '' : ' ' + t('installIos')) + '</p></div>' + (installEvt ? '<button class="btn" data-act="install" style="min-height:40px">' + t('install') + '</button>' : '') + '</div>') +
      '<div class="tile"><p class="muted" style="margin:0 0 8px">' + t('theme') + '</p>' + chips('theme', [['dark', t('dark')], ['light', t('light')], ['auto', t('auto')]], S.get('theme')) + '</div>' +
      '<div class="tile"><p class="muted" style="margin:0 0 8px">' + t('style') + '</p><div class="stps">' + stylePreview('joker', S.get('style')) + stylePreview('classic', S.get('style')) + '</div><p class="tdesc">' + t('styleSub') + '</p></div>' +
      '<div class="tile"><p class="muted" style="margin:0 0 8px">' + t('faces') + '</p><div class="stps">' + facePreview('light') + facePreview('dark') + '</div><p class="tdesc">' + t('facesSub') + '</p></div>' +
      '<div class="tile"><p class="muted" style="margin:0 0 8px">' + t('felt') + '</p><div class="row" style="flex-wrap:wrap">' + FELTS.filter(function (f) { return Sh.ownsFelt(f[0]); }).map(function (f) { var cur = (S.get('felt') || 'auto') === f[0]; return '<button class="chip sw2' + (cur ? ' on' : '') + '" data-act="felt" data-v="' + f[0] + '" aria-pressed="' + cur + '"><span class="swc" style="background:' + f[1] + '"></span>' + t(f[0] === 'auto' ? 'feltAuto' : 'f_' + f[0]) + '</button>'; }).join('') + '</div></div>' +
      '<div class="tile"><p class="muted" style="margin:0 0 8px">' + t('turnTime') + '</p>' + chips('turnTime', [[60, t('tmMin', { n: 1 })], [120, t('tmMin', { n: 2 })], [180, t('tmMin', { n: 3 })], [300, t('tmMin', { n: 5 })], [0, t('tmUnl')]], game && game.turnTime != null ? game.turnTime : S.get('turnTime')) + '<p class="tdesc">' + t('turnTimeSub') + '</p></div>' +
      '<div class="tile"><p class="muted" style="margin:0 0 8px">' + t('speed') + '</p>' + chips('speed', [[1.6, t('slow')], [1, t('normal')], [0.5, t('fast')]], S.get('speed')) + '</div>' +
      (isNative() ? '' : '<div class="tile"><p class="muted" style="margin:0 0 8px">' + t('orientation') + '</p>' + chips('orient', [['auto', t('auto')], ['portrait', t('portrait')], ['landscape', t('landscape')]], S.get('orient')) + '<p class="tdesc">' + t('orientSub') + '</p></div>') +
      '<div class="tile"><p class="muted" style="margin:0 0 8px">' + t('language') + '</p>' + chips('lang', langs, S.get('lang') || 'auto') + '</div>' +
      '<p class="vers">' + t('appName') + ' · ' + t('version') + ' v' + R.VERSION + '</p>';
  }
  function renderPause() {
    var box = $('#mpause').querySelector('.box'), sc = box.scrollTop;
    var ms = M.state();
    box.innerHTML = '<div class="row"><h2>' + t('tableSettings') + '</h2><span class="sp"></span><button class="ib" data-act="resume" aria-label="' + t('close') + '">' + ICON.back + '</button></div>' +
      '<div class="avbig"><button class="avb' + (ms.mic ? ' on' : '') + '" data-act="mic" aria-pressed="' + ms.mic + '">' + (ms.mic ? ICON.mic : ICON.micoff) + '<b>' + t(ms.mic ? 'micOn' : 'micOff') + '</b></button><button class="avb' + (ms.cam ? ' on' : '') + '" data-act="cam" aria-pressed="' + ms.cam + '">' + (ms.cam ? ICON.cam : ICON.camoff) + '<b>' + t(ms.cam ? 'camOn' : 'camOff') + '</b></button></div>' + settingsBody(true) +
      '<button class="btn" data-act="resume">' + t('resume') + '</button><button class="btn ghost" data-act="rulesIn">' + t('rules') + '</button><button class="btn ghost" data-act="quit" style="color:var(--pink)">' + t('quit') + '</button>';
    box.scrollTop = sc;
  }
  function renderRank() {
    var tb = S.table();
    $('#rank').innerHTML = '<div class="menu"><div class="row"><button class="ib" data-act="menu" aria-label="' + t('back') + '">' + ICON.back + '</button><h2>' + t('ranking') + '</h2></div>' +
      (tb.length ? '<div class="tile"><div class="score" style="grid-template-columns:1fr auto auto auto"><small class="muted"></small><small class="muted">' + t('wins') + '</small><small class="muted">' + t('games') + '</small><small class="muted">' + t('avg') + '</small>' + tb.map(function (r, i) { return '<span class="' + (i === 0 ? 'win' : '') + '">' + (i + 1) + '. ' + esc(r.name) + '</span><b>' + r.wins + '</b><span>' + r.games + '</span><span>' + r.avg + '</span>'; }).join('') + '</div></div>' : '<p class="muted">' + t('noRank') + '</p>') + (C2 && C2.enabled() ? '<div class="tile" id="onlineRank"><p class="muted" style="margin:0 0 8px">' + t('onlineRank') + '</p><p class="tdesc">…</p></div>' : '') + '</div>';
    if (C2 && C2.enabled()) C2.leaderboard().then(function (rows) { var el = $('#onlineRank'); if (!el) return; el.innerHTML = '<p class="muted" style="margin:0 0 8px">' + t('onlineRank') + '</p>' + (rows.length ? '<div class="score" style="grid-template-columns:1fr auto auto"><small></small><small class="muted">' + t('wins') + '</small><small class="muted">' + t('games') + '</small>' + rows.map(function (r, i) { return '<span class="' + (i === 0 ? 'win' : '') + '">' + (i + 1) + '. ' + esc(r.pseudo || '?') + '</span><b>' + r.wins + '</b><span>' + r.games + '</span>'; }).join('') + '</div>' : '<p class="tdesc">' + t('noRank') + '</p>'); });
  }
  function renderRules() {
    var id = rulesView || S.get('rules') || 'maison', C = Object.assign({}, R.RULESETS[id]), cl = id === 'classique';
    var rows = [['rCards', 'rCardsV'], ['rPlayers', 'rPlayersV', C.handSize], ['rOpen', cl ? 'rOpenVc' : 'rOpenV', C.openPoints], ['rDiscard', cl ? 'rDiscardVc' : 'rDiscardV'], ['rReserve', cl ? 'rReserveVc' : 'rReserveV'], ['rSec', 'rSecV', C.penaltySec], ['rClassic', 'rClassicV', C.penaltyClassic], ['rAce', 'rAceV'], ['rFig', 'rFigV'], ['rJoker', 'rJokerV', C.jokerHand], ['rWin', 'rWinV']];
    $('#rules').innerHTML = '<div class="menu rules"><div class="row"><button class="ib" data-act="' + (game ? 'backToGame' : 'menu') + '" aria-label="' + t('back') + '">' + ICON.back + '</button><h2>' + t('rules') + '</h2></div>' +
      chips('rulesViewPick', [['maison', t('rsMaison')], ['classique', t('rsClassic')]], id) + '<div class="tile"><table>' +
      rows.map(function (r) { return '<tr><td>' + t(r[0]) + '</td><td>' + t(r[1], { n: r[2] }) + '</td></tr>'; }).join('') + '</table></div></div>';
  }
  function renderSettings() {
    var el = $('#settings'), sc = el.scrollTop;
    el.innerHTML = '<div class="menu"><div class="row"><button class="ib" data-act="menu" aria-label="' + t('back') + '">' + ICON.back + '</button><h2>' + t('settings') + '</h2></div>' + settingsBody(false) + '</div>';
    el.scrollTop = sc;
  }
  function renderShop() {
    var cur = S.get('back') || 'nuit';
    $('#shop').innerHTML = '<div class="menu"><div class="row"><button class="ib" data-act="menu" aria-label="' + t('back') + '">' + ICON.back + '</button><h2>' + t('shop') + '</h2><span class="sp"></span><span class="coinb" aria-label="' + t('coins') + '"><span class="coin"></span>' + Sh.coins() + '</span></div>' +
      '<div class="tile"><p class="muted" style="margin:0 0 8px">' + t('backs') + '</p><div class="backs">' + Sh.BACKS.map(function (b) {
        var own = Sh.owns(b.id), on = cur === b.id;
        return '<button class="bko' + (on ? ' on' : '') + '" data-act="' + (own ? 'equipBack' : 'buyBack') + '" data-v="' + b.id + '"><div class="bk-' + b.id + '">' + R.CardView.back() + '</div><b>' + t('b_' + b.id) + '</b><small>' + (on ? t('equipped') : own ? t('equip') : (b.price + ' · ' + t('buy'))) + '</small></button>';
      }).join('') + '</div><p class="tdesc">' + t('earnHow') + '</p></div>' +
      '<div class="tile"><p class="muted" style="margin:0 0 8px">' + t('felts') + '</p><div class="backs">' + Sh.FELTS.filter(function (f) { return f.price > 0; }).map(function (f) {
        var own = Sh.ownsFelt(f.id), on = (S.get('felt') || 'auto') === f.id, col = FELTS.filter(function (x) { return x[0] === f.id; })[0][1];
        return '<button class="bko' + (on ? ' on' : '') + '" data-act="' + (own ? 'equipFelt' : 'buyFelt') + '" data-v="' + f.id + '"><span class="fsw" style="background:' + col + '"></span><b>' + t('f_' + f.id) + '</b><small>' + (on ? t('equipped') : own ? t('equip') : (f.price + ' · ' + t('buy'))) + '</small></button>';
      }).join('') + '</div></div>' +
      [['vip', 'vipSub'], ['passT', 'passSub'], ['adReward', 'adSub'], ['coinPacks', 'earnHow'], ['roomsT', 'roomsSub'], ['tournaments', 'tournSub']].map(function (x) { return '<div class="li"><div class="lt"><b>' + t(x[0]) + '</b><p class="tdesc">' + (x[0] === 'coinPacks' ? '500 · 1500 · 5000' : t(x[1])) + '</p></div><span class="soon">' + t('soon') + '</span></div>'; }).join('') +
      '<p class="vers">v' + R.VERSION + '</p></div>';
  }
  function renderDaily() {
    var d = Pg.daily(), idx = Pg.dayIndex(), can = Pg.canClaim(), li = Pg.levelInfo();
    var cal = Pg.DAILY.map(function (c, i) { var st = i < idx || (!can && i === idx) ? 'done' : (i === idx && can ? 'now' : ''); return '<div class="dd ' + st + '"><small>' + t('dayN', { n: i + 1 }) + '</small><span class="coin"></span><b>' + c + '</b></div>'; }).join('');
    var ms = Pg.missions().map(function (m) { var ok = m.prog >= m.goal; return '<div class="mis' + (m.claimed ? ' done' : '') + '"><div class="lt"><b>' + t('m_' + m.id, { n: m.goal }) + '</b><span class="bar"><i style="width:' + Math.round(100 * m.prog / m.goal) + '%"></i></span><small class="muted">' + m.prog + ' / ' + m.goal + ' · ' + t('rewardT', { c: m.coins, x: m.xp }) + '</small></div>' + (m.claimed ? '<span class="vy">✓</span>' : '<button class="btn pill" data-act="claimMission" data-v="' + m.id + '"' + (ok ? '' : ' disabled') + '>' + t('claim') + '</button>') + '</div>'; }).join('');
    $('#daily').innerHTML = '<div class="menu"><div class="row"><button class="ib" data-act="menu" aria-label="' + t('back') + '">' + ICON.back + '</button><h2>' + t('daily') + '</h2><span class="sp"></span><span class="coinb"><span class="coin"></span>' + Sh.coins() + '</span></div>' +
      '<div class="tile"><div class="row"><b>' + t('levelN', { n: li.level }) + '</b><span class="sp"></span><small class="muted">' + t('xpTo', { a: li.have, b: li.span }) + '</small></div><span class="bar big"><i style="width:' + Math.round(100 * li.have / li.span) + '%"></i></span></div>' +
      '<div class="tile"><p class="muted" style="margin:0 0 8px">' + t('streak', { n: d.streak || 0 }) + '</p><div class="cal">' + cal + '</div><button class="btn" data-act="claimDaily" style="width:100%;margin-top:10px"' + (can ? '' : ' disabled') + '>' + (can ? t('claim') + ' · ' + Pg.DAILY[idx] : t('claimed')) + '</button></div>' +
      '<div class="tile"><p class="muted" style="margin:0 0 8px">' + t('missionsT') + '</p>' + ms + '<p class="tdesc">' + t('dailyReset') + '</p></div></div>';
  }
  function rerenderAll() {
    if (screen === 'settings') renderSettings(); else if (screen === 'daily') renderDaily(); else if (screen === 'menu') renderMenu(); else if (screen === 'rules') renderRules(); else if (screen === 'rank') renderRank(); else if (screen === 'shop') renderShop(); else if (screen === 'setup') { readNames(); renderSetup(); }
    if ($('#mpause').classList.contains('on')) renderPause();
    if (game && screen === 'table') render();
    renderChat();
  }
  function settingAct(a, el) {
    var changed = true;
    switch (a) {
      case 'theme': S.set('theme', el.dataset.v); applyTheme(); break;
      case 'style': S.set('style', el.dataset.v); applyTheme(); A.sfx('flick'); break;
      case 'felt': S.set('felt', el.dataset.v); applyTheme(); A.sfx('flick'); break;
      case 'faces': S.set('faces', el.dataset.v); applyTheme(); A.sfx('flick'); break;
      case 'lang': S.set('lang', el.dataset.v); applyTheme(); break;
      case 'orient': S.set('orient', el.dataset.v); applyOrientation(); break;
      case 'musicSw': S.set('music', !S.get('music')); audioCfg(); if (S.get('music') && (screen === 'table' || game)) startMusic(); break;
      case 'homeSw': S.set('homeMusic', S.get('homeMusic') === false); unlocked = true; A.unlock(); musicFor('settings'); break;
      case 'sfxSw': S.set('sfx', !S.get('sfx')); audioCfg(); break;
      case 'helpSw': S.set('help', !S.get('help')); break;
      case 'chatSw': S.set('chat', !S.get('chat')); if (!S.get('chat')) chatOpen = false; break;
      case 'track': A.unlock(); A.config({ music: true }); var playing = A.toggle(el.dataset.v); S.set('track', el.dataset.v); S.set('music', playing ? true : S.get('music')); break;
      case 'speed': S.set('speed', +el.dataset.v); break;
      case 'sfxTry': A.unlock(); if (!S.get('sfx')) { S.set('sfx', true); audioCfg(); } A.sfx(el.dataset.v); return true;
      case 'turnTime': if (game && !game.ended) { startVote(+el.dataset.v); return true; } S.set('turnTime', +el.dataset.v); break;
      case 'rulesPick': S.set('rules', el.dataset.v); rulesView = null; if (screen === 'setup') { readNames(); renderSetup(); } A.sfx('flick'); break;
      case 'rulesViewPick': rulesView = el.dataset.v; break;
      case 'fullSw': S.set('full', !S.get('full')); if (S.get('full')) enterFs().then(function (ok) { if (!ok && !isStandalone() && !inFs()) toast2(t('fullNo')); }); else if (inFs()) exitFs(); break;
      case 'install': if (installEvt) { installEvt.prompt(); installEvt.userChoice.then(function () { installEvt = null; rerenderAll(); }); } break;
      default: changed = false;
    }
    if (changed) rerenderAll();
    return changed;
  }
  function accAct(a) {
    if (['accIn', 'accUp', 'accOut', 'accSync'].indexOf(a) < 0) return false;
    var em = (accDraft.email || '').trim(), pw = accDraft.pw || '';
    if (a === 'accOut') { C2.signOut().then(rerenderAll); return true; }
    if (a === 'accSync') { C2.sync().then(function (changed) { if (changed) applyTheme(); rerenderAll(); }); rerenderAll(); return true; }
    if (!em || !pw) { toast2(t('accFill')); return true; }
    if (pw.length < 6) { toast2(t('pwShort')); return true; }
    var pr = a === 'accIn' ? C2.signIn(em, pw) : C2.signUp(em, pw, (accDraft.pseudo || '').trim() || S.get('name'));
    pr.then(function (r) { accDraft.pw = ''; if (r && r.needConfirm) toast2(t('checkMail')); rerenderAll(); }, function () { toast2(t('accErr')); A.sfx('error'); });
    return true;
  }
  function shopAct(a, el) {
    if (a === 'buyBack') { var r = Sh.buy(el.dataset.v); if (r.ok) { Sh.equip(el.dataset.v); A.sfx('win'); applyTheme(); renderShop(); toast2(t('bought')); } else { A.sfx('error'); toast2(t('notEnough')); } return true; }
    if (a === 'buyFelt') { var rf = Sh.buyFelt(el.dataset.v); if (rf.ok) { S.set('felt', el.dataset.v); A.sfx('win'); applyTheme(); renderShop(); toast2(t('bought')); } else { A.sfx('error'); toast2(t('notEnough')); } return true; }
    if (a === 'equipFelt') { S.set('felt', el.dataset.v); applyTheme(); A.sfx('flick'); renderShop(); return true; }
    if (a === 'equipBack') { Sh.equip(el.dataset.v); applyTheme(); A.sfx('flick'); renderShop(); return true; }
    return false;
  }
  function toast2(msg) { var el = $('#gtoast'); el.textContent = msg; el.style.display = 'block'; clearTimeout(el._t); el._t = setTimeout(function () { el.style.display = 'none'; }, 2200); }

  // ---------- Bulle de chat flottante (désactivée par défaut) ----------
  function chatPos() {
    var p = S.get('chatPos') || { x: G.innerWidth - 66, y: Math.round(G.innerHeight * 0.42) };
    return { x: Math.max(6, Math.min(G.innerWidth - 58, p.x)), y: Math.max(6, Math.min(G.innerHeight - 58, p.y)) };
  }
  function renderChat() {
    var b = $('#chatb'), pnl = $('#chatp'), on = !!S.get('chat') && screen === 'table';
    b.style.display = on ? 'grid' : 'none'; if (!on) { pnl.classList.remove('on'); return; }
    var p = chatPos(); b.style.left = p.x + 'px'; b.style.top = p.y + 'px';
    b.setAttribute('aria-label', t('chat')); b.innerHTML = ICON.chat + (chatUnread && !chatOpen ? '<i class="dot"></i>' : '');
    pnl.classList.toggle('on', chatOpen);
    if (!chatOpen) return;
    var w = Math.min(300, G.innerWidth * 0.86), left = p.x > G.innerWidth / 2 ? p.x - w - 8 : p.x + 60, topp = Math.min(Math.max(6, p.y - 40), G.innerHeight - Math.min(360, G.innerHeight * 0.6) - 6);
    pnl.style.left = Math.max(6, Math.min(G.innerWidth - w - 6, left)) + 'px'; pnl.style.top = topp + 'px';
    if (!pnl.querySelector('form')) pnl.innerHTML = '<div class="row"><b>' + t('chat') + '</b><span class="sp"></span><button class="ib" data-act="chatClose" aria-label="' + t('close') + '" style="width:34px;height:34px">' + ICON.back + '</button></div><div class="cl" aria-live="polite"></div><p class="tdesc" style="margin:0">' + t('chatLocal') + '</p><form><input class="field" id="chatIn" maxlength="200" autocomplete="off" placeholder="' + esc(t('chatPh')) + '"><button class="btn" type="submit">' + t('send') + '</button></form>';
    var cl = pnl.querySelector('.cl');
    cl.innerHTML = chatMsgs.length ? chatMsgs.map(function (m) { return '<div class="m"><b>' + esc(m.who) + '</b>' + esc(m.txt) + '</div>'; }).join('') : '<p class="muted" style="margin:0">' + t('chatEmpty') + '</p>';
    cl.scrollTop = cl.scrollHeight;
  }
  function chatSend() {
    var i = $('#chatIn'); if (!i || !i.value.trim()) return;
    var who = game ? game.P[view].name : (S.get('name') || t('me'));
    chatMsgs.push({ who: who, txt: i.value.trim().slice(0, 200) }); i.value = ''; A.sfx('select'); renderChat(); i.focus();
  }
  function initChatDrag() {
    var b = $('#chatb'), st = null;
    b.addEventListener('pointerdown', function (e) { var p = chatPos(); st = { sx: e.clientX, sy: e.clientY, x: p.x, y: p.y, moved: false }; b.setPointerCapture(e.pointerId); });
    b.addEventListener('pointermove', function (e) {
      if (!st) return; var dx = e.clientX - st.sx, dy = e.clientY - st.sy;
      if (Math.abs(dx) + Math.abs(dy) > 6) st.moved = true;
      if (st.moved) { b.style.left = Math.max(6, Math.min(G.innerWidth - 58, st.x + dx)) + 'px'; b.style.top = Math.max(6, Math.min(G.innerHeight - 58, st.y + dy)) + 'px'; }
    });
    b.addEventListener('pointerup', function () {
      if (!st) return;
      if (st.moved) S.set('chatPos', { x: parseInt(b.style.left, 10), y: parseInt(b.style.top, 10) });
      else { chatOpen = !chatOpen; if (chatOpen) chatUnread = false; }
      st = null; renderChat(); if (chatOpen) { var i = $('#chatIn'); if (i) i.focus(); }
    });
    $('#chatp').addEventListener('submit', function (e) { e.preventDefault(); chatSend(); });
  }

  function init() {
    applyTheme(); applyLayout(false); lockOrient(); audioCfg(); renderMenu(); show('menu'); initChatDrag(); initHandDrag(); setInterval(tickTimer, 250);
    var unlockOnce = function () { if (unlocked) return; unlocked = true; A.unlock(); musicFor(screen); };
    doc.addEventListener('pointerdown', unlockOnce, true); doc.addEventListener('keydown', unlockOnce, true);
    if (isNative()) unlockOnce();
    if (Pg.canClaim()) { renderDaily(); show('daily'); }
    G.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); installEvt = e; rerenderAll(); });
    G.addEventListener('appinstalled', function () { installEvt = null; rerenderAll(); });
    if (G.matchMedia) { var mq = G.matchMedia('(orientation: landscape)'); var onMq = function () { applyLayout(true); }; if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq); }
    doc.addEventListener('click', function (e) {
      if (Date.now() - lastDragEnd < 350) return;
      if ((helpOpen || scoresOpen || meldView !== null) && !(e.target.closest && e.target.closest('.pop,[data-act=helpPop],[data-act=scores],[data-act=pickCombo],[data-act=seeMelds]'))) { helpOpen = scoresOpen = false; meldView = null; if (game && screen === 'table') render(); }
      var card = e.target.closest && e.target.closest('#hand .card[data-id]');
      if (card) { tapCard(+card.dataset.id); return; }
      var mr = e.target.closest && e.target.closest('.mrow[data-meld]');
      if (mr && game && humanTurn() && game.phase === 'play' && sel.length) {
        var mid = +mr.dataset.meld, ok = 0, bad = null;
        sel.slice().forEach(function (id) { var r = game.attach(view, mid, id); if (r.ok) { ok++; sel.splice(sel.indexOf(id), 1); } else bad = bad || r.err; });
        if (bad && !ok) toast(bad, true); render(); return;
      }
      var b = e.target.closest && e.target.closest('[data-act]'); if (!b) return;
      var a = b.dataset.act;
      if (a === 'chatClose') { chatOpen = false; renderChat(); return; }
      if (a === 'rulesIn') { $('#mpause').classList.remove('on'); renderRules(); show('rules'); return; }
      if (a === 'backToGame') { show('table'); render(); renderChat(); scheduleAI(); return; }
      if (settingAct(a, b)) return;
      if (shopAct(a, b)) return;
      if (accAct(a)) return;
      act(a, b); renderChat();
    });
    doc.addEventListener('input', function (e) { if (e.target.id === 'accEmail') accDraft.email = e.target.value; if (e.target.id === 'accPw') accDraft.pw = e.target.value; if (e.target.id === 'accPseudo') accDraft.pseudo = e.target.value; if (e.target.id === 'sfxvol') { S.set('sfxVol', e.target.value / 100); audioCfg(); clearTimeout(e.target._t); e.target._t = setTimeout(function () { A.sfx('place'); }, 180); } if (e.target.id === 'vol') { S.set('volume', e.target.value / 100); audioCfg(); } });
    M.onChange(function () { if (game && screen === 'table') render(); });
    if (C2) C2.onChange(function () { var fo = doc.activeElement && /^acc/.test(doc.activeElement.id || ''); if (!fo && (screen === 'settings' || screen === 'rank')) { if (screen === 'settings') renderSettings(); else renderRank(); } applyTheme(); });
    G.addEventListener('resize', function () { var before = lay; applyLayout(true); if (before === lay && game && screen === 'table') render(); renderChat(); });
    G.Rami.debug = { game: function () { return game; }, view: function () { return view; }, sel: function () { return sel; }, render: render, schedule: scheduleAI, timer: function () { return tmr; }, chat: function (m) { chatMsgs.push(m); chatOpen = true; renderChat(); } };
  }
  R.UI = { init: init, applyTheme: applyTheme };
})(window);
