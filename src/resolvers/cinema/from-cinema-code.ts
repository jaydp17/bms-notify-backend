import { getCinema } from '../../models/cinemas';

interface Event {
  source: any; // this will be the parent document
  cinemaCode: string;
  regionCode: string;
}

export const handler = async (event: Event) => {
  const { cinemaCode, regionCode } = event;
  return getCinema({ cinemaCode, regionCode });
};
