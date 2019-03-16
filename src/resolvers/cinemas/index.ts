import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import _ from 'lodash';
import { getQuickBookInfo } from '../../bookmyshow/api';
import { dynamoClient, paginate } from '../../dynamodb';
import { getEpoch } from '../../helpers';
import { Cinema, writeCinemas } from '../../models/cinemas';
import { writeMovies } from '../../models/movies';
import { cinemasTable } from '../../tables';

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
  console.log('fetching from BMS');
  const { cinemas, movies } = await getQuickBookInfo(regionCode);
  await Promise.all([writeCinemas(cinemas), writeMovies(movies)]);
  return cinemas;
}
