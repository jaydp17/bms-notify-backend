import { DynamoDB } from 'aws-sdk';
import { dynamodb } from '../dynamodb';
import { prettyPrint } from '../helpers';
import { cinemasTable, regionsTable, moviesTable } from '../tables';

async function createTable(tableSchema: DynamoDB.Types.CreateTableInput) {
  try {
    prettyPrint(tableSchema);
    const result = await dynamodb.createTable(tableSchema).promise();
    prettyPrint(result);
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
  const tables = [regionsTable, cinemasTable, moviesTable];
  await Promise.all(tables.map(createTable));

  await addTTL2Table(cinemasTable.TableName);
  await addTTL2Table(moviesTable.TableName);
}

main()
  .then(() => console.log('done!'))
  .catch(err => console.error('error', err));
