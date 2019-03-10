import { DynamoDB } from 'aws-sdk';
import { dynamodb } from '../dynamodb';
import { prettyPrint } from '../helpers';
import { regionsTableSpec } from '../tables';

async function createTable(tableSchema: DynamoDB.Types.CreateTableInput) {
  try {
    const result = await dynamodb.createTable(tableSchema).promise();
    prettyPrint(result);
  } catch (err) {
    if (err.code !== 'ResourceInUseException') {
      throw err;
    }
  }
}

async function main() {
  await createTable(regionsTableSpec);
}

main()
  .then(() => console.log('done!'))
  .catch(err => console.error('error', err));
