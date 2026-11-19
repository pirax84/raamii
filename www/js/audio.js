/* Musiques et bruitages créés dans l'appli avec Web Audio : aucun fichier, aucun droit d'auteur, aucune SACEM. */
(function (G) {
  var R = (G.Rami = G.Rami || {});
  var ctx = null, master = null, musicBus = null, sfxBus = null, timer = null, current = null, noiseBuf = null;
  var state = { music: true, sfx: true, volume: 0.5, sfxVol: 0.8 };
  var TRACKS = { home: 'Accueil', calm: 'Salon calme', jazz: 'Soirée jazz', rain: 'Pluie douce', piano: 'Piano du soir', bossa: 'Bossa légère', night: 'Nuit étoilée' };

  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return true; }
    var AC = G.AudioContext || G.webkitAudioContext; if (!AC) return false;
    ctx = new AC(); master = ctx.createGain(); master.gain.value = state.volume; master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = 0.55; musicBus.connect(master);
    sfxBus = ctx.createGain(); sfxBus.gain.value = state.sfxVol * 1.1; sfxBus.connect(master);
    var len = ctx.sampleRate * 2; noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate); var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return true;
  }
  function f(n) { return 440 * Math.pow(2, (n - 69) / 12); }
  function tone(bus, freq, t, dur, type, vol, attack) {
    var o = ctx.createOscillator(), g = ctx.createGain(); o.type = type || 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + (attack || 0.01)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + 0.05);
  }
  function noise(bus, t, dur, vol, freq, q, type) {
    var s = ctx.createBufferSource(); s.buffer = noiseBuf; var fl = ctx.createBiquadFilter(); fl.type = type || 'bandpass'; fl.frequency.value = freq; fl.Q.value = q || 1;
    var g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(fl); fl.connect(g); g.connect(bus); s.start(t, Math.random()); s.stop(t + dur + 0.05);
  }

  // ----- Bruitages de cartes réalistes (frottements de carton, claquements, petite pièce) — sans aucune note de musique -----
  var room = null, sfxOut = null;
  function out() {
    if (sfxOut && sfxOut.context === ctx) return sfxOut;
    sfxOut = ctx.createGain(); var lim = ctx.createDynamicsCompressor(); lim.threshold.value = -10; lim.knee.value = 6; lim.ratio.value = 8; lim.attack.value = 0.002; lim.release.value = 0.12; sfxOut.connect(lim); lim.connect(sfxBus);
    var len = Math.floor(ctx.sampleRate * 0.32), ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var ch = 0; ch < 2; ch++) { var d = ir.getChannelData(ch); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2) * 0.5; }
    room = ctx.createConvolver(); room.buffer = ir; var wet = ctx.createGain(); wet.gain.value = 0.14; room.connect(wet); wet.connect(sfxBus); sfxOut.connect(room);
    return sfxOut;
  }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  // frottement / claquement de carton
  function paper(t, o) {
    var src = ctx.createBufferSource(); src.buffer = noiseBuf;
    var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = o.q || 0.8; bp.frequency.setValueAtTime(o.f, t); if (o.f2) bp.frequency.exponentialRampToValueAtTime(o.f2, t + o.dur);
    var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 450;
    var g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(o.v * 3.2, t + (o.a || 0.004)); g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    var node = g;
    if (ctx.createStereoPanner) { var pn = ctx.createStereoPanner(); pn.pan.value = o.pan || 0; g.connect(pn); node = pn; }
    src.connect(bp); bp.connect(hp); hp.connect(g); node.connect(out());
    src.start(t, Math.random() * 1.5); src.stop(t + o.dur + 0.05);
  }
  // petit choc sourd de la carte sur le tapis
  function thump(t, v) {
    var src = ctx.createBufferSource(); src.buffer = noiseBuf; var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 260; lp.Q.value = 0.6;
    var g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v * 2.4, t + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    src.connect(lp); lp.connect(g); g.connect(out()); src.start(t, Math.random()); src.stop(t + 0.1);
  }
  var SFX = {
    select: function (t) { paper(t, { f: 5200, q: 1.3, dur: 0.03, v: 0.09, a: 0.002 }); },
    draw: function (t) { paper(t, { f: 2400, f2: 4200, dur: 0.17, v: 0.2, a: 0.035, q: 0.7, pan: rnd(-0.1, 0.1) }); paper(t + 0.15, { f: 5200, dur: 0.03, v: 0.13, a: 0.002 }); },
    flick: function (t) { paper(t, { f: 2800, f2: 4000, dur: 0.11, v: 0.13, a: 0.02, pan: rnd(-0.3, 0.3) }); },
    slide: function (t) { paper(t, { f: 1700, f2: 3200, dur: 0.24, v: 0.18, a: 0.06, q: 0.6 }); },
    place: function (t, v) { v = v || 1; paper(t, { f: 3200, f2: 2200, dur: 0.07, v: 0.14 * v, a: 0.012 }); thump(t + 0.05, 0.3 * v); paper(t + 0.05, { f: 4300, dur: 0.028, v: 0.18 * v, a: 0.001 }); },
    meld: function (t) { for (var i = 0; i < 3; i++) SFX.place(t + i * 0.09 + rnd(0, 0.02), 0.85); },
    discard: function (t) { SFX.slide(t); SFX.place(t + 0.18); },
    deal: function (t) { for (var i = 0; i < 12; i++) { var p = rnd(-0.35, 0.35); paper(t + i * 0.075 + rnd(0, 0.01), { f: rnd(2600, 4200), f2: 2000, dur: 0.06, v: rnd(0.12, 0.17), a: 0.004, pan: p }); thump(t + i * 0.075 + 0.04, 0.07); } },
    shuffle: function (t) {
      var n = 46; for (var i = 0; i < n; i++) { var x = Math.pow(i / n, 1.15); paper(t + 0.9 * x, { f: rnd(4200, 6800), q: 2, dur: 0.018, v: rnd(0.07, 0.12), a: 0.001, pan: (i % 2 ? -1 : 1) * (0.35 - 0.3 * x) }); }
      paper(t + 0.95, { f: 1500, f2: 3600, dur: 0.36, v: 0.15, a: 0.09, q: 0.5 }); thump(t + 1.32, 0.24); paper(t + 1.32, { f: 4500, dur: 0.03, v: 0.12, a: 0.001 });
    },
    error: function (t) { thump(t, 0.26); thump(t + 0.13, 0.2); },
    open: function (t) { SFX.meld(t); [72, 76, 79, 84].forEach(function (n, i) { tone(sfxBus, f(n), t + 0.32 + i * 0.08, 0.5, 'sine', 0.06); }); },
    win: function (t) { [67, 72, 76, 79, 84].forEach(function (n, i) { tone(sfxBus, f(n), t + i * 0.1, 0.6, 'triangle', 0.12); }); },
    turn: function (t) { tone(sfxBus, f(76), t, 0.15, 'sine', 0.07); }
  };
  var SFX_TEST = ['draw', 'slide', 'place', 'meld', 'discard', 'deal', 'shuffle'];
  function sfx(name) { if (!state.sfx || !ensure() || !SFX[name]) return; SFX[name](ctx.currentTime + 0.01); }
  // rend une suite de bruitages hors ligne (pour écouter un aperçu sans jouer)
  function renderDemo(names, gap) {
    var OAC = G.OfflineAudioContext || G.webkitOfflineAudioContext; if (!OAC) return Promise.reject(new Error('none'));
    var keep = { ctx: ctx, sfxBus: sfxBus, noiseBuf: noiseBuf, sfxOut: sfxOut, room: room }, total = names.length * (gap || 1.6) + 0.5;
    ctx = new OAC(2, Math.ceil(44100 * total), 44100); sfxBus = ctx.createGain(); sfxBus.gain.value = 0.9; sfxBus.connect(ctx.destination); sfxOut = null;
    var len = ctx.sampleRate * 2; noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate); var d = noiseBuf.getChannelData(0); for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    names.forEach(function (n, i) { SFX[n](0.2 + i * (gap || 1.6)); });
    var off = ctx; ctx = keep.ctx; sfxBus = keep.sfxBus; noiseBuf = keep.noiseBuf; sfxOut = keep.sfxOut; room = keep.room;
    return off.startRendering();
  }

  // ----- Musiques génératives (un seul morceau à la fois) -----
  var CH = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 55, 60, 64], [55, 59, 62, 65]]; // Am7 Fmaj7 Cmaj7 G6
  var PENTA = [69, 72, 74, 76, 79, 81, 84];
  var gens = {
    calm: function (beat, t, step) {
      if (beat % 8 === 0) { var ch = CH[(beat / 8) % CH.length]; ch.forEach(function (n) { tone(musicBus, f(n), t, step * 8.5, 'sine', 0.07, 1.2); tone(musicBus, f(n + 12), t + 0.02, step * 8, 'triangle', 0.02, 1.5); }); }
      if (beat % 2 === 0 && Math.random() < 0.55) tone(musicBus, f(PENTA[Math.floor(Math.random() * PENTA.length)]), t, step * 3, 'sine', 0.06, 0.02);
    },
    jazz: function (beat, t, step) {
      var II = [[50, 53, 57, 60], [55, 59, 62, 65], [48, 52, 55, 59], [48, 52, 55, 59]], ch = II[Math.floor(beat / 8) % 4];
      if (beat % 4 === 0) tone(musicBus, f(ch[0] - 12), t, step * 3.5, 'triangle', 0.16, 0.01);
      if (beat % 8 === 2 || beat % 8 === 5) ch.slice(1).forEach(function (n) { tone(musicBus, f(n + 12), t, step * 2.5, 'sine', 0.045, 0.02); });
      if (beat % 2 === 1) noise(musicBus, t, 0.09, 0.03, 7000, 0.7, 'highpass');
      if (beat % 4 === 2 && Math.random() < 0.6) tone(musicBus, f(ch[Math.floor(Math.random() * 4)] + 24), t + step * 0.1, step * 2, 'sine', 0.05, 0.01);
    },
    rain: function (beat, t, step) {
      for (var i = 0; i < 3; i++) noise(musicBus, t + Math.random() * step, 0.25, 0.045, 3500 + Math.random() * 3000, 0.5, 'bandpass');
      if (beat % 16 === 0) noise(musicBus, t, step * 15, 0.03, 900, 0.4, 'lowpass');
      if (beat % 8 === 0 && Math.random() < 0.7) tone(musicBus, f(PENTA[Math.floor(Math.random() * 5)] - 12), t, step * 6, 'sine', 0.06, 0.4);
    }
  };
  // 3 nouvelles pistes
  gens.home = function (beat, t, step) { // ambiance d'accueil : nappe douce + petites notes qui scintillent
    var H = [[57, 64, 67, 71], [53, 60, 64, 69], [48, 55, 60, 64], [55, 62, 67, 71]], ch = H[Math.floor(beat / 16) % 4];
    if (beat % 16 === 0) ch.forEach(function (n) { tone(musicBus, f(n), t, step * 16.5, 'sine', 0.045, 2.2); });
    if (beat % 2 === 0 && Math.random() < 0.5) tone(musicBus, f(ch[Math.floor(Math.random() * 4)] + 24), t, step * 4, 'triangle', 0.028, 0.01);
  };
  gens.piano = function (beat, t, step) {
    var P = [[57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 67], [52, 55, 59, 64]], ch = P[Math.floor(beat / 8) % 4];
    if (beat % 8 === 0) tone(musicBus, f(ch[0] - 12), t, step * 8, 'triangle', 0.09, 0.01);
    var arp = [0, 1, 2, 3, 2, 1, 2, 3][beat % 8]; tone(musicBus, f(ch[arp] + 12), t, step * 3, 'triangle', 0.05, 0.005);
    if (beat % 8 === 6 && Math.random() < 0.5) tone(musicBus, f(ch[3] + 24), t, step * 4, 'sine', 0.035, 0.01);
  };
  gens.bossa = function (beat, t, step) {
    var B = [[50, 57, 60, 65], [55, 59, 62, 65], [48, 55, 59, 64], [45, 52, 55, 60]], ch = B[Math.floor(beat / 16) % 4], b = beat % 16;
    if (b === 0 || b === 6 || b === 8 || b === 14) tone(musicBus, f((b < 8 ? ch[0] : ch[0] + 7) - 12), t, step * 2.5, 'sine', 0.15, 0.01);
    if ([0, 3, 6, 10, 12].indexOf(b) >= 0) noise(musicBus, t, 0.05, 0.05, 2600, 3, 'bandpass');
    if ([2, 5, 9, 13].indexOf(b) >= 0) ch.slice(1).forEach(function (n) { tone(musicBus, f(n + 12), t, step * 1.6, 'sine', 0.035, 0.01); });
    if (b % 2 === 1) noise(musicBus, t, 0.04, 0.02, 8000, 0.7, 'highpass');
  };
  gens.night = function (beat, t, step) {
    var N = [[48, 55, 62, 64], [45, 52, 59, 62], [41, 48, 55, 60], [43, 50, 57, 62]];
    if (beat % 16 === 0) N[(beat / 16) % 4].forEach(function (n) { tone(musicBus, f(n), t, step * 17, 'sine', 0.05, 3); });
    if (beat % 3 === 0 && Math.random() < 0.45) tone(musicBus, f([76, 79, 81, 84, 86, 88][Math.floor(Math.random() * 6)]), t, step * 5, 'sine', 0.035, 0.005);
  };
  function stop() { if (timer) { clearInterval(timer); timer = null; } current = null; }
  function start(name) {
    if (!ensure()) return; stop(); current = name; var beat = 0, step = { home: 0.36, jazz: 0.3, rain: 0.5, piano: 0.32, bossa: 0.17, night: 0.42 }[name] || 0.45;
    var next = ctx.currentTime + 0.1;
    timer = setInterval(function () { while (next < ctx.currentTime + 0.4) { gens[name](beat, next, step); beat++; next += step; } }, 120);
  }
  R.Audio = {
    TRACKS: TRACKS, sfx: sfx,
    config: function (o) { Object.assign(state, o); if (master) master.gain.value = state.volume; if (sfxBus && sfxBus.context === ctx) sfxBus.gain.value = state.sfxVol * 1.1; if (!state.music) stop(); },
    SFX_TEST: SFX_TEST, renderDemo: renderDemo,
    unlock: ensure, play: start, stop: stop, current: function () { return current; },
    toggle: function (name) { if (current === name) { stop(); return false; } start(name); return true; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
