import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import _ from 'lodash';
import { dynamoClient, MAX_BATCH_WRITE_ITEMS } from '../dynamodb';
import { cinemasTable } from '../tables';

export async function writeCinemas(cinemas: Cinema[]) {
  const chunks = _.chunk(cinemas, MAX_BATCH_WRITE_ITEMS);
  const promises = chunks
    .map(getChunkBatchWriteInput)
    .map(writeChunk => dynamoClient.batchWrite(writeChunk).promise());
  return Promise.all(promises);
}

function getChunkBatchWriteInput(cinemaChunk: Cinema[]) {
  const writeRequests: DocumentClient.WriteRequest[] = cinemaChunk.map(cinema => ({
    PutRequest: { Item: cinema },
  }));
  const params: DocumentClient.BatchWriteItemInput = {
    RequestItems: {
      [cinemasTable.TableName]: writeRequests,
    },
  };
  return params;
}

export interface Cinema {
  code: string;
  companyCode: string;
  name: string;
  address: string;
  regionCode: string;
}
