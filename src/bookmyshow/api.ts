import axios, { AxiosRequestConfig } from 'axios';
import { Region } from '../models/regions';
import { BmsRegion, BmsRegionListResponse } from './types';

const userAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36';

export async function getRegions(): Promise<Region[]> {
  const axiosOptions: AxiosRequestConfig = {
    method: 'GET',
    url: `https://data-in.bookmyshow.com/`,
    params: {
      cmd: 'DEREGIONLIST',
      f: 'json',
      et: 'ALL',
      t: '67x1xa33b4x422b361ba',
      ch: 'mobile',
    },
    headers: {
      lang: 'en',
      'User-Agent': userAgent,
    },
  };
  const response: { data: BmsRegionListResponse } = await axios(axiosOptions);
  return [
    ...response.data.BookMyShow.TopCities.map(bmsRegion => mapToRegion(bmsRegion, true)),
    ...response.data.BookMyShow.OtherCities.map(bmsRegion => mapToRegion(bmsRegion, false)),
  ];
}

function mapToRegion(bmsRegion: BmsRegion, isTopCity: boolean): Region {
  return {
    code: bmsRegion.RegionCode,
    name: bmsRegion.RegionName,
    isTopCity,
  };
}
