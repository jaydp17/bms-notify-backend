import { DynamoDB } from 'aws-sdk';
import { dynamodb } from '../dynamodb';
import { cinemasTable, moviesTable, regionsTable, subscriptionsTable } from '../tables';
import { getLoggerInstance } from '../utils/logger';

const logger = getLoggerInstance();

async function createTable(tableSchema: DynamoDB.Types.CreateTableInput) {
  try {
    logger.info(tableSchema, 'table schema');
    const result = await dynamodb.createTable(tableSchema).promise();
    logger.info(result, 'result');
  } catch (err) {
    console.error(err);
    if (err.code !== 'ResourceInUseException') {
      throw err;
    }
  }
}

/**
 * Makes a table remove rows after the TTL is expired
 */
async function addTTL2Table(tableName: string, attributeName: string = 'ttl') {
  const params = {
    TableName: tableName,
    TimeToLiveSpecification: {
      AttributeName: attributeName,
      Enabled: true,
    },
  };
  try {
    await dynamodb.updateTimeToLive(params).promise();
  } catch (err) {
    if (err.message !== 'TimeToLive is already enabled') throw err;
  }
}

async function main() {
  const tables = [regionsTable, cinemasTable, moviesTable, subscriptionsTable];
  await Promise.all(tables.map(createTable));

  await addTTL2Table(cinemasTable.TableName);
  await addTTL2Table(moviesTable.TableName);
}

main()
  .then(() => logger.info('done!'))
  .catch(err => logger.error(err, 'error'));
