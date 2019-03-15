import { dynamoClient } from '../../dynamodb';
import { Region } from '../../models/regions';
import { regionsTable } from '../../tables';

export const handler = async (): Promise<Region[]> => {
  const scanOutput = await dynamoClient.scan({
    TableName: regionsTable.TableName,
  });
  return scanOutput.Items as Region[];
};
