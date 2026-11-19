# Android avec Capacitor (gratuit)
1. `npm init -y && npm i @capacitor/core @capacitor/cli @capacitor/android`
2. `npx cap init Rami com.exemple.rami --web-dir=.`
3. `npx cap add android` puis `npx cap sync`
4. Dans `android/app/src/main/AndroidManifest.xml` ajoute : CAMERA, RECORD_AUDIO, MODIFY_AUDIO_SETTINGS. Orientation : retire toute ligne `screenOrientation` (rotation libre).
5. `npx cap open android` → Android Studio → Build > Generate Signed Bundle.
Compte Google Play : 25 $ une seule fois (seul coût, à ta décision).
