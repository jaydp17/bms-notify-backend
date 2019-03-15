export interface BmsRegion {
  RegionCode: string;
  RegionName: string;
  Seq: string; // numbers disguised as strings, eg, '1'
  Lat: string; // eg. '19.0760'
  Long: string; // eg. '72.8777'
  AllowSales: 'Y' | 'N';
  isOlaEnabled: 'Y' | 'N';
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
  AllowSales: 'Y' | 'N';
  SubRegionSlug: string;
}

export interface BmsRegionListResponse {
  BookMyShow: {
    TopCities: BmsRegion[];
    OtherCities: BmsRegion[];
  };
}
