import { addSubscription } from '../../models/subscriptions';
import { Event } from './types';
import { validateRequest } from './validations';

export const handler = async (event: Event) => {
  try {
    console.log('event', event);
    validateRequest(event);
    // const payload = JSON.stringify({ title: 'Push test' });
    // const webpush = getWebPush();
    // const result = await webpush.sendNotification(subscription, payload);
    const subscriptionParams = event.arguments;
    const subscription = await addSubscription(subscriptionParams);
    return subscription;
  } catch (error) {
    console.error(error);
    throw error.message;
  }
};
