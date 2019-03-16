import { AWSError, DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { Request } from 'aws-sdk/lib/request';
import { env, isDev } from './environment';

let dynamoDbOptions: DynamoDB.ClientConfiguration = { region: 'ap-south-1' };
if (env === 'development') {
  dynamoDbOptions = { ...dynamoDbOptions, endpoint: 'http://localhost:8000' };
}
console.log({ dynamoDbOptions });

export const dynamodb = new DynamoDB(dynamoDbOptions);
export const dynamoClient = new DynamoDB.DocumentClient(dynamoDbOptions);

export const MAX_BATCH_WRITE_ITEMS = 25;

export async function paginate<T>(
  request: Request<DocumentClient.ScanOutput, AWSError>,
): Promise<T[]> {
  const items: T[] = [];
  return new Promise((resolve, reject) => {
    request.eachPage((err, data) => {
      if (err) {
        reject(err);
      } else if (data) {
        if (data.Items) items.push(...(data.Items as T[]));
      } else {
        resolve(items);
      }
      return true;
    });
  });
}

export const QUICKBOOK_CACHE_MINUTES = isDev ? 360 : 20;
