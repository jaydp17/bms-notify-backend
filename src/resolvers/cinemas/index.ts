import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import _ from 'lodash';
import { getQuickBookInfo } from '../../bookmyshow/api';
import { dynamoClient, paginate } from '../../dynamodb';
import { Cinema, writeCinemas } from '../../models/cinemas';
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
  const params: DocumentClient.QueryInput = {
    TableName: cinemasTable.TableName,
    KeyConditionExpression: 'regionCode = :region',
    ExpressionAttributeValues: {
      ':region': regionCode,
    },
  };
  const cinemas = await paginate<Cinema>(dynamoClient.query(params));
  return cinemas;
}

async function getCinemasFromBMS(regionCode: string) {
  // TODO: store movies as well along with TTL
  const { cinemas, movies } = await getQuickBookInfo(regionCode);
  await writeCinemas(cinemas);
  return cinemas;
}
