import { describe, expect, it } from 'vitest';
import { AuthorizationStatus, RequestStatus } from '../../constants';
import { mockUser } from '../../utils/mocks';
import { checkAuth, logIn, logOut } from '../api-actions';
import { userDataSlice } from './user-data.slice';
import { TAuthData } from '../../types/auth-data';

describe('UserData slice', () => {
  const action = { type: '' };
  const initialState = {
    user: null,
    loginStatus: RequestStatus.Idle,
    authorizationStatus: AuthorizationStatus.Unknown,
  };

  it('should return initial state with empty action', () => {
    const expectedState = {
      user: null,
      loginStatus: RequestStatus.Idle,
      authorizationStatus: AuthorizationStatus.Unknown,
    };
    const result = userDataSlice.reducer(expectedState, action);

    expect(result).toEqual(expectedState);
  });

  it('should return default initial state with empty action and undefined state', () => {
    const result = userDataSlice.reducer(undefined, action);

    expect(result).toEqual(initialState);
  });

  it('should set "checkAuth" to "RequestStatus.Pending" with "checkAuth.pending"', () => {
    const expectedState = {
      user: null,
      loginStatus: RequestStatus.Idle,
      authorizationStatus: AuthorizationStatus.Unknown,
    };
    const result = userDataSlice.reducer(undefined, checkAuth.pending);

    expect(result).toEqual(expectedState);
  });

  it('should set "user" to user data, set "authorizationStatus" to "AuthorizationStatus.Auth" with "checkAuth.fulfilled"', () => {
    const expectedState = {
      user: mockUser,
      loginStatus: RequestStatus.Idle,
      authorizationStatus: AuthorizationStatus.Auth,
    };
    const result = userDataSlice.reducer(
      undefined,
      checkAuth.fulfilled(mockUser, '', undefined)
    );

    expect(result).toEqual(expectedState);
  });

  it('should set "user" to null, set "authorizationStatus" to "AuthorizationStatus.NoAuth" with "checkAuth.rejected"', () => {
    const expectedState = {
      user: null,
      loginStatus: RequestStatus.Idle,
      authorizationStatus: AuthorizationStatus.NoAuth,
    };
    const result = userDataSlice.reducer(
      undefined,
      checkAuth.rejected(null, '', undefined)
    );

    expect(result).toEqual(expectedState);
  });

  it('should set "loginStatus" to "RequestStatus.Pending" with "logIn.pending"', () => {
    const expectedState = {
      user: null,
      loginStatus: RequestStatus.Pending,
      authorizationStatus: AuthorizationStatus.Unknown,
    };
    const result = userDataSlice.reducer(undefined, logIn.pending);

    expect(result).toEqual(expectedState);
  });

  it('should set "user" to user data, set "authorizationStatus" to "AuthorizationStatus.Auth", set "loginStatus" to "RequestStatus.Success" with "checkAuth.fulfilled"', () => {
    const expectedState = {
      user: mockUser,
      loginStatus: RequestStatus.Success,
      authorizationStatus: AuthorizationStatus.Auth,
    };
    const authData = { email: 'test@mail.com', password: 'aA1' } as TAuthData;
    const result = userDataSlice.reducer(
      undefined,
      logIn.fulfilled(mockUser, '', authData)
    );

    expect(result).toEqual(expectedState);
  });

  it('should set "loginStatus" to "RequestStatus.Reject" with "logIn.rejected"', () => {
    const expectedState = {
      user: null,
      loginStatus: RequestStatus.Rejected,
      authorizationStatus: AuthorizationStatus.Unknown,
    };
    const result = userDataSlice.reducer(undefined, logIn.rejected);

    expect(result).toEqual(expectedState);
  });

  it('should set "user" to user data, set "authorizationStatus" to "AuthorizationStatus.Auth" with "logOut.fulfilled"', () => {
    const expectedState = {
      user: null,
      loginStatus: RequestStatus.Idle,
      authorizationStatus: AuthorizationStatus.NoAuth,
    };
    const result = userDataSlice.reducer(
      undefined,
      logOut.fulfilled(undefined, '', undefined)
    );

    expect(result).toEqual(expectedState);
  });
});
