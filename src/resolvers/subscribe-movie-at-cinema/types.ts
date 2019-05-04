import { PushSubscription } from 'web-push';

export interface Event {
  arguments: {
    regionCode: string;
    cinemaCode: string;
    movieCode: string;
    dateStr: string;
    webPushSubscription: PushSubscription;
  };
}
