import { configureMockStore } from '@jedmao/redux-mock-store';
import { createAPI } from '../services/api';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { Action } from 'redux';
import { describe, expect, it } from 'vitest';
import { TAppState } from '../types/state';
import { changeFavorite, checkAuth, clearErrorAction, fetchFavorites, fetchNearPlaces, fetchOffer, fetchOffers, fetchReviews, logIn, logOut, postReview } from './api-actions';
import { APIRoute, AuthorizationStatus, RequestStatus } from '../constants';
import { AppThunkDispatch, extractActionsTypes, mockOffer, mockOfferFull, mockOffers, mockReviews, mockUser } from '../utils/mocks';
import { TAuthData } from '../types/auth-data';
import { redirectToRoute } from './action';
import * as tokenStorage from '../services/token';
import { TFavoriteData } from '../types/offer';


describe('Async actions', () => {
  const axios = createAPI();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [thunk.withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<TAppState, Action<string>, AppThunkDispatch>(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator({USER: {
      user: null,
      loginStatus: RequestStatus.Idle,
      authorizationStatus: AuthorizationStatus.Auth,
    }});
  });

  describe('checkAuth', () => {
    const user = mockUser;

    it('should dispatch "checkAuth.pending" and "checkAuth.fulfilled" with thunk "checkAuth"', async() => {
      mockAxiosAdapter.onGet(APIRoute.Login).reply(200, user);

      await store.dispatch(checkAuth());
      const emitedAction = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emitedAction);
      const fetchCheckStatusFulfilled = emitedAction.at(1) as ReturnType<typeof checkAuth.fulfilled>;

      expect(extractedActionsTypes).toEqual([
        checkAuth.pending.type,
        checkAuth.fulfilled.type,
      ]);

      expect(fetchCheckStatusFulfilled.payload).toEqual(user);
    });

    it('should dispatch "checkAuth.pending" and "checkAuth.rejected" when server response 400', async() => {
      mockAxiosAdapter.onGet(APIRoute.Login).reply(400, null);

      await store.dispatch(checkAuth());
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        checkAuth.pending.type,
        checkAuth.rejected.type,
      ]);
    });
  });

  describe('logIn', () => {
    it('should dispatch "logIn.pending", "redirectToRoute", "logIn.fulfilled", when server response 200', async () => {
      const fakeAuthData: TAuthData = {email: 'fake@test.com', password: 'aA123'};
      const fakeServerReplay = {token: 'secret'};
      mockAxiosAdapter.onPost(APIRoute.Login).reply(200, fakeServerReplay);

      await store.dispatch(logIn(fakeAuthData));
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        logIn.pending.type,
        redirectToRoute.type,
        logIn.fulfilled.type,
      ]);
    });

    it('should call "setToken" once with received token', async () => {
      const fakeAuthData: TAuthData = {email: 'fakesecond@test.com', password: 'aA123'};
      const fakeServerReplay = {token: 'secret'};
      const mockSetToken = vi.spyOn(tokenStorage, 'setToken');
      mockAxiosAdapter.onPost(APIRoute.Login).reply(200, fakeServerReplay);

      await store.dispatch(logIn(fakeAuthData));

      expect(mockSetToken).toBeCalledTimes(1);
      expect(mockSetToken).toBeCalledWith(fakeServerReplay.token);
    });
  });

  describe('logOut', () => {
    it('should dispatch "logOut.pending", "redirectToRoute", "logOut.fulfilled", when server response 204', async () => {
      mockAxiosAdapter.onDelete(APIRoute.Logout).reply(204);

      await store.dispatch(logOut());
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        logOut.pending.type,
        logOut.fulfilled.type,
      ]);
    });

    it('should once call "removeToken" with "logOut"', async () => {
      const mockSetToken = vi.spyOn(tokenStorage, 'removeToken');
      mockAxiosAdapter.onDelete(APIRoute.Logout).reply(204);

      await store.dispatch(logOut());

      expect(mockSetToken).toBeCalledTimes(1);
    });
  });

  describe('clearErrorAction', () => {

    it('should dispatch "clearErrorAction.pending" and "clearErrorAction.fulfilled" with thunk "clearErrorAction"', async() => {
      await store.dispatch(clearErrorAction());
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        clearErrorAction.pending.type,
        clearErrorAction.fulfilled.type,
      ]);
    });
  });

  describe('changeFavorite', () => {
    const fakeAuthData: TFavoriteData = {id: mockOffer.id, status: 1};
    const fakeServerReplay = mockOffer;

    it('should dispatch "changeFavorite.pending", "changeFavorite.fulfilled" and return offer when server response 200 and "authorizationStatus" is AUTH', async () => {
      const storeAuthStatus = mockStoreCreator({USER: {
        authorizationStatus: AuthorizationStatus.Auth,
      }});
      mockAxiosAdapter.onPost(`${APIRoute.Favorite}/${fakeAuthData.id}/${fakeAuthData.status}`).reply(200, fakeServerReplay);

      await storeAuthStatus.dispatch(changeFavorite(fakeAuthData));
      const extractedActionsTypes = extractActionsTypes(storeAuthStatus.getActions());
      const changeFavoriteActionsFulfilled = storeAuthStatus.getActions().at(1) as ReturnType<typeof changeFavorite.fulfilled>;

      const {payload} = changeFavoriteActionsFulfilled;

      expect(extractedActionsTypes).toEqual([
        changeFavorite.pending.type,
        changeFavorite.fulfilled.type,
      ]);

      expect(payload).toEqual(fakeServerReplay);
    });

    it('should dispatch "changeFavorite.pending", "redirectToRoute", "changeFavorite.fulfilled" when server response 200 and "authorizationStatus" is not AUTH', async () => {
      const storeAuthStatus = mockStoreCreator({USER: {
        authorizationStatus: AuthorizationStatus.Unknown,
      }});
      mockAxiosAdapter.onPost(`${APIRoute.Favorite}/${fakeAuthData.id}/${fakeAuthData.status}`).reply(200, fakeServerReplay);

      await storeAuthStatus.dispatch(changeFavorite(fakeAuthData));
      const extractedActionsTypes = extractActionsTypes(storeAuthStatus.getActions());

      expect(extractedActionsTypes).toEqual([
        changeFavorite.pending.type,
        redirectToRoute.type,
        changeFavorite.fulfilled.type,
      ]);
    });

    it('should dispatch "changeFavorite.pending" and "changeFavorite.rejected" when server response 400', async () => {
      mockAxiosAdapter.onPost(`${APIRoute.Favorite}/${fakeAuthData.id}/${fakeAuthData.status}`).reply(400);

      await store.dispatch(changeFavorite(fakeAuthData));
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        changeFavorite.pending.type,
        changeFavorite.rejected.type,
      ]);
    });
  });

  describe('fetchFavorites', () => {
    const offers = mockOffers;
    it('should dispatch "fetchFavorites.pending", "fetchFavorites.fulfilled" and return offer when server response 200', async() => {
      mockAxiosAdapter.onGet(APIRoute.Favorite).reply(200, offers);

      await store.dispatch(fetchFavorites());
      const emitedAction = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emitedAction);
      const fetchFavoritesStatusFulfilled = emitedAction.at(1) as ReturnType<typeof fetchFavorites.fulfilled>;

      const {payload} = fetchFavoritesStatusFulfilled;

      expect(extractedActionsTypes).toEqual([
        fetchFavorites.pending.type,
        fetchFavorites.fulfilled.type,
      ]);

      expect(payload).toEqual(offers);
    });

    it('should dispatch "fetchFavorites.pending" and "fetchFavorites.rejected" when server response 400', async() => {
      mockAxiosAdapter.onGet(APIRoute.Favorite).reply(400);

      await store.dispatch(fetchFavorites());
      const emitedAction = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emitedAction);

      expect(extractedActionsTypes).toEqual([
        fetchFavorites.pending.type,
        fetchFavorites.rejected.type,
      ]);
    });
  });

  describe('postReview', () => {
    const review = mockReviews[0];
    const mockReviewData = {
      reviewData: {
        comment: 'comment text',
        rating: 4
      },
      offerId: mockOffer.id
    };

    it('should dispatch "postReview.pending", "postReview.fulfilled" and return review when server response 200', async() => {
      mockAxiosAdapter.onPost(`${APIRoute.Reviews}/${mockReviewData.offerId}`).reply(200, review);

      await store.dispatch(postReview(mockReviewData));
      const emitedAction = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emitedAction);
      const postReviewStatusFulfilled = emitedAction.at(1) as ReturnType<typeof postReview.fulfilled>;

      const {payload} = postReviewStatusFulfilled;

      expect(extractedActionsTypes).toEqual([
        postReview.pending.type,
        postReview.fulfilled.type,
      ]);

      expect(payload).toEqual(review);
    });

    it('should dispatch "postReview.pending", "postReview.rejected" when server response 400', async() => {
      mockAxiosAdapter.onPost(`${APIRoute.Reviews}/${mockReviewData.offerId}`).reply(400);

      await store.dispatch(postReview(mockReviewData));
      const emitedAction = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emitedAction);

      expect(extractedActionsTypes).toEqual([
        postReview.pending.type,
        postReview.rejected.type,
      ]);
    });
  });

  describe('fetchReviews', () => {
    const reviews = mockReviews;
    const mockOfferId = mockOffer.id;

    it('should dispatch "fetchReviews.pending", "fetchReviews.fulfilled" and return reviews when server response 200', async() => {
      mockAxiosAdapter.onGet(`${APIRoute.Reviews}/${mockOfferId}`).reply(200, reviews);

      await store.dispatch(fetchReviews(mockOfferId));
      const emitedAction = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emitedAction);
      const fetchReviewsStatusFulfilled = emitedAction.at(1) as ReturnType<typeof fetchReviews.fulfilled>;

      const {payload} = fetchReviewsStatusFulfilled;

      expect(extractedActionsTypes).toEqual([
        fetchReviews.pending.type,
        fetchReviews.fulfilled.type,
      ]);

      expect(payload).toEqual(reviews);
    });

    it('should dispatch "fetchReviews.pending", "fetchReviews.rejected" when server response 400', async() => {
      mockAxiosAdapter.onGet(`${APIRoute.Reviews}/${mockOfferId}`).reply(400);

      await store.dispatch(fetchReviews(mockOfferId));
      const emitedAction = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emitedAction);

      expect(extractedActionsTypes).toEqual([
        fetchReviews.pending.type,
        fetchReviews.rejected.type,
      ]);
    });
  });

  describe('fetchNearPlaces', () => {
    const offers = mockOffers;
    const mockOfferId = mockOffer.id;

    it('should dispatch "fetchNearPlaces.pending", "fetchNearPlaces.fulfilled" and return offers when server response 200', async() => {
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${mockOfferId}${APIRoute.Nearby}`).reply(200, offers);

      await store.dispatch(fetchNearPlaces(mockOfferId));
      const emitedAction = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emitedAction);
      const fetchNearPlacesStatusFulfilled = emitedAction.at(1) as ReturnType<typeof fetchNearPlaces.fulfilled>;

      const {payload} = fetchNearPlacesStatusFulfilled;

      expect(extractedActionsTypes).toEqual([
        fetchNearPlaces.pending.type,
        fetchNearPlaces.fulfilled.type,
      ]);

      expect(payload).toEqual(offers);
    });

    it('should dispatch "fetchNearPlaces.pending", "fetchNearPlaces.rejected" when server response 400', async() => {
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${mockOfferId}${APIRoute.Nearby}`).reply(400);

      await store.dispatch(fetchNearPlaces(mockOfferId));
      const emitedAction = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emitedAction);

      expect(extractedActionsTypes).toEqual([
        fetchNearPlaces.pending.type,
        fetchNearPlaces.rejected.type,
      ]);
    });
  });

  describe('fetchOffer', () => {
    const offer = mockOfferFull;
    const mockOfferId = offer.id;

    it('should dispatch "fetchOffer.pending", "fetchOffer.fulfilled" and return offer when server response 200', async() => {
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${mockOfferId}`).reply(200, offer);

      await store.dispatch(fetchOffer(mockOfferId));
      const emitedAction = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emitedAction);
      const fetchOfferStatusFulfilled = emitedAction.at(1) as ReturnType<typeof fetchOffer.fulfilled>;

      const {payload} = fetchOfferStatusFulfilled;

      expect(extractedActionsTypes).toEqual([
        fetchOffer.pending.type,
        fetchOffer.fulfilled.type,
      ]);

      expect(payload).toEqual(offer);
    });

    it('should dispatch "fetchOffer.pending", "fetchOffer.rejected" when server response 400', async() => {
      mockAxiosAdapter.onGet(`${APIRoute.Offers}/${mockOfferId}`).reply(400);

      await store.dispatch(fetchOffer(mockOfferId));
      const emitedAction = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emitedAction);

      expect(extractedActionsTypes).toEqual([
        fetchOffer.pending.type,
        fetchOffer.rejected.type,
      ]);
    });
  });

  describe('fetchOffers', () => {
    const offers = mockOffers;

    it('should dispatch "fetchOffers.pending", "fetchOffers.fulfilled" and return offers when server response 200', async() => {
      mockAxiosAdapter.onGet(`${APIRoute.Offers}`).reply(200, offers);

      await store.dispatch(fetchOffers());
      const emitedAction = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emitedAction);
      const fetchOffersStatusFulfilled = emitedAction.at(1) as ReturnType<typeof fetchOffers.fulfilled>;

      const {payload} = fetchOffersStatusFulfilled;

      expect(extractedActionsTypes).toEqual([
        fetchOffers.pending.type,
        fetchOffers.fulfilled.type,
      ]);

      expect(payload).toEqual(offers);
    });

    it('should dispatch "fetchOffers.pending", "fetchOffers.rejected" when server response 400', async() => {
      mockAxiosAdapter.onGet(`${APIRoute.Offers}`).reply(400);

      await store.dispatch(fetchOffers());
      const emitedAction = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emitedAction);

      expect(extractedActionsTypes).toEqual([
        fetchOffers.pending.type,
        fetchOffers.rejected.type,
      ]);
    });
  });

});
