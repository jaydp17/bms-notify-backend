import { getRegions, Region } from 'src/bookmyshow/api';

export const handler = async (event: any): Promise<Region[]> => {
  console.log('Received event {}', __dirname, JSON.stringify(event, null, 4));

  return getRegions();
};
