export type YesNo = 'Y' | 'N';

export interface BmsRegion {
  RegionCode: string;
  RegionName: string;
  Seq: string; // numbers disguised as strings, eg, '1'
  Lat: string; // eg. '19.0760'
  Long: string; // eg. '72.8777'
  AllowSales: YesNo;
  isOlaEnabled: YesNo;
  Alias: string[];
  SubRegions: BmsSubRegion[];
  RegionSlug: string;
  RegionCallCenterNo: string;
}

export interface BmsSubRegion {
  SubRegionCode: string;
  SubRegionName: string;
  Seq: string; // numbers disguised as strings, eg, '1'
  Lat: string; // eg. '19.0760'
  Long: string; // eg. '72.8777'
  AllowSales: YesNo;
  SubRegionSlug: string;
}

export interface BmsRegionListResponse {
  BookMyShow: {
    TopCities: BmsRegion[];
    OtherCities: BmsRegion[];
  };
}

export interface BmsQuickBookResponse {
  moviesData: {
    BookMyShow: {
      arrEvents: BmsQuickBookMovie[];
    };
  };
  cinemas: {
    BookMyShow: {
      aiVN: BmsQuickBookCinema[];
    };
  };
}

export interface BmsComingSoonResposne {
  BookMyShow: {
    page: {
      prev: number;
      current: number;
      next: number;
      total: number;
    };
    filters: {
      arrLanguages: string[];
      arrGenre: string[];
      arrYearandMonth: string[];
    };
    Events: BmsComingSoonMovie[];
  };
}

export interface BmsQuickBookCinema {
  VenueCode: string; // eg. 'ENNR'
  CompanyCode: string; // eg. 'MOAM'
  VenueName: string; // eg. '7D Mastii: Element Mall, Nagwara'
  IsATMOSEnabled: YesNo;
  VenueLatitude: string; // eg. '13.0452'
  VenueLongitude: string; // eg. '77.6266'
  VenueAddress: string; // eg. '3rd floor, Nagavara Village, 100 wide Thanisandra main road, Bengaluru, Karnataka 560077, India'
  VenueSubRegionCode: string; // eg. 'BANG'
  VenueSubRegionName: string; // eg. 'Bengaluru'
  CinemaUnpaidFlag: YesNo;
  VenueLegends: string; // eg. ';CAR;FOD;';
  UnpaidReleaseCutOffJson: [];
  CinemaIsNew: YesNo;
  CinemaCodFlag: YesNo;
  CinemaCopFlag: YesNo;
}

export interface BmsQuickBookMovie {
  EventGroup: string; // eg. 'EG00037499'
  EventTitle: string; // eg. 'Captain Marvel'
  EventGrpDuration: string; // eg. '124'
  EventGrpSequence: string; // eg. '50'
  EventGrpGenre: string; // eg. '|ACTION|ADVN|FANTASY|'
  EventGrpCensor: string; // eg. 'UA'
  EventGrpIsWebView: string; // eg. 'false'
  IsMovieClubEnabled: YesNo;
  EventCode: string; // eg. 'ET00056555'
  EventURLTitle: string; // eg. 'captain-marvel'
  IsPremiere: YesNo;
  avgRating: number; // eg. 83
  totalVotes: number; // eg. 48011
}

export interface BmsComingSoonMovie {
  EventCode: string; // eg. 'ET00090482'
  ImageCode: string; // eg. 'avengers-end-game-et00090482-07-12-2018-06-50-21'
  EventGroupCode: string; // eg. 'EG00068832'
  EventDimension: string; // eg. '2D'
  EventTitle: string; // eg. 'Avengers: Endgame'
  EventType: string; // eg. 'MT'
  Ratings: string; // eg. '0'
  Actors: string; // eg. 'Chris Evans,Robert Downey Jr.,Chris Hemsworth'
  Director: string; // eg. 'Anthony Russo,Joe Russo'
  Genre: string; // eg. 'Action,Adventure,Fantasy'
  GenreArray: string[]; // eg. ["Action","Adventure","Fantasy"]
  Language: string; // eg. 'English, Hindi, Tamil, Telugu'
  LanguageArray: string[]; // eg. ["English","Hindi","Tamil","Telugu"]
  Length: string; // eg. '3 hrs 2 mins'
  TrailerURL: string; // eg. https://www.youtube.com/watch?v=TcMBFSGVi1c&feature=youtu.be
  Seq: string; // eg. '50'
  EventSynopsis: string; // eg. 'The grave course of events set in motion by Thanos that wiped out half the universe and fractured the Avengers ranks compels the remaining Avengers to take one final stand in Marvel Studios' grand conclusion to twenty-two films, "Avengers: Endgame."'
  EventReleaseDate: string; // eg. '26th Apr 2019'
  ReleaseDateCode: string; // eg. '20190426'
  BannerURL: string; // eg. 'https://in.bmscdn.com/Events/Mobile/ET00090482.jpg?dtm=20190420'
  IsComingSoon: 'Y' | 'N';
  DimensionArray: string[]; // eg. ["2D","2D 4DX","3D","3D 4DX","IMAX 2D","IMAX 3D"]
  FShareURL: string; // eg. 'http://in.bookmyshow.com/movies/Avengers-Endgame/ET00090482'
}
