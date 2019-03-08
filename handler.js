'use strict';

exports.graphql = (event, context, callback) => {
  console.log('Received event {}', JSON.stringify(event, 3));

  console.log('Got an Invoke Request.');
  switch (event.field) {
    case 'hello': {
      callback(null, 'world');
      break;
    }

    default: {
      callback(`Unknown field, unable to resolve ${event.field}`, null);
      break;
    }
  }
};
