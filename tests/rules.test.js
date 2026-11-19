// Lancer : node tests/rules.test.js
global.window = undefined;
require('../www/js/cards.js'); require('../www/js/rules.js');
const R = globalThis.Rami; let ok = 0, ko = 0;
function t(name, cond) { if (cond) ok++; else { ko++; console.log('ECHEC :', name); } }
const c = (r, s, id) => ({ id: id || Math.random(), r, s }); const J = (id) => ({ id: id || Math.random(), r: 0, s: 'J', joker: true });
t('deck 108', R.makeDeck().length === 108);
t('deck 8 jokers? non : 4', R.makeDeck().filter(x => x.joker).length === 4);
t('tierce franche 3-4-5 coeur', !!R.arrangeRun([c(3,'H'),c(4,'H'),c(5,'H')]) && R.arrangeRun([c(3,'H'),c(4,'H'),c(5,'H')]).pure);
t('suite mixte refusée', !R.arrangeRun([c(3,'H'),c(4,'S'),c(5,'H')]));
t('suite avec joker non franche', R.arrangeRun([c(3,'H'),J(),c(5,'H')]).pure === false);
t('As bas A-2-3', !!R.arrangeRun([c(1,'D'),c(2,'D'),c(3,'D')]));
t('As haut Q-K-A', !!R.arrangeRun([c(12,'D'),c(13,'D'),c(1,'D')]));
t('pas de boucle K-A-2', !R.arrangeRun([c(13,'D'),c(1,'D'),c(2,'D')]));
t('brelan 9', !!R.arrangeSet([c(9,'S'),c(9,'H'),c(9,'D')]));
t('brelan même couleur refusé', !R.arrangeSet([c(9,'S'),c(9,'S'),c(9,'D')]));
t('carré + joker refusé (5)', !R.arrangeSet([c(9,'S'),c(9,'H'),c(9,'D'),c(9,'C'),J()]));
t('points A-2-3 = 6', R.meldPoints(R.arrangeRun([c(1,'D'),c(2,'D'),c(3,'D')])) === 6);
t('points Q-K-A = 31', R.meldPoints(R.arrangeRun([c(12,'D'),c(13,'D'),c(1,'D')])) === 31);
t('joker main 75', R.handValue(J()) === 75);
t('As main 11', R.handValue(c(1,'S')) === 11);
const m1 = R.arrangeRun([c(10,'H'),c(11,'H'),c(12,'H')]); const m2 = R.arrange([c(9,'S'),c(9,'H'),c(9,'D')]);
t('ouverture 30+27=57 ok', R.openingStatus([m1, m2]).ok);
t('ouverture sans franche refusée', !R.openingStatus([R.arrange([c(10,'H'),J(),c(12,'H')]), R.arrange([c(13,'S'),c(13,'H'),c(13,'D')]), R.arrange([c(12,'S'),c(12,'C'),c(12,'D')])]).ok);
t('attach 6 au 3-4-5', !!R.tryAttach(R.arrangeRun([c(3,'H'),c(4,'H'),c(5,'H')]), c(6,'H')));
t('attach mauvaise couleur refusé', !R.tryAttach(R.arrangeRun([c(3,'H'),c(4,'H'),c(5,'H')]), c(6,'S')));
console.log(ok + ' réussis, ' + ko + ' échecs'); process.exit(ko ? 1 : 0);
