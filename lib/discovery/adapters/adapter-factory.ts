/**
 * RevenueRecover AI — Source Adapter Factory
 * Dynamically instantiates and provides active source adapters.
 */

import { SourceAdapter } from '../types';
import { GooglePlacesAdapter } from './google-places-adapter';
import { YelpFusionAdapter } from './yelp-fusion-adapter';
import { FoursquareAdapter } from './foursquare-adapter';
import { OpenStreetMapOverpassAdapter } from './osm-overpass-adapter';
import { UKCompaniesHouseAdapter } from './uk-companies-house-adapter';

const adaptersMap: Record<string, () => SourceAdapter> = {
  src_google_places: () => new GooglePlacesAdapter(),
  src_yelp_fusion: () => new YelpFusionAdapter(),
  src_foursquare_places: () => new FoursquareAdapter(),
  src_osm_overpass: () => new OpenStreetMapOverpassAdapter(),
  src_uk_companies_house: () => new UKCompaniesHouseAdapter(),
};

export function getAdapter(sourceId: string): SourceAdapter | null {
  const factory = adaptersMap[sourceId];
  return factory ? factory() : null;
}

export function getAllAdapters(): SourceAdapter[] {
  return Object.values(adaptersMap).map((fn) => fn());
}
