/* Micro et caméra (mobile et PC) via getUserMedia. Les flux des autres joueurs arrivent par Rami.Media.setRemote(pid, stream) en mode en ligne. */
(function (G) {
  var R = (G.Rami = G.Rami || {});
  var local = null, remote = {}, onChange = function () {}, analyser = null, speaking = false, raf = null;
  function has() { return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia); }
  function rebuild(wantAudio, wantVideo) {
    if (local) { local.getTracks().forEach(function (t) { t.stop(); }); local = null; }
    if (analyser) { analyser = null; } 
    if (!wantAudio && !wantVideo) { onChange(); return Promise.resolve(); }
    return navigator.mediaDevices.getUserMedia({ audio: wantAudio ? { echoCancellation: true, noiseSuppression: true } : false, video: wantVideo ? { facingMode: 'user', width: { ideal: 320 }, height: { ideal: 240 } } : false })
      .then(function (s) { local = s; if (wantAudio) watch(s); onChange(); });
  }
  function watch(stream) {
    try {
      var AC = G.AudioContext || G.webkitAudioContext, c = new AC(), src = c.createMediaStreamSource(stream); analyser = c.createAnalyser(); analyser.fftSize = 256; src.connect(analyser);
      var buf = new Uint8Array(analyser.frequencyBinCount);
      (function loop() { if (!analyser) return; analyser.getByteFrequencyData(buf); var s = 0; for (var i = 0; i < buf.length; i++) s += buf[i]; var sp = s / buf.length > 18; if (sp !== speaking) { speaking = sp; onChange(); } raf = requestAnimationFrame(loop); })();
    } catch (e) {}
  }
  var st = { mic: false, cam: false };
  R.Media = {
    supported: has, onChange: function (fn) { onChange = fn; },
    state: function () { return { mic: st.mic, cam: st.cam, speaking: speaking && st.mic }; },
    stream: function () { return local; },
    remote: function (pid) { return remote[pid]; }, setRemote: function (pid, s) { remote[pid] = s; onChange(); },
    toggle: function (what) {
      if (!has()) return Promise.reject(new Error('none'));
      var nm = what === 'mic' ? !st.mic : st.mic, nc = what === 'cam' ? !st.cam : st.cam;
      return rebuild(nm, nc).then(function () { st.mic = nm; st.cam = nc; onChange(); }).catch(function (e) { throw e; });
    },
    stopAll: function () { st.mic = st.cam = false; rebuild(false, false); }
  };
})(typeof window !== 'undefined' ? window : globalThis);
