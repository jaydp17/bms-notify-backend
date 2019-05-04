import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import _ from 'lodash';
import { getQuickBookInfo, getComingSoonMovies } from '../../bookmyshow/api';
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
  const [{ cinemas, movies }, comingSoonMovies] = await Promise.all([
    getQuickBookInfo(regionCode),
    getComingSoonMovies(regionCode),
  ]);
  await Promise.all([writeCinemas(cinemas), writeMovies([...movies, ...comingSoonMovies])]);
  return movies;
}
