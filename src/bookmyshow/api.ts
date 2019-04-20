import axios, { AxiosRequestConfig } from 'axios';
import addMinutes from 'date-fns/add_minutes';
import { COMING_SOON_CACHE_MINUTES, QUICKBOOK_CACHE_MINUTES } from '../dynamodb';
import { getEpoch } from '../helpers';
import { Cinema } from '../models/cinemas';
import { Movie } from '../models/movies';
import { Region } from '../models/regions';
import {
  BmsComingSoonMovie,
  BmsComingSoonResposne,
  BmsQuickBookCinema,
  BmsQuickBookMovie,
  BmsQuickBookResponse,
  BmsRegion,
  BmsRegionListResponse,
  BmsShowTimesResponse,
} from './types';

const userAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36';
const okhttpUserAgent = 'okhttp/3.11.0';
const token = '67x1xa33b4x422b361ba';

export async function getRegions(): Promise<Region[]> {
  const axiosOptions: AxiosRequestConfig = {
    method: 'GET',
    url: `https://data-in.bookmyshow.com/`,
    params: {
      cmd: 'DEREGIONLIST',
      f: 'json',
      et: 'ALL',
      t: token,
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

export async function getQuickBookInfo(regionCode: string) {
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
      Cookie: `Rgn=|Code=${regionCode}|`,
    },
  };
  const response: { data: BmsQuickBookResponse } = await axios(axiosOptions);
  const ttl = getEpoch(addMinutes(new Date(), QUICKBOOK_CACHE_MINUTES));
  const cinemas = response.data.cinemas.BookMyShow.aiVN.map(cinema => mapToCinema(cinema, ttl));
  const movies = response.data.moviesData.BookMyShow.arrEvents.map(movie =>
    mapToMovie(movie, regionCode, ttl),
  );
  return { cinemas, movies };
}

export async function getComingSoonMovies(regionCode: string) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now
    .getMonth()
    .toString()
    .padStart(2, '0');
  const axiosOptions: AxiosRequestConfig = {
    method: 'GET',
    url: 'https://data-in.bookmyshow.com',
    params: {
      cmd: 'COMINGSOON',
      rc: regionCode,
      t: token,
      pg: 1,
      cnt: 1000,
      yy: year,
      mm: month,
      f: 'json',
      ch: 'mobile',
    },
    headers: { 'User-Agent': userAgent },
  };
  const response: { data: BmsComingSoonResposne } = await axios(axiosOptions);
  const ttl = getEpoch(addMinutes(new Date(), COMING_SOON_CACHE_MINUTES));
  const movies = response.data.BookMyShow.Events.map(movie =>
    mapToMovieComingSoon(movie, regionCode, ttl),
  );
  return movies;
}

/**
 *
 * @param dateStr - eg '20190426'
 */
export async function getAvailableVenueCodes(
  childEventCode: string,
  regionCode: string,
  dateStr: string,
) {
  const axiosOptions: AxiosRequestConfig = {
    method: 'GET',
    url: 'https://in.bookmyshow.com/api/v2/mobile/showtimes/byevent',
    params: {
      regionCode,
      eventCode: childEventCode,
      token,
      bmsId: '1.82650383.1552055894719', // TODO: find out what this is?
      dateCode: dateStr,
    },
    headers: { 'User-Agent': okhttpUserAgent },
  };
  const response: { data: BmsShowTimesResponse } = await axios(axiosOptions);
  const showDetail = response.data.ShowDetails[0];
  if (!showDetail) return [];
  const availableVenueCodes = showDetail.Venues.map(venue => venue.VenueCode);
  return availableVenueCodes;
}

function mapToRegion(bmsRegion: BmsRegion, isTopCity: boolean): Region {
  return {
    code: bmsRegion.RegionCode,
    name: bmsRegion.RegionName,
    isTopCity,
  };
}

function mapToCinema(cinema: BmsQuickBookCinema, ttl: number): Cinema {
  return {
    code: cinema.VenueCode,
    companyCode: cinema.CompanyCode,
    name: cinema.VenueName,
    address: cinema.VenueAddress,
    regionCode: cinema.VenueSubRegionCode,
    ttl,
  };
}

function mapToMovie(movie: BmsQuickBookMovie, regionCode: string, ttl: number): Movie {
  return {
    regionCode,
    code: movie.EventCode,
    groupCode: movie.EventGroup,
    name: movie.EventTitle,
    slug: movie.EventURLTitle,
    avgRating: movie.avgRating,
    totalVotes: movie.totalVotes,
    ttl,
  };
}

function mapToMovieComingSoon(movie: BmsComingSoonMovie, regionCode: string, ttl: number): Movie {
  const urlSplits = (movie.FShareURL || '').split('/');
  const slug = urlSplits[Math.max(0, urlSplits.length - 2)] || '';
  return {
    regionCode,
    code: movie.EventCode,
    groupCode: movie.EventGroupCode,
    name: movie.EventTitle,
    slug,
    avgRating: 0,
    totalVotes: 0,
    ttl,
  };
}
