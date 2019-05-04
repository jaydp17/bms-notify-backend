import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import _ from 'lodash';
import { dynamoClient, MAX_BATCH_WRITE_ITEMS } from '../dynamodb';
import { moviesTable } from '../tables';

interface GetMovieInput {
  movieCode: string;
  regionCode: string;
}
export async function getMovie({
  movieCode,
  regionCode,
}: GetMovieInput): Promise<Movie | undefined> {
  const params: DocumentClient.GetItemInput = {
    TableName: moviesTable.TableName,
    Key: { groupCode: movieCode, regionCode },
  };
  const result = await dynamoClient.get(params).promise();
  // TODO: re-fetch movies when it's db cache has expired
  return result.Item as Movie;
}

export async function writeMovies(movies: Movie[]) {
  const chunks = _.chunk(movies, MAX_BATCH_WRITE_ITEMS);
  const promises = chunks
    .map(getChunkBatchWriteInput)
    .map(writeChunk => dynamoClient.batchWrite(writeChunk).promise());
  return Promise.all(promises);
}

function getChunkBatchWriteInput(movieChunk: Movie[]) {
  const writeRequests: DocumentClient.WriteRequest[] = movieChunk.map(movie => ({
    PutRequest: { Item: movie },
  }));
  const params: DocumentClient.BatchWriteItemInput = {
    RequestItems: {
      [moviesTable.TableName]: writeRequests,
    },
  };
  return params;
}

export interface Movie {
  regionCode: string;
  code: string;
  groupCode: string;
  name: string;
  slug: string;
  avgRating: number;
  totalVotes: number;
  ttl: number;
}
