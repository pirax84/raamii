/* Prépare les fichiers avant la fabrication de l'APK :
   1) copie la bibliothèque Supabase dans www/js/vendor (l'appli marche ainsi sans internet pour se charger)
   2) écrit www/js/config.js avec l'adresse et la clé publique Supabase si elles sont fournies
      (variables SUPABASE_URL et SUPABASE_ANON_KEY, par exemple depuis les « secrets » GitHub). */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
fs.mkdirSync(path.join(root, 'www/js/vendor'), { recursive: true });
fs.copyFileSync(path.join(root, 'node_modules/@supabase/supabase-js/dist/umd/supabase.js'), path.join(root, 'www/js/vendor/supabase.js'));
const url = process.env.SUPABASE_URL || '', key = process.env.SUPABASE_ANON_KEY || '';
const cfgPath = path.join(root, 'www/js/config.js');
if (url && key) {
  fs.writeFileSync(cfgPath, "/* Écrit automatiquement par scripts/vendor.js */\nwindow.RAAMII_CLOUD = { url: " + JSON.stringify(url) + ", anonKey: " + JSON.stringify(key) + " };\n");
  console.log('config.js : Supabase branché sur ' + url);
} else if (!fs.existsSync(cfgPath)) {
  fs.writeFileSync(cfgPath, "/* Mets ici l'adresse et la clé publique (anon) de ton projet Supabase. Vide = jeu hors ligne seulement. */\nwindow.RAAMII_CLOUD = { url: '', anonKey: '' };\n");
  console.log('config.js : vide (jeu hors ligne)');
} else console.log('config.js : inchangé');
