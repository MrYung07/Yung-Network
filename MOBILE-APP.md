# Yung Network — app Android e iOS

Il progetto riutilizza il sito in `YungNetworksitoWeb/` con Capacitor. Il sito web e il pannello admin restano separati dagli shell nativi.

## Requisiti

- Node.js 22 o successivo
- Android Studio + Android SDK per Android
- macOS + Xcode per compilare e firmare iOS
- Account Firebase per configurare FCM; configurazione APNs per notifiche iOS

## Avvio locale

```bash
npm install
npm run dev
```

Build del sito e sincronizzazione con i progetti nativi:

```bash
npm run cap:sync
npx cap add android
npx cap add ios
npx cap open android
npx cap open ios
```

Esegui `npx cap add android` e `npx cap add ios` una sola volta, quando i relativi progetti non esistono. iOS richiede un Mac con Xcode. Dopo modifiche al sito, usa `npm run cap:sync`.

## Funzioni previste

- News: usa le news pubblicate in Supabase già lette dal sito.
- Discord: invito community già presente nel sito.
- Staff e social: dati Supabase esistenti.
- Push: `YungNetworksitoWeb/push.js` avvia la richiesta di permesso e registra il dispositivo nativo.

## Push: configurazione ancora necessaria

Il file push è uno starter client, non un sistema push completo. Prima del rilascio:

1. Configura Firebase Cloud Messaging e aggiungi il file Android `google-services.json` al progetto Android generato.
2. Configura APNs/Firebase e la capability Push Notifications in Xcode per iOS.
3. Salva i token dispositivo in Supabase tramite una Edge Function autenticata e policy RLS restrittive. Non rendere i token leggibili pubblicamente.
4. Invia notifiche da una Edge Function con credenziali FCM conservate nei Supabase secrets; mai inserire credenziali server nel codice client o nel repository.
5. Collega la pubblicazione di una news a una notifica lato server, evitando notifiche duplicate per ogni modifica.
6. Implementa e verifica l'apertura della news corretta quando l'utente tocca la notifica.

Non committare chiavi Firebase private, certificati, file di provisioning o segreti.

## Verifiche prima della pubblicazione

- Verifica che la chiave Supabase client sia solo publishable/anon e che le policy RLS siano corrette.
- Prova home, news, modal, staff, social, Discord e pannello admin su dispositivo.
- Prova notifiche su dispositivi reali Android e iOS, anche con app in background.
- Controlla la grafica su schermi piccoli e l'accessibilità.
- La generazione dei progetti nativi e la pubblicazione negli store richiedono passaggi locali e credenziali dello sviluppatore; non sono completate dal solo commit GitHub.
