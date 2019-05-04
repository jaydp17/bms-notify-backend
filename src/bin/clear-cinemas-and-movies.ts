import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { dynamoClient, paginate } from '../dynamodb';
import { Cinema } from '../models/cinemas';
import { Movie } from '../models/movies';
import { cinemasTable, moviesTable } from '../tables';
import { getLoggerInstance } from '../utils/logger';

const logger = getLoggerInstance();

async function main() {
  await clearMovies();
  await clearCinemas();
}

async function clearMovies() {
  const scanRequest = dynamoClient.scan({ TableName: moviesTable.TableName });
  const movies = await paginate<Movie>(scanRequest);
  const promises = movies.map(movie => {
    const deleteParams: DocumentClient.DeleteItemInput = {
      TableName: moviesTable.TableName,
      Key: {
        regionCode: movie.regionCode,
        groupCode: movie.groupCode,
      },
    };
    return dynamoClient.delete(deleteParams).promise();
  });
  await Promise.all(promises);
}

async function clearCinemas() {
  const scanRequest = dynamoClient.scan({ TableName: cinemasTable.TableName });
  const cinemas = await paginate<Cinema>(scanRequest);
  const promises = cinemas.map(cinema => {
    const deleteParams: DocumentClient.DeleteItemInput = {
      TableName: cinemasTable.TableName,
      Key: {
        regionCode: cinema.regionCode,
        code: cinema.code,
      },
    };
    return dynamoClient.delete(deleteParams).promise();
  });
  await Promise.all(promises);
}

main()
  .then(() => logger.info('done!'))
  .catch(err => logger.error(err, 'error'));
