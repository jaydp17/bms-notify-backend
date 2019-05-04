import { getRegion } from '../../models/regions';

interface Event {
  source: any; // this will be the parent document
  regionCode: string;
}

export const handler = async (event: Event) => {
  const { regionCode } = event;
  return getRegion(regionCode);
};
