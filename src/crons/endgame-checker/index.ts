import _ from 'lodash';
import { getAvailableVenueCodes } from '../../bookmyshow/api';
import { getWebPush } from '../../webpush';

const regionCode = 'BANG';
const endgameEventCode3D = 'ET00106002';
const venuesOfChoice = [
  'CXBL', // spirit
  'PVBN', // forum mall, koramangala
];

export const handler = async () => {
  try {
    const availableVenueCodes = await getAvailableVenueCodes(
      endgameEventCode3D,
      regionCode,
      '20190705',
    );
    const venueIntersection = _.intersection(availableVenueCodes, venuesOfChoice);
    console.log('venueIntersection', venueIntersection);
    if (venueIntersection.length === 0) return;

    const pushSubscriptions = JSON.parse(process.env.PUSH_SUBSCRIPTIONS || '[]') as any[];
    const webpush = getWebPush();
    const notificationPayload = {
      title: 'Spider-Man: Far From Home 🎉',
      body: 'Available in your favorite cinemas',
    };
    await Promise.all(
      pushSubscriptions.map(pushSubscription =>
        webpush.sendNotification(pushSubscription, JSON.stringify(notificationPayload)),
      ),
    );
    console.log('done!', availableVenueCodes);
  } catch (error) {
    console.error('error', error);
    return Promise.reject(error);
  }
};
