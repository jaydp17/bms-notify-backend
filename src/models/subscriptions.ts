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
    TableName: subscriptionsTable.TableName,
    Item: subscription,
  };
  await dynamoClient.put(params).promise();
  return subscription;
}

export async function getSubscriptions(webPushSubscriptionStr: string) {
  const params: DocumentClient.QueryInput = {
    TableName: subscriptionsTable.TableName,
    KeyConditionExpression: 'webPushSubscription = :hkey',
    ExpressionAttributeValues: {
      ':hkey': webPushSubscriptionStr,
    },
  };
  const queryResult = await dynamoClient.query(params).promise();
  if (!queryResult.Items) return [];
  return queryResult.Items as Subscription[];
}

export interface Subscription {
  webPushSubscription: string; // HASH
  uuid: string; // RANGE
  regionCode: string;
  cinemaCode: string;
  movieCode: string;
  dateStr: string;
}
