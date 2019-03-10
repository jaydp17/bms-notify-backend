import { DynamoDB } from 'aws-sdk';
import { dynamoTablesPrefix } from './environment';

export const getFullTableName = (modelName: string): string => `${dynamoTablesPrefix}.${modelName}`;

export const regionsTable: DynamoDB.Types.CreateTableInput = {
  TableName: getFullTableName('regions'),
  KeySchema: [{ AttributeName: 'code', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'code', AttributeType: 'S' }],
  BillingMode: 'PAY_PER_REQUEST',
};
