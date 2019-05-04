import { dynamoClient, paginate } from '../../dynamodb';
import { Region } from '../../models/regions';
import { regionsTable } from '../../tables';

export const handler = async (): Promise<Region[]> => {
  const scanRequest = dynamoClient.scan({ TableName: regionsTable.TableName });
  const regions = await paginate<Region>(scanRequest);
  return regions;
};
