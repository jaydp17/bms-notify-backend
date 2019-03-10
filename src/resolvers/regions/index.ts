import { Region } from '../../bookmyshow/api';
import { dynamoClient } from '../../dynamodb';
import { regionsTable } from '../../tables';

export const handler = async (): Promise<Region[]> => {
  const scanOutput = await dynamoClient.scan({
    TableName: regionsTable.TableName,
  });
  return scanOutput.Items as Region[];
};
