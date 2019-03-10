import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { env } from './environment';

let dynamoDbOptions: DynamoDB.ClientConfiguration = { region: 'ap-south-1' };
if (env === 'development') {
  dynamoDbOptions = { ...dynamoDbOptions, endpoint: 'http://localhost:8000' };
}
console.log({ dynamoDbOptions });

export const dynamodb = new DynamoDB(dynamoDbOptions);
const dynamoDocClient = new DynamoDB.DocumentClient(dynamoDbOptions);

export default {
  get: (params: DocumentClient.GetItemInput) => dynamoDocClient.get(params).promise(),
  put: (params: DocumentClient.PutItemInput) => dynamoDocClient.put(params).promise(),
  query: (params: DocumentClient.QueryInput) => dynamoDocClient.query(params).promise(),
  delete: (params: DocumentClient.DeleteItemInput) => dynamoDocClient.delete(params).promise(),
  scan: (params: DocumentClient.ScanInput) => dynamoDocClient.scan(params).promise(),
  batchWrite: (params: DocumentClient.BatchWriteItemInput) =>
    dynamoDocClient.batchWrite(params).promise(),
};
