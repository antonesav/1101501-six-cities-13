import { ThunkDispatch } from 'redux-thunk';
import { createAPI } from '../services/api';
import { Action } from 'redux';
import {TOffer} from '../types/offer';
import {TOfferFull} from '../types/offerFull';
import {TReview} from '../types/review';
import {TAuthUserData} from '../types/user-data';
import { TAppState } from '../types/state';

export const mockUser: TAuthUserData = {
  'name': 'Oliver Conner',
  'avatarUrl': 'https://url-to-image/image.png',
  'isPro': false,
  'email': 'Oliver.conner@gmail.com',
  'token': 'T2xpdmVyLmNvbm5lckBnbWFpbC5jb20='
};
export const mockOffer: TOffer = {
  'id': '22ce00cc-b81b-4085-8a27-aebcd80dd266',
  'title': 'The Pondhouse - A Magical Place',
  'type': 'apartment',
  'price': 368,
  'previewImage': 'https://13.design.pages.academy/static/hotel/13.jpg',
  'city': {
    'name': 'Paris',
    'location': {
      'latitude': 48.85661,
      'longitude': 2.351499,
      'zoom': 13
    }
  },
  'location': {
    'latitude': 48.868610000000004,
    'longitude': 2.342499,
    'zoom': 16
  },
  'isFavorite': false,
  'isPremium': true,
  'rating': 4.2
};
export const mockOfferFull: TOfferFull = {
  'id': 'e4d1588c-9372-4d2c-a08b-caaf23f668e6',
  'title': 'The house among olive ',
  'description': 'Discover daily local life in city center, friendly neighborhood, clandestine casino, karaoke, old-style artisans, art gallery and artist studio downstairs.',
  'type': 'hotel',
  'price': 402,
  'images': [
    'https://13.design.pages.academy/static/hotel/15.jpg',
    'https://13.design.pages.academy/static/hotel/8.jpg',
    'https://13.design.pages.academy/static/hotel/19.jpg',
    'https://13.design.pages.academy/static/hotel/10.jpg',
    'https://13.design.pages.academy/static/hotel/5.jpg',
    'https://13.design.pages.academy/static/hotel/11.jpg'
  ],
  'city': {
    'name': 'Paris',
    'location': {
      'latitude': 48.85661,
      'longitude': 2.351499,
      'zoom': 13
    }
  },
  'location': {
    'latitude': 48.868610000000004,
    'longitude': 2.342499,
    'zoom': 16
  },
  'goods': [
    'Washing machine',
    'Cable TV',
    'Air conditioning'
  ],
  'host': {
    'isPro': true,
    'name': 'Angelina',
    'avatarUrl': 'https://13.design.pages.academy/static/host/avatar-angelina.jpg'
  },
  'isPremium': true,
  'isFavorite': false,
  'rating': 1.8,
  'bedrooms': 1,
  'maxAdults': 2
};
export const mockOffers: TOffer[] = [{
  'id': '22ce00cc-b81b-4085-8a27-aebcd80dd266',
  'title': 'The Pondhouse - A Magical Place',
  'type': 'apartment',
  'price': 368,
  'previewImage': 'https://13.design.pages.academy/static/hotel/13.jpg',
  'city': {
    'name': 'Paris',
    'location': {
      'latitude': 48.85661,
      'longitude': 2.351499,
      'zoom': 13
    }
  },
  'location': {
    'latitude': 48.868610000000004,
    'longitude': 2.342499,
    'zoom': 16
  },
  'isFavorite': false,
  'isPremium': true,
  'rating': 4.2
},
{
  'id': '22ce00cc-b81b-4085-8a47-aebcd80dd266',
  'title': 'The Pondhouse - A Magical Place',
  'type': 'apartment',
  'price': 368,
  'previewImage': 'https://13.design.pages.academy/static/hotel/13.jpg',
  'city': {
    'name': 'Paris',
    'location': {
      'latitude': 48.85661,
      'longitude': 2.351499,
      'zoom': 13
    }
  },
  'location': {
    'latitude': 48.868610000000004,
    'longitude': 2.342499,
    'zoom': 16
  },
  'isFavorite': false,
  'isPremium': true,
  'rating': 4.2
}];
export const mockReviews: TReview[] = [{
  'id': 'b041999e-e959-4452-aea1-56561bcd78e3',
  'comment': 'I stayed here for one night and it was an unpleasant experience.',
  'date': '2023-06-26T21:00:00.436Z',
  'rating': 1,
  'user': {
    'name': 'Jack',
    'avatarUrl': 'https://13.design.pages.academy/static/avatar/5.jpg',
    'isPro': true
  }
},
{
  'id': '91ccc8f7-688a-4d9b-8998-a2f9713c1a6c',
  'comment': 'We loved it so much, the house, the veiw, the location just great.. Highly reccomend :)',
  'date': '2023-06-26T21:00:00.436Z',
  'rating': 2,
  'user': {
    'name': 'Kendall',
    'avatarUrl': 'https://13.design.pages.academy/static/avatar/10.jpg',
    'isPro': false
  }
}];

export type AppThunkDispatch = ThunkDispatch<TAppState, ReturnType<typeof createAPI>, Action>
export const extractActionsTypes = (actions: Action<string>[]) => actions.map(({ type }) => type);
