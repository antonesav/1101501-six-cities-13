import {describe, expect, it} from 'vitest';
import {RequestStatus} from '../../constants';
import {mockOfferFull} from '../../utils/mocks';
import {fetchOffer} from '../api-actions';
import {offerDataSlice} from './offer-data.slice';

describe('OfferData slice', () => {
  const action = {type: ''};
  const initialState = {offer: null, fetchOfferStatus: RequestStatus.Idle};

  it('should return initial state with empty action', () => {
    const expectedState = {offer: null, fetchOfferStatus: RequestStatus.Idle};
    const result = offerDataSlice.reducer(expectedState, action);

    expect(result).toEqual(expectedState);
  });

  it('should return default initial state with empty action and undefined state', () => {
    const result = offerDataSlice.reducer(undefined, action);

    expect(result).toEqual(initialState);
  });

  it('should set "fetchOfferStatus" to "RequestStatus.Pending" with "fetchOffer.pending"', () => {
    const expectedState = {offer: null, fetchOfferStatus: RequestStatus.Pending};
    const result = offerDataSlice.reducer(undefined, fetchOffer.pending);

    expect(result).toEqual(expectedState);
  });

  it('should set "offer" to offer info, "RequestStatus.Success" with "fetchOffer.fulfilled"', () => {
    const expectedState = {offer: mockOfferFull, fetchOfferStatus: RequestStatus.Success};
    const result = offerDataSlice.reducer(undefined, fetchOffer.fulfilled(
      mockOfferFull, '', 'fulfilled'
    ));

    expect(result).toEqual(expectedState);
  });

  it('should set "fetchOfferStatus" to "RequestStatus.Rejected" with "fetchOffer.rejected"', () => {
    const expectedState = {offer: null, fetchOfferStatus: RequestStatus.Rejected};
    const result = offerDataSlice.reducer(undefined, fetchOffer.rejected);

    expect(result).toEqual(expectedState);
  });
});
