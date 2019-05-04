import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import _ from 'lodash';
import { dynamoClient, MAX_BATCH_WRITE_ITEMS } from '../dynamodb';
import { regionsTable } from '../tables';

export async function getRegion(regionCode: string): Promise<Region | undefined> {
  const params: DocumentClient.GetItemInput = {
    TableName: regionsTable.TableName,
    Key: { code: regionCode },
  };
  const result = await dynamoClient.get(params).promise();
  return result.Item as Region;
}

export async function writeRegions(regions: Region[]) {
  const chunks = _.chunk(regions, MAX_BATCH_WRITE_ITEMS);
  const promises = chunks
    .map(getChunkBatchWriteInput)
    .map(writeChunk => dynamoClient.batchWrite(writeChunk).promise());
  return Promise.all(promises);
}

function getChunkBatchWriteInput(regionChunk: Region[]) {
  const writeRequests: DocumentClient.WriteRequest[] = regionChunk.map(region => ({
    PutRequest: { Item: region },
  }));
  const params: DocumentClient.BatchWriteItemInput = {
    RequestItems: {
      [regionsTable.TableName]: writeRequests,
    },
  };
  return params;
}

export interface Region {
  code: string;
  name: string;
  isTopCity: boolean;
}
