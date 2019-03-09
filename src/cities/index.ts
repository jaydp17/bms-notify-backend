export const handler = async (event: any) => {
  console.log('Received event {}', __dirname, JSON.stringify(event, null, 4));

  return [{ name: 'blr' }];
};
