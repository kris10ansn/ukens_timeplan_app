Write-Host "<------------ Ionic cordova build android --release ------------>"
ionic cordova build android --release

cd platforms/android
Write-Host "<------------------------ Gradlew bundle ------------------------>"
./gradlew.bat bundle
cd ../../

Write-Host "<-------------------------- Jarsigner -------------------------->"
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ukens-timeplan-key.keystore platforms/android/app/build/outputs/bundle/release/app.aab alias_name

Write-Host "<-------------------------- Zipalign  -------------------------->"
zipalign -v 4 ./platforms/android/app/build/outputs/bundle/release/app.aab ./build/$args".aab"
