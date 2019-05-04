import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import _ from 'lodash';
import { getComingSoonMovies, getQuickBookInfo } from '../../bookmyshow/api';
import { dynamoClient, paginate } from '../../dynamodb';
import { Cinema, writeCinemas } from '../../models/cinemas';
import { writeMovies } from '../../models/movies';
import { cinemasTable } from '../../tables';
import { getEpoch } from '../../utils/helpers';
import { getLoggerInstance } from '../../utils/logger';

const logger = getLoggerInstance();

interface Event {
  arguments: {
    regionCode: string;
  };
}
export const handler = async (event: Event): Promise<Cinema[]> => {
  const { regionCode } = event.arguments;
  const cinemasFromDb = await getCinemasFromDb(regionCode);
  if (!_.isEmpty(cinemasFromDb)) {
    return cinemasFromDb;
  }
  const cinemasFromBMS = await getCinemasFromBMS(regionCode);
  return cinemasFromBMS;
};

async function getCinemasFromDb(regionCode: string) {
  const currentEpoch = getEpoch(new Date());
  const params: DocumentClient.QueryInput = {
    TableName: cinemasTable.TableName,
    KeyConditionExpression: '#regionCode = :region',
    ExpressionAttributeNames: {
      '#regionCode': 'regionCode',
      '#ttl': 'ttl',
    },
    ExpressionAttributeValues: {
      ':region': regionCode,
      ':ttl': currentEpoch,
    },
    FilterExpression: '#ttl > :ttl',
  };
  // Note: we're manually filtering out the expired items
  // because DynamoDB takes up to 48 hours to remove expired items
  const cinemas = await paginate<Cinema>(dynamoClient.query(params));
  return cinemas;
}

async function getCinemasFromBMS(regionCode: string) {
  logger.info('fetching from BMS');
  const [{ cinemas, movies }, comingSoonMovies] = await Promise.all([
    getQuickBookInfo(regionCode),
    getComingSoonMovies(regionCode),
  ]);
  await Promise.all([writeCinemas(cinemas), writeMovies([...movies, ...comingSoonMovies])]);
  return cinemas;
}
