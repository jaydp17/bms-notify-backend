import webpush from 'web-push';

const vapidPublicKey =
  'BOGGgGGFu6Vtq_w_2JRqFak_3-JjtdG02lco32frBCMjat7Vg-SkGjJz5EeM3KMTxE5lC9HzYOxEu_3o4zC6xYs';

export function getWebPush() {
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  if (!vapidPrivateKey) {
    console.log('env var VAPID_PRIVATE_KEY not passed');
    throw new Error('env var VAPID_PRIVATE_KEY not passed');
  }
  webpush.setVapidDetails('https://bms-notify.jaydp.com', vapidPublicKey, vapidPrivateKey);
  return webpush;
}
