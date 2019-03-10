import { getRegions } from '../../bookmyshow/api';
import { writeRegions } from '../../models/regions';

export const handler = async () => {
  try {
    const regions = await getRegions();
    await writeRegions(regions);
    console.log('done!');
  } catch (error) {
    console.error('error', error);
    return Promise.reject(error);
  }
};
