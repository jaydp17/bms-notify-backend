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
  'BCsVNqXbivH1MD3Sa2rRWqTyr-cmPG0cHfWni9cpY5lwDaVH41e5Om01yf9fsQVXVq8Y4Xe2nvwmDB6CWJsI8vY';
const vapidPrivateKey = '0pGJgwPyv2wA1-vwTv3aAOP9PkrD3UFvfkQnqhr5ldo';

webpush.setVapidDetails('https://bms-notify.jaydp.com', vapidPublicKey, vapidPrivateKey);

export const handler = async (event: Event) => {
  console.log('event', event);
  const payload = JSON.stringify({ title: 'Push test' });
  const { subscription } = event.arguments;
  const result = await webpush.sendNotification(subscription, payload);
  console.log('result', result);
  return 'subscribed :)';
};
