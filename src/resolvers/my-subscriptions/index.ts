import { PushSubscription } from 'web-push';
import { getSubscriptions } from '../../models/subscriptions';

interface Event {
  arguments: {
    webPushSubscription: PushSubscription;
  };
}
export const handler = async (event: Event) => {
  const { webPushSubscription } = event.arguments;
  const webPushSubscriptionStr = JSON.stringify(webPushSubscription);

  const mySubscriptions = await getSubscriptions(webPushSubscriptionStr);
  return mySubscriptions;
};
