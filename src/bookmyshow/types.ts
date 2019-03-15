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
