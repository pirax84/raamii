/* Musiques et bruitages créés dans l'appli avec Web Audio : aucun fichier, aucun droit d'auteur, aucune SACEM. */
(function (G) {
  var R = (G.Rami = G.Rami || {});
  var ctx = null, master = null, musicBus = null, sfxBus = null, timer = null, current = null, noiseBuf = null;
  var state = { music: true, sfx: true, volume: 0.5 };
  var TRACKS = { calm: 'Salon calme', jazz: 'Soirée jazz', rain: 'Pluie douce', piano: 'Piano du soir', bossa: 'Bossa légère', night: 'Nuit étoilée' };

  function ensure() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return true; }
    var AC = G.AudioContext || G.webkitAudioContext; if (!AC) return false;
    ctx = new AC(); master = ctx.createGain(); master.gain.value = state.volume; master.connect(ctx.destination);
    musicBus = ctx.createGain(); musicBus.gain.value = 0.55; musicBus.connect(master);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.9; sfxBus.connect(master);
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

  // ----- Bruitages -----
  var SFX = {
    shuffle: function (t) { for (var i = 0; i < 14; i++) noise(sfxBus, t + i * 0.045, 0.06, 0.25, 2500 + Math.random() * 2500, 0.8); },
    deal: function (t) { noise(sfxBus, t, 0.07, 0.35, 3200, 1.2); tone(sfxBus, 220, t, 0.05, 'triangle', 0.05); },
    flick: function (t) { noise(sfxBus, t, 0.06, 0.4, 4200, 1.4); },
    select: function (t) { tone(sfxBus, f(79), t, 0.08, 'sine', 0.12); },
    place: function (t) { noise(sfxBus, t, 0.09, 0.4, 1800, 0.9); tone(sfxBus, f(64), t, 0.18, 'triangle', 0.16); tone(sfxBus, f(71), t + 0.07, 0.22, 'sine', 0.12); },
    open: function (t) { [60, 64, 67, 72].forEach(function (n, i) { tone(sfxBus, f(n + 12), t + i * 0.08, 0.5, 'sine', 0.14); }); },
    error: function (t) { tone(sfxBus, f(48), t, 0.18, 'sawtooth', 0.08); tone(sfxBus, f(45), t + 0.1, 0.22, 'sawtooth', 0.08); },
    win: function (t) { [67, 72, 76, 79, 84].forEach(function (n, i) { tone(sfxBus, f(n), t + i * 0.1, 0.6, 'triangle', 0.15); }); },
    turn: function (t) { tone(sfxBus, f(76), t, 0.15, 'sine', 0.1); }
  };
  function sfx(name) { if (!state.sfx || !ensure() || !SFX[name]) return; SFX[name](ctx.currentTime + 0.01); }

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
    if (!ensure()) return; stop(); current = name; var beat = 0, step = { jazz: 0.3, rain: 0.5, piano: 0.32, bossa: 0.17, night: 0.42 }[name] || 0.45;
    var next = ctx.currentTime + 0.1;
    timer = setInterval(function () { while (next < ctx.currentTime + 0.4) { gens[name](beat, next, step); beat++; next += step; } }, 120);
  }
  R.Audio = {
    TRACKS: TRACKS, sfx: sfx,
    config: function (o) { Object.assign(state, o); if (master) master.gain.value = state.volume; if (!state.music) stop(); },
    unlock: ensure, play: start, stop: stop, current: function () { return current; },
    toggle: function (name) { if (current === name) { stop(); return false; } start(name); return true; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
