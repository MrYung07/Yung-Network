import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

/**
 * Registers native devices for push notifications.
 * Sending notifications and securely storing tokens require a backend setup;
 * never put FCM service-account credentials in this client-side file.
 */
async function setupPushNotifications() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    let permission = await PushNotifications.checkPermissions();

    if (permission.receive !== 'granted') {
      permission = await PushNotifications.requestPermissions();
    }

    if (permission.receive !== 'granted') return;

    await PushNotifications.addListener('registration', ({ value }) => {
      window.dispatchEvent(new CustomEvent('yung-push-token', {
        detail: { token: value, platform: Capacitor.getPlatform() }
      }));
    });

    await PushNotifications.addListener('registrationError', error => {
      console.error('Registrazione push non riuscita', error);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', event => {
      const url = event.notification.data?.url;
      if (typeof url === 'string' && url.startsWith('/')) {
        window.location.href = url;
      }
    });

    await PushNotifications.register();
  } catch (error) {
    console.error('Configurazione push non riuscita', error);
  }
}

setupPushNotifications();
