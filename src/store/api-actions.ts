import {APIRoute, AppRoute, AuthorizationStatus, NameSpace, TIMEOUT_SHOW_ERROR} from '../constants';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {redirectToRoute} from './action';
import {TFavoriteData, TOffer} from '../types/offer';
import {TAuthData} from '../types/auth-data';
import {TAuthUserData} from '../types/user-data';
import {removeToken, setToken} from '../services/token';
import {TOfferFull} from '../types/offerFull';
import {TReview, TReviewData} from '../types/review';
import {AxiosInstance} from 'axios';
import {TAppDispatch, TAppState} from '../types/state';
import {fetchError} from './app-data/app-data.slice';

type TExtraArg = {extra: AxiosInstance};

export const fetchOffers = createAsyncThunk<
  TOffer[], undefined, TExtraArg
  >(
    `${NameSpace.Offers}/fetchOffers`,
    async (_arg, {extra: api}) => {
      const {data} = await api.get<TOffer[]>(APIRoute.Offers);
      return data;
    }
  );

export const fetchOffer = createAsyncThunk<
  TOfferFull, TOfferFull['id'], TExtraArg
  >(
    `${NameSpace.Offer}/fetchOffer`,
    async (offerId, {extra: api}) => {
      const {data} = await api.get<TOfferFull>(`${APIRoute.Offers}/${offerId}`);
      return data;
    }
  );

export const fetchNearPlaces = createAsyncThunk<
  TOffer[], TOfferFull['id'], TExtraArg
  >(
    `${NameSpace.NearPlaces}/fetchNearPlaces`,
    async (offerId, {extra: api}) => {
      const {data} = await api.get<TOffer[]>(`${APIRoute.Offers}/${offerId}${APIRoute.Nearby}`);
      return data;
    }
  );

export const fetchReviews = createAsyncThunk<
  TReview[], TOfferFull['id'], TExtraArg
  >(
    `${NameSpace.Reviews}/fetchOfferReviews`,
    async (offerId, {extra: api}) => {
      const {data} = await api.get<TReview[]>(`${APIRoute.Reviews}/${offerId}`);
      return data;
    }
  );

export const postReview = createAsyncThunk<
  TReview, {reviewData: TReviewData; offerId: TOfferFull['id']}, TExtraArg
  >(
    `${NameSpace.Reviews}/postOfferReview`,
    async ({reviewData, offerId}, {extra: api}) => {
      const {data} = await api.post<TReview>(`${APIRoute.Reviews}/${offerId}`, reviewData);
      return data;
    }
  );

export const fetchFavorites = createAsyncThunk<
  TOffer[], undefined, TExtraArg
  >(
    `${NameSpace.Favorites}/fetchFavorites`,
    async (_arg, {extra: api}) => {
      const {data} = await api.get<TOffer[]>(`${APIRoute.Favorite}`);
      return data;
    }
  );

export const changeFavorite = createAsyncThunk<
  TOffer | null, TFavoriteData, TExtraArg & {state: TAppState}
  >(
    `${NameSpace.Favorites}/addFavorite`,
    async ({id, status}, {extra: api, getState, dispatch}) => {
      const authStatus = getState()[NameSpace.User].authorizationStatus;

      if (authStatus !== AuthorizationStatus.Auth) {
        dispatch(redirectToRoute(AppRoute.Login));
        return null;
      }

      const {data} = await api.post<TOffer>(`${APIRoute.Favorite}/${id}/${status}`);
      return data;
    }
  );

export const checkAuth = createAsyncThunk<
  TAuthUserData, undefined, TExtraArg
  >(
    `${NameSpace.User}/checkAuth`,
    async (_arg, {extra: api}) => {
      const {data} = await api.get<TAuthUserData>(APIRoute.Login);
      return data;
    },
  );

export const logIn = createAsyncThunk<
  TAuthUserData, TAuthData, TExtraArg & {dispatch: TAppDispatch}
  >(
    `${NameSpace.User}/login`,
    async ({email, password}, {dispatch, extra: api}) => {
      const {data} = await api.post<TAuthUserData>(APIRoute.Login, {email, password});
      setToken(data.token);
      dispatch(redirectToRoute(AppRoute.Root));
      return data;
    },
  );

export const logOut = createAsyncThunk<
  void, undefined, TExtraArg
  >(
    `${NameSpace.User}/logout`,
    async (_arg, {extra: api}) => {
      await api.delete(APIRoute.Logout);
      removeToken();
    }
  );

export const clearErrorAction = createAsyncThunk<
  void, undefined, TExtraArg
  >(
    `${NameSpace.App}/clearError`,
    (_arg, {dispatch}) => {
      setTimeout(
        () => dispatch(fetchError(null)),
        TIMEOUT_SHOW_ERROR,
      );
    },
  );
