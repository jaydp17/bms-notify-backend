import { PushSubscription } from 'web-push';
import { getWebPush } from '../../webpush';

interface Event {
  arguments: {
    regionCode: string;
    cinemaCode: string;
    movieCode: string;
    subscription: PushSubscription;
  };
}

export const handler = async (event: Event) => {
  console.log('event', event);
  const payload = JSON.stringify({ title: 'Push test' });
  const { subscription } = event.arguments;
  const webpush = getWebPush();
  const result = await webpush.sendNotification(subscription, payload);
  console.log('result', result);
  return 'subscribed :)';
};
