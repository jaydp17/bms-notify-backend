import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import _ from 'lodash';
import { getQuickBookInfo } from '../../bookmyshow/api';
import { dynamoClient, paginate } from '../../dynamodb';
import { writeCinemas } from '../../models/cinemas';
import { Movie, writeMovies } from '../../models/movies';
import { moviesTable } from '../../tables';

interface Event {
  arguments: {
    regionCode: string;
  };
}
export const handler = async (event: Event): Promise<Movie[]> => {
  const { regionCode } = event.arguments;
  const moviesFromDb = await getMoviesFromDb(regionCode);
  if (!_.isEmpty(moviesFromDb)) {
    return moviesFromDb;
  }
  const moviesFromBMS = await getMoviesFromBMS(regionCode);
  return moviesFromBMS;
};

async function getMoviesFromDb(regionCode: string) {
  const params: DocumentClient.QueryInput = {
    TableName: moviesTable.TableName,
    KeyConditionExpression: 'regionCode = :region',
    ExpressionAttributeValues: {
      ':region': regionCode,
    },
  };
  const movies = await paginate<Movie>(dynamoClient.query(params));
  return movies;
}

async function getMoviesFromBMS(regionCode: string) {
  // TODO: store movies as well along with TTL
  const { cinemas, movies } = await getQuickBookInfo(regionCode);
  await Promise.all([writeCinemas(cinemas), writeMovies(movies)]);
  return movies;
}
