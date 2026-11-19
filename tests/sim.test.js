// Simule des parties complètes entre 6 IA pour vérifier que le moteur ne bloque jamais.
global.window = undefined;
['cards', 'rules', 'ai', 'game'].forEach(f => require('../www/js/' + f + '.js'));
const R = globalThis.Rami; let games = +process.argv[2] || 20, stuck = 0, secs = 0, rounds = 0, rb = 0, totalTurns = 0;
for (let g = 0; g < games; g++) {
  const levels = ['easy', 'medium', 'hard', 'hard', 'medium', 'easy'];
  const game = new R.Game({ players: levels.map((l, i) => ({ name: 'P' + i, level: l })), rounds: 3, rng: R.mulberry32(1000 + g) });
  game.on((t) => { if (t === 'rollback') rb++; if (t === 'roundEnd') { rounds++; } });
  game.startRound();
  let guard = 0;
  while (!game.ended) {
    if (game.over) { if (game.sec) secs++; game.nextRound(); continue; }
    if (++guard > 5000) { stuck++; console.log('BLOQUÉ partie', g, 'tour', game.turn, game.phase); break; }
    const p = game.cur(); R.AI.step(game, p); totalTurns++;
    const cards = game.P.reduce((a, q) => a + q.hand.length, 0) + game.stock.length + game.discard.length + (game.reserve ? 1 : 0) + game.melds.reduce((a, m) => a + m.cards.length, 0);
    if (cards !== 108) { console.log('CARTES PERDUES', cards); process.exit(1); }
  }
}
console.log(`${games} parties, ${rounds} manches, ${secs} fins sec, ${rb} annulations, ${stuck} blocages, ${totalTurns} actions`);
process.exit(stuck ? 1 : 0);
