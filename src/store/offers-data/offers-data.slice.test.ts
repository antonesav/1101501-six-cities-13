import {describe, expect, it} from 'vitest';
import {RequestStatus} from '../../constants';
import {mockOffers} from '../../utils/mocks';
import {fetchOffers} from '../api-actions';
import { offersDataSlice } from './offers-data.slice';

describe('OffersData slice', () => {
  const action = {type: ''};
  const initialState = {offers: [],fetchOffersStatus: RequestStatus.Idle};

  it('should return initial state with empty action', () => {
    const expectedState = {offers: [],fetchOffersStatus: RequestStatus.Idle};
    const result = offersDataSlice.reducer(expectedState, action);

    expect(result).toEqual(expectedState);
  });

  it('should return default initial state with empty action and undefined state', () => {
    const result = offersDataSlice.reducer(undefined, action);

    expect(result).toEqual(initialState);
  });

  it('should set "fetchOffersStatus" to "RequestStatus.Pending" with "fetchOffers.pending"', () => {
    const expectedState = {offers: [],fetchOffersStatus: RequestStatus.Pending};
    const result = offersDataSlice.reducer(undefined, fetchOffers.pending);

    expect(result).toEqual(expectedState);
  });

  it('should set "offers" to array with offer, "RequestStatus.Success" with "fetchOffers.fulfilled"', () => {
    const expectedState = {offers: mockOffers, fetchOffersStatus: RequestStatus.Success};
    const result = offersDataSlice.reducer(undefined, fetchOffers.fulfilled(
      mockOffers, '', undefined
    ));

    expect(result).toEqual(expectedState);
  });

  it('should set "fetchOffersStatus" to "RequestStatus.Rejected" with "fetchOffers.rejected"', () => {
    const expectedState = {offers: [], fetchOffersStatus: RequestStatus.Rejected};
    const result = offersDataSlice.reducer(undefined, fetchOffers.rejected);

    expect(result).toEqual(expectedState);
  });
});
