import { DynamoDB } from 'aws-sdk';
import { dynamoTablesPrefix } from './environment';

const getFullTableName = (modelName: string): string => `${dynamoTablesPrefix}.${modelName}`;

export const regionsTableSpec: DynamoDB.Types.CreateTableInput = {
  TableName: getFullTableName('regions'),
  KeySchema: [{ AttributeName: 'code', KeyType: 'HASH' }],
  AttributeDefinitions: [{ AttributeName: 'code', AttributeType: 'S' }],
  BillingMode: 'PAY_PER_REQUEST',
};
