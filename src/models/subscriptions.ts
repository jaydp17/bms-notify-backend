import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import uuidv4 from 'uuid/v4';
import { PushSubscription } from 'web-push';
import { dynamoClient } from '../dynamodb';
import { subscriptionsTable } from '../tables';

interface AddSubscriptionInput {
  regionCode: string;
  cinemaCode: string;
  movieCode: string;
  dateStr: string;
  webPushSubscription: PushSubscription;
}
export async function addSubscription(subscriptionRawData: AddSubscriptionInput) {
  const uuid = uuidv4();
  const subscription: Subscription = {
    ...subscriptionRawData,
    webPushSubscription: JSON.stringify(subscriptionRawData.webPushSubscription),
    uuid,
  };
  const params: DocumentClient.PutItemInput = {
    Item: subscription,
    TableName: subscriptionsTable.TableName,
  };
  await dynamoClient.put(params).promise();
  return subscription;
}

export interface Subscription {
  webPushSubscription: string; // HASH
  uuid: string; // RANGE
  regionCode: string;
  cinemaCode: string;
  movieCode: string;
  dateStr: string;
}
