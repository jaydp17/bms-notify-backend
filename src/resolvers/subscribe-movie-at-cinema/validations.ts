import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import isFuture from 'date-fns/is_future';
import { PushSubscription } from 'web-push';
import { isYYYYMMDD } from '../../helpers';
import { Event } from './types';

export function validateRequest(event: Event) {
  const { dateStr } = event.arguments;
  if (!isYYYYMMDD(dateStr)) {
    throw new Error('dateStr has to be in YYYY-MM-DD format');
  }
  if (!isFuture(dateStr)) {
    throw new Error('dateStr has to be in the future');
  }

  const now = new Date();
  const diffDays = differenceInCalendarDays(dateStr, now);
  console.log('diffDays', diffDays);
  if (diffDays > 15) {
    throw new Error("you can't subscribe for a show more then 2 weeks in future");
  }

  validateWebPushObject(event.arguments.webPushSubscription);
}

function validateWebPushObject(webPushSubscription: PushSubscription) {
  if (!webPushSubscription || !webPushSubscription.endpoint) {
    throw new Error('You must pass in a subscription with at least an endpoint.');
  }

  if (
    typeof webPushSubscription.endpoint !== 'string' ||
    webPushSubscription.endpoint.length === 0
  ) {
    throw new Error('The subscription endpoint must be a string with a valid URL.');
  }

  // Validate the subscription keys
  if (
    !webPushSubscription.keys ||
    !webPushSubscription.keys.p256dh ||
    !webPushSubscription.keys.auth
  ) {
    throw new Error(
      "To send a message with a payload, the subscription must have 'auth' and 'p256dh' keys.",
    );
  }
}
