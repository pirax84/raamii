/* Dessin des cartes (HTML + SVG). Les couleurs viennent du thème via les variables CSS (--c, --ink...). */
(function (G) {
  var R = (G.Rami = G.Rami || {});
  var SP = {
    H: 'M12 21C5 15 3 11 3 8a5 5 0 019-3 5 5 0 019 3c0 3-2 7-9 13z',
    D: 'M12 2l8 10-8 10-8-10z',
    S: 'M12 2C6 8 3 11 3 14a4.5 4.5 0 008 3c0 3-1 4-3 5h8c-2-1-3-2-3-5a4.5 4.5 0 008-3c0-3-3-6-9-12z',
    C: 'M12 3a4.5 4.5 0 00-2 8.5A4.5 4.5 0 106.5 19c2 0 3-1 4-3 0 3-1 5-2 6h7c-1-1-2-3-2-6 1 2 2 3 4 3a4.5 4.5 0 10-3.500-7.500A4.500 4.500 0 0012 3z'
  };
  function suit(s) { return '<svg class="su" viewBox="0 0 24 24" aria-hidden="true"><path d="' + SP[s] + '"/></svg>'; }

  // Roi : couronne carrée à croix, barbe, épée — cadre droit à double filet
  var KING = '<rect class="fl fs" x="3" y="3" width="94" height="114" rx="3" stroke-width="2.5"/><rect class="fs" x="8" y="8" width="84" height="104" fill="none" stroke-width="1" opacity=".7"/>' +
    '<path class="fc" d="M14 114V100Q14 87 36 83H64Q86 87 86 100V114Z"/><rect class="wc" x="30" y="82" width="40" height="7" rx="3.5"/>' +
    '<path class="hr" d="M35 52Q35 80 50 84Q65 80 65 52Q59 64 50 64Q41 64 35 52Z"/><circle class="sk" cx="50" cy="48" r="15"/><path class="hr" d="M36 50Q50 70 64 50Q60 66 50 66Q40 66 36 50Z"/><circle class="dk" cx="44" cy="46" r="1.8"/><circle class="dk" cx="56" cy="46" r="1.8"/>' +
    '<rect class="fc ol" x="34" y="27" width="32" height="9"/><rect class="fc ol" x="34" y="19" width="8" height="8"/><rect class="fc ol" x="46" y="19" width="8" height="8"/><rect class="fc ol" x="58" y="19" width="8" height="8"/><rect class="ik" x="48.5" y="9" width="3" height="10"/><rect class="ik" x="45" y="12" width="10" height="3"/>' +
    '<rect class="ik" x="80.5" y="40" width="3.5" height="56" rx="1.5"/><rect class="ik" x="74" y="52" width="17" height="4" rx="2"/><circle class="ik" cx="82.2" cy="98" r="3.5"/>';
  // Dame : diadème et perle, cheveux longs, fleur — cadre en arche
  var QUEEN = '<path class="fl fs" d="M5 116V52Q5 5 50 5Q95 5 95 52V116Z" stroke-width="2.5"/><path class="fs" d="M10 112V52Q10 11 50 11Q90 11 90 52V112" fill="none" stroke-width="1" opacity=".7"/>' +
    '<path class="hr" d="M36 40Q16 68 24 106Q44 98 40 62Z"/><path class="hr" d="M64 40Q84 68 76 106Q56 98 60 62Z"/>' +
    '<path class="fc" d="M18 116Q18 92 38 85Q50 97 62 85Q82 92 82 116Z"/><path class="wc2" d="M38 85Q50 97 62 85" fill="none" stroke-width="3"/><circle class="wc" cx="50" cy="97" r="3.5"/>' +
    '<circle class="sk" cx="50" cy="48" r="14"/><path class="hr" d="M36 44Q38 30 50 30Q62 30 64 44Q56 36 50 36Q44 36 36 44Z"/>' +
    '<path class="fs" d="M37 37Q50 25 63 37" fill="none" stroke-width="3.5" stroke-linecap="round"/><circle class="wc fs" cx="50" cy="28.5" r="4" stroke-width="1.5"/>' +
    '<path class="dks" d="M43 46q2-2 4 0M53 46q2-2 4 0" fill="none" stroke-width="1.6" stroke-linecap="round"/><path class="fs" d="M45 55q5 4 10 0" fill="none" stroke-width="2" stroke-linecap="round"/>' +
    '<path class="iks" d="M78 112Q76 98 80 84" fill="none" stroke-width="2.5"/><g class="wc fs" stroke-width="1.5"><circle cx="80" cy="76" r="5"/><circle cx="74" cy="80" r="5"/><circle cx="86" cy="80" r="5"/><circle cx="76" cy="87" r="5"/><circle cx="84" cy="87" r="5"/></g><circle class="fc" cx="80" cy="82" r="3.5"/>';
  // Valet : toque à plume, sans couronne, écharpe, écu — cadre aux coins coupés
  var JACK = '<path class="fl fs" d="M20 4H80L96 20V100L80 116H20L4 100V20Z" stroke-width="2.5"/><path class="fs" d="M22 9H78L91 22V98L78 111H22L9 98V22Z" fill="none" stroke-width="1" opacity=".7"/>' +
    '<path class="fc" d="M14 114V100Q14 86 36 82H64Q86 86 86 100V114Z"/><path class="wc" d="M14 100L30 114H44L14 88Z" opacity=".9"/><rect class="sk" x="43" y="76" width="14" height="9" rx="3"/>' +
    '<circle class="sk" cx="50" cy="52" r="14"/><path class="hr" d="M36 50Q36 36 50 36Q64 36 64 50Q58 44 50 44Q42 44 36 50Z"/>' +
    '<path class="fc ol" d="M28 40Q30 20 52 20Q72 20 74 38Q62 32 50 32Q38 32 28 40Z"/><path class="wc fs" d="M62 28C70 4 92 6 90 26C84 14 74 16 62 28Z" stroke-width="2"/><path class="fs" d="M66 24Q80 14 88 20" fill="none" stroke-width="1.2"/>' +
    '<circle class="dk" cx="44" cy="54" r="1.8"/><circle class="dk" cx="56" cy="54" r="1.8"/><path class="dks" d="M45 60q5 3.5 10 0" fill="none" stroke-width="1.8" stroke-linecap="round"/>' +
    '<path class="wc fs" d="M70 92h18v10q0 8-9 11-9-3-9-11z" stroke-width="1.8"/><rect class="fc" x="77.5" y="94" width="3" height="16"/>';
  // Joker : grand sourire, chapeau à trois cornes, col en losanges
  var JOKER = '<path class="ja" d="M28 52C6 44 4 16 26 8C22 24 32 36 46 40Z"/><path class="jb" d="M72 52C94 44 96 16 74 8C78 24 68 36 54 40Z"/><path class="jc" d="M40 40C38 22 46 8 50 2C54 8 62 22 60 40Z"/>' +
    '<circle class="sk" cx="50" cy="66" r="24"/><path class="jd" d="M42 58l5 5-5 5-5-5zM58 58l5 5-5 5-5-5z"/><path class="ja jds" d="M33 72Q50 94 67 72Q50 82 33 72Z" stroke-width="1.8"/>' +
    '<path class="je" d="M14 118Q14 94 38 88Q50 100 62 88Q86 94 86 118Z" stroke-width="2"/><path class="jb" d="M30 104l6 6-6 6-6-6zM50 104l6 6-6 6-6-6zM70 104l6 6-6 6-6-6z"/>';

  function fig(r) { var b = r === 13 ? KING : r === 12 ? QUEEN : JACK; return '<svg class="fig" viewBox="0 0 100 120" aria-hidden="true">' + b + '</svg>'; }
  function emb(r) {
    if (r === 13) return '<svg class="em" viewBox="0 0 24 24"><rect x="4" y="12" width="16" height="6"/><rect x="4" y="6" width="4" height="6"/><rect x="10" y="6" width="4" height="6"/><rect x="16" y="6" width="4" height="6"/></svg>';
    if (r === 12) return '<svg class="em" viewBox="0 0 24 24"><circle cx="12" cy="5" r="4"/><circle cx="6" cy="10" r="4"/><circle cx="18" cy="10" r="4"/><circle cx="8" cy="17" r="4"/><circle cx="16" cy="17" r="4"/></svg>';
    if (r === 11) return '<svg class="em" viewBox="0 0 24 24"><path d="M5 21C5 9 13 3 21 3 21 11 15 19 5 21z"/></svg>';
    return '';
  }
  function corner(pos, c) {
    var l = R.label(c.r);
    return '<span class="ix ' + pos + '"><b>' + l + '</b>' + suit(c.s) + (c.r >= 11 ? emb(c.r) : '') + '</span>';
  }
  function cardHTML(c, o) {
    o = o || {};
    var cls = 'card' + (o.sel ? ' sel' : '') + (o.cls ? ' ' + o.cls : '');
    var data = ' data-id="' + c.id + '"' + (o.style ? ' style="' + o.style + '"' : '');
    if (c.back) return '<div class="card back ' + (o.cls || '') + '" aria-label="Carte cachée"><span class="bk">ii</span></div>';
    if (c.joker) {
      return '<div class="' + cls + ' joker"' + data + ' role="button" aria-label="Joker"><span class="ix tl jk">JOKER</span><span class="ix br jk r180">JOKER</span><svg class="fig" viewBox="0 0 100 120" aria-hidden="true">' + JOKER + '</svg></div>';
    }
    var mid = c.r >= 11 ? '<div class="mid face">' + fig(c.r) + '</div>' : '<div class="mid">' + suit(c.s) + '</div>';
    return '<div class="' + cls + ' s-' + c.s + ' r' + c.r + '"' + data + ' role="button" aria-label="' + R.nameOf(c) + '">' + corner('tl', c) + corner('tr', c) + corner('bl r180', c) + corner('br r180', c) + mid + '</div>';
  }
  R.CardView = { html: cardHTML, back: function (cls) { return cardHTML({ back: true }, { cls: cls }); }, suit: suit };
})(typeof window !== 'undefined' ? window : globalThis);
