import { clientSettings, IRemoteConfig, postAPI } from '@magicbell/react-headless';
import isEmpty from 'lodash/isEmpty';
import path from 'ramda/src/path';

function stringToUint8Array(plainString: string) {
  const padding = '='.repeat((4 - (plainString.length % 4)) % 4);
  const base64 = (plainString + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * Store a subscription in the backend so we can notify this user later.
 *
 * @param subscription The push subscription
 */
function storeSubscription(subscription) {
  const { userEmail, userExternalId, userKey, apiKey } = clientSettings.getState();

  const headers = { 'X-MAGICBELL-API-KEY': apiKey };
  if (!isEmpty(userEmail)) headers['X-MAGICBELL-USER-EMAIL'] = userEmail;
  if (!isEmpty(userExternalId)) headers['X-MAGICBELL-USER-EXTERNAL-ID'] = userExternalId;
  if (!isEmpty(userKey)) headers['X-MAGICBELL-USER-HMAC'] = userKey;

  const data = {
    web_push_subscription: {
      data: subscription,
    },
  };

  return postAPI('/web_push_subscriptions', data, { headers });
}

/**
 * Request permission to send push notifications.
 *
 * @param pushManager
 * @param publicKey VAPID public key
 */
export function subscribeToPushNotifications(pushManager: PushManager, publicKey: string) {
  const applicationServerKey = stringToUint8Array(publicKey);
  return pushManager.subscribe({ userVisibleOnly: true, applicationServerKey });
}

/**
 * Request permission to send push notifications and store the subscription in
 * the backend.
 *
 * @param pushManager
 * @param user
 * @param project
 */
export async function createPushSubscription(pushManager: PushManager, config: IRemoteConfig) {
  const vapidPublicKey = path(
    ['webPush', 'config', 'vapidAuthentication', 'publicKey'],
    config.channels,
  );
  const subscription = await subscribeToPushNotifications(pushManager, vapidPublicKey);

  return storeSubscription(subscription.toJSON());
}

/**
 * Request permission to send push notifications in Safari and store the
 * subscription in the backend.
 *
 * @param user
 * @param websitePushID Apple identifier of the website push service
 */
export function createSafariPushSubscription(websitePushID = 'web.com.magicbell-notifications') {
  const { userEmail, userExternalId, userKey } = clientSettings.getState();
  const user = {
    email: userEmail,
    externalId: userExternalId,
    hmacSecret: userKey,
  };

  const permissionData = window['safari'].pushNotification.permission(websitePushID);
  if (permissionData.permission === 'granted') return Promise.resolve();
  if (permissionData.permission === 'denied') return Promise.reject();

  return new Promise(function (resolve, reject) {
    const webServiceURL = `${window.location.origin}/safari/push`;

    window['safari'].pushNotification.requestPermission(
      webServiceURL,
      websitePushID,
      user,
      function (permissionData) {
        console.log(permissionData);

        if (permissionData.deviceToken) {
          const subscriptionData = {
            endpoint: permissionData.deviceToken,
            keys: { websitePushID },
            platform: 'safari',
          };

          storeSubscription(subscriptionData)
            .then((subscription) => {
              resolve(subscription);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          const error = new Error('Permission was denied');
          reject(error);
        }
      },
    );
  });
}
