import webpush, { PushSubscription } from 'web-push';

interface Event {
  arguments: {
    regionCode: string;
    cinemaCode: string;
    movieCode: string;
    subscription: PushSubscription;
  };
}

const vapidPublicKey =
  'BOGGgGGFu6Vtq_w_2JRqFak_3-JjtdG02lco32frBCMjat7Vg-SkGjJz5EeM3KMTxE5lC9HzYOxEu_3o4zC6xYs';

export const handler = async (event: Event) => {
  console.log('event', event);
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  if (!vapidPrivateKey) {
    console.log('env var VAPID_PRIVATE_KEY not passed');
    throw new Error('env var VAPID_PRIVATE_KEY not passed');
  }
  webpush.setVapidDetails('https://bms-notify.jaydp.com', vapidPublicKey, vapidPrivateKey);

  const payload = JSON.stringify({ title: 'Push test' });
  const { subscription } = event.arguments;
  const result = await webpush.sendNotification(subscription, payload);
  console.log('result', result);
  return 'subscribed :)';
};
