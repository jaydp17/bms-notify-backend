import { DynamoDB } from 'aws-sdk';
import { dynamodb } from '../dynamodb';
import { prettyPrint } from '../helpers';
import { regionsTable } from '../tables';

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

async function main() {
  await createTable(regionsTable);
}

main()
  .then(() => console.log('done!'))
  .catch(err => console.error('error', err));
