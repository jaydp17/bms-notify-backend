import { getRegions } from '../../bookmyshow/api';
import { writeRegions } from '../../models/regions';
import { getLoggerInstance } from '../../utils/logger';

const logger = getLoggerInstance();

export const handler = async () => {
  try {
    const regions = await getRegions();
    await writeRegions(regions);
    logger.info('done!');
  } catch (error) {
    logger.error(error, 'error');
    return Promise.reject(error);
  }
};
