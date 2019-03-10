import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import _ from 'lodash';
import { Region } from '../bookmyshow/api';
import dynamoClient from '../dynamodb';
import { regionsTable } from '../tables';

export async function writeRegions(regions: Region[]) {
  const chunks = _.chunk(regions, 25);
  const promises = chunks.map(getChunkBatchWriteInput).map(dynamoClient.batchWrite);
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
