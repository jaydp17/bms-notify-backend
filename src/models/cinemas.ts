import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import _ from 'lodash';
import { dynamoClient, MAX_BATCH_WRITE_ITEMS } from '../dynamodb';
import { cinemasTable } from '../tables';

interface GetCinemaInput {
  regionCode: string;
  cinemaCode: string;
}
export async function getCinema({
  regionCode,
  cinemaCode,
}: GetCinemaInput): Promise<Cinema | undefined> {
  const params: DocumentClient.GetItemInput = {
    TableName: cinemasTable.TableName,
    Key: { regionCode, code: cinemaCode },
  };
  const result = await dynamoClient.get(params).promise();
  // TODO: re-fetch cinemas when it's db cache has expired
  return result.Item as Cinema;
}

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
  ttl: number;
}
