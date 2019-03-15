import axios, { AxiosRequestConfig } from 'axios';
import { Cinema } from '../models/cinemas';
import { Movie } from '../models/movies';
import { Region } from '../models/regions';
import {
  BmsQuickBookCinema,
  BmsQuickBookMovie,
  BmsQuickBookResponse,
  BmsRegion,
  BmsRegionListResponse,
} from './types';

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

export async function getQuickBookInfo(cityCode: string) {
  const axiosOptions: AxiosRequestConfig = {
    method: 'GET',
    url: `https://in.bookmyshow.com/serv/getData`,
    params: {
      cmd: 'QUICKBOOK',
      type: 'MT',
      getRecommendedData: '1',
    },
    headers: {
      'User-Agent': userAgent,
      Cookie: `Rgn=|Code=${cityCode}|`,
    },
  };
  const response: { data: BmsQuickBookResponse } = await axios(axiosOptions);
  const cinemas = response.data.cinemas.BookMyShow.aiVN.map(mapToCinema);
  const movies = response.data.moviesData.BookMyShow.arrEvents.map(mapToMovie);
  return { cinemas, movies };
}

function mapToRegion(bmsRegion: BmsRegion, isTopCity: boolean): Region {
  return {
    code: bmsRegion.RegionCode,
    name: bmsRegion.RegionName,
    isTopCity,
  };
}

function mapToCinema(cinema: BmsQuickBookCinema): Cinema {
  return {
    code: cinema.VenueCode,
    companyCode: cinema.CompanyCode,
    name: cinema.VenueName,
    address: cinema.VenueAddress,
    regionCode: cinema.VenueSubRegionCode,
  };
}

function mapToMovie(movie: BmsQuickBookMovie): Movie {
  return {
    code: movie.EventCode,
    groupCode: movie.EventGroup,
    name: movie.EventTitle,
    slug: movie.EventURLTitle,
    avgRating: movie.avgRating,
    totalVotes: movie.totalVotes,
  };
}
