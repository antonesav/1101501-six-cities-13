import {describe, expect, it} from 'vitest';
import {RequestStatus} from '../../constants';
import {mockOffer, mockOffers} from '../../utils/mocks';
import {favoritesDataSlice} from './favorites-data.slice';
import {changeFavorite, fetchFavorites} from '../api-actions';
import { TFavoriteData } from '../../types/offer';

describe('FavoritesData slice', () => {
  const action = {type: ''};
  const initialState = {favoriteOffers: [], fetchFavoriteOffersStatus: RequestStatus.Idle};

  it('should return initial state with empty action', () => {
    const expectedState = {favoriteOffers: [mockOffer], fetchFavoriteOffersStatus: RequestStatus.Pending};
    const result = favoritesDataSlice.reducer(expectedState, action);

    expect(result).toEqual(expectedState);
  });

  it('should return default initial state with empty action and undefined state', () => {
    const result = favoritesDataSlice.reducer(undefined, action);

    expect(result).toEqual(initialState);
  });

  it('should set "fetchFavoriteOffersStatus" to "RequestStatus.Pending" with "fetchFavorites.pending"', () => {
    const expectedState = {favoriteOffers: [], fetchFavoriteOffersStatus: RequestStatus.Pending};
    const result = favoritesDataSlice.reducer(undefined, fetchFavorites.pending);

    expect(result).toEqual(expectedState);
  });

  it('should set "favoriteOffers" to array with favorite offer, "RequestStatus.Success" with "fetchFavorites.fulfilled"', () => {
    const expectedState = {favoriteOffers: [mockOffer], fetchFavoriteOffersStatus: RequestStatus.Success};
    const result = favoritesDataSlice.reducer(undefined, fetchFavorites.fulfilled(
      [mockOffer], '', undefined
    ));

    expect(result).toEqual(expectedState);
  });

  it('should set "fetchFavoriteOffersStatus" to "RequestStatus.Rejected" with "fetchFavorites.rejected"', () => {
    const expectedState = {favoriteOffers: [], fetchFavoriteOffersStatus: RequestStatus.Rejected};
    const result = favoritesDataSlice.reducer(undefined, fetchFavorites.rejected);

    expect(result).toEqual(expectedState);
  });

  it('should add offer to array "favoriteOffers" with "changeFavorite.fulfilled"', () => {
    const state = {favoriteOffers: [], fetchFavoriteOffersStatus: RequestStatus.Success};
    const requestFavoriteData = {id: mockOffer.id, status: 1} as TFavoriteData;
    const expectedState = {favoriteOffers: [mockOffer], fetchFavoriteOffersStatus: RequestStatus.Success};
    const result = favoritesDataSlice.reducer(state, changeFavorite.fulfilled(
      mockOffer, '', requestFavoriteData
    ));

    expect(result).toEqual(expectedState);
  });

  it('should remove offer to array "favoriteOffers" with "changeFavorite.fulfilled"', () => {
    const state = {favoriteOffers: [mockOffers[0], mockOffers[1]], fetchFavoriteOffersStatus: RequestStatus.Success};
    const requestFavoriteData = {id: mockOffers[0].id, status: 1} as TFavoriteData;
    const expectedState = {favoriteOffers: [mockOffers[1]], fetchFavoriteOffersStatus: RequestStatus.Success};
    const result = favoritesDataSlice.reducer(state, changeFavorite.fulfilled(
      mockOffers[0], '', requestFavoriteData
    ));

    expect(result).toEqual(expectedState);
  });
});
