export enum AppRoute {
  Root = '/',
  Login = '/login',
  Favorites = '/favorites',
  Offer = '/offer',
}

export enum APIRoute {
  Offers = '/offers',
  Login = '/login',
}

export enum NameSpace {
  Main = 'MAIN',
  Offer = 'OFFER',
  Data = 'DATA',
  User = 'USER'
}

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}

export enum RequestStatus {
  Idle = 'Idle',
  Pending = 'Pending',
  Success = 'Success',
  Rejected = 'Rejected',
}

export enum ClassNameForOfferCardType {
  Cities = 'cities',
  Favorites = 'favorites',
}

export enum OfferCommentLimit {
  CommentMinLength = 50,
  CommentMaxLength = 300,
  MinRating = 1,
}

export const OFFER_COMMENT_RATINGS = [
  { ratingValue: 1, ratingText: 'terribly' },
  { ratingValue: 2, ratingText: 'badly' },
  { ratingValue: 3, ratingText: 'not bad' },
  { ratingValue: 4, ratingText: 'good' },
  { ratingValue: 5, ratingText: 'perfect' },
] as const;

export const CityNames: string[] = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
];

export enum SortingMap {
    Popular = 'Popular',
    LowToHigh = 'Price: low to high',
    HighToLow = 'Price: high to low',
    TopRated = 'Top rated first',
}

export const ASSETS_BASE_URL = '/img';
export const URL_MARKER_DEFAULT = `${ASSETS_BASE_URL}/pin.svg`;
export const URL_MARKER_CURRENT = `${ASSETS_BASE_URL}/pin-active.svg`;

export const BACKEND_BASE_URL = 'https://13.design.pages.academy/six-cities';
export const REQUEST_TIMEOUT = 5000;
export const TIMEOUT_SHOW_ERROR = 2000;

export const DEFAULT_LOCATION = 'Paris';
