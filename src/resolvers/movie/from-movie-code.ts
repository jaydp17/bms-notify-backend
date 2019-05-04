import { getMovie } from '../../models/movies';

interface Event {
  source: any; // this will be the parent document
  movieCode: string;
  regionCode: string;
}

export const handler = async (event: Event) => {
  const { movieCode, regionCode } = event;
  return getMovie({ movieCode, regionCode });
};
