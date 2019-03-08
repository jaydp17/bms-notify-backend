exports.handler = async event => {
  console.log('Received event {}', JSON.stringify(event, 3));

  return [{ name: 'blr' }];
};
