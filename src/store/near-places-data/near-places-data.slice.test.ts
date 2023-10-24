import {describe, expect, it} from 'vitest';
import {RequestStatus} from '../../constants';
import {mockOffer} from '../../utils/mocks';
import {fetchNearPlaces} from '../api-actions';
import {nearPlacesDataSlice} from './near-places-data.slice';

describe('NearPlacesData slice', () => {
  const action = {type: ''};
  const initialState = {nearPlaces: [], fetchNearPlacesStatus: RequestStatus.Idle};

  it('should return initial state with empty action', () => {
    const expectedState = {nearPlaces: [], fetchNearPlacesStatus: RequestStatus.Idle};
    const result = nearPlacesDataSlice.reducer(expectedState, action);

    expect(result).toEqual(expectedState);
  });

  it('should return default initial state with empty action and undefined state', () => {
    const result = nearPlacesDataSlice.reducer(undefined, action);

    expect(result).toEqual(initialState);
  });

  it('should set "fetchNearPlacesStatus" to "RequestStatus.Pending" with "fetchNearPlaces.pending"', () => {
    const expectedState = {nearPlaces: [], fetchNearPlacesStatus: RequestStatus.Pending};
    const result = nearPlacesDataSlice.reducer(undefined, fetchNearPlaces.pending);

    expect(result).toEqual(expectedState);
  });

  it('should set "nearPlaces" to array with near place offers, "RequestStatus.Success" with "fetchNearPlaces.fulfilled"', () => {
    const expectedState = {nearPlaces: [mockOffer], fetchNearPlacesStatus: RequestStatus.Success};
    const result = nearPlacesDataSlice.reducer(undefined, fetchNearPlaces.fulfilled(
      [mockOffer], '', 'fulfilled'
    ));

    expect(result).toEqual(expectedState);
  });

  it('should set "fetchNearPlacesStatus" to "RequestStatus.Rejected" with "fetchNearPlaces.rejected"', () => {
    const expectedState = {nearPlaces: [], fetchNearPlacesStatus: RequestStatus.Rejected};
    const result = nearPlacesDataSlice.reducer(undefined, fetchNearPlaces.rejected);

    expect(result).toEqual(expectedState);
  });
});
