import { DynamoDB } from 'aws-sdk';
import { dynamoTablesPrefix } from './environment';

export const getFullTableName = (modelName: string): string => `${dynamoTablesPrefix}.${modelName}`;

export const regionsTable: DynamoDB.Types.CreateTableInput = {
  TableName: getFullTableName('regions'),
  KeySchema: [{ AttributeName: 'code', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'code', AttributeType: 'S' }],
  BillingMode: 'PAY_PER_REQUEST',
};

export const cinemasTable: DynamoDB.Types.CreateTableInput = {
  TableName: getFullTableName('cinemas'),
  KeySchema: [
    { AttributeName: 'regionCode', KeyType: 'HASH' },
    { AttributeName: 'code', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'regionCode', AttributeType: 'S' },
    { AttributeName: 'code', AttributeType: 'S' },
  ],
  BillingMode: 'PAY_PER_REQUEST',
};

export const moviesTable: DynamoDB.Types.CreateTableInput = {
  TableName: getFullTableName('movies'),
  KeySchema: [
    { AttributeName: 'regionCode', KeyType: 'HASH' },
    { AttributeName: 'groupCode', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'regionCode', AttributeType: 'S' },
    { AttributeName: 'groupCode', AttributeType: 'S' },
  ],
  BillingMode: 'PAY_PER_REQUEST',
};

export const subscriptionsTable: DynamoDB.Types.CreateTableInput = {
  TableName: getFullTableName('subscriptions'),
  KeySchema: [
    { AttributeName: 'webPushSubscription', KeyType: 'HASH' },
    { AttributeName: 'uuid', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'webPushSubscription', AttributeType: 'S' },
    { AttributeName: 'uuid', AttributeType: 'S' },
  ],
  BillingMode: 'PAY_PER_REQUEST',
};
