import { describe, expect, it } from 'vitest';
import { RequestStatus } from '../../constants';
import { mockReviews } from '../../utils/mocks';
import { fetchReviews, postReview } from '../api-actions';
import { reviewsDataSlice } from './reviews-data.slice';

describe('ReviewsData slice', () => {
  const action = { type: '' };
  const initialState = {
    reviews: [],
    fetchReviewsStatus: RequestStatus.Idle,
    postReviewStatus: RequestStatus.Idle,
  };

  it('should return initial state with empty action', () => {
    const expectedState = {
      reviews: [],
      fetchReviewsStatus: RequestStatus.Idle,
      postReviewStatus: RequestStatus.Idle,
    };
    const result = reviewsDataSlice.reducer(expectedState, action);

    expect(result).toEqual(expectedState);
  });

  it('should return default initial state with empty action and undefined state', () => {
    const result = reviewsDataSlice.reducer(undefined, action);

    expect(result).toEqual(initialState);
  });

  it('should set "fetchReviewsStatus" to "RequestStatus.Pending" with "fetchReviews.pending"', () => {
    const expectedState = {
      reviews: [],
      fetchReviewsStatus: RequestStatus.Pending,
      postReviewStatus: RequestStatus.Idle,
    };
    const result = reviewsDataSlice.reducer(undefined, fetchReviews.pending);

    expect(result).toEqual(expectedState);
  });

  it('should set "reviews" to array with review, "RequestStatus.Success" with "fetchReviews.fulfilled"', () => {
    const expectedState = {
      reviews: mockReviews,
      fetchReviewsStatus: RequestStatus.Success,
      postReviewStatus: RequestStatus.Idle,
    };
    const result = reviewsDataSlice.reducer(
      undefined,
      fetchReviews.fulfilled(mockReviews, '', 'fulfilled')
    );

    expect(result).toEqual(expectedState);
  });

  it('should set "fetchReviewsStatus" to "RequestStatus.Rejected" with "fetchReviews.rejected"', () => {
    const expectedState = {
      reviews: [],
      fetchReviewsStatus: RequestStatus.Rejected,
      postReviewStatus: RequestStatus.Idle,
    };
    const result = reviewsDataSlice.reducer(undefined, fetchReviews.rejected);

    expect(result).toEqual(expectedState);
  });

  it('should set "postReviewStatus" to "RequestStatus.Pending" with "postReview.pending"', () => {
    const expectedState = {
      reviews: [],
      fetchReviewsStatus: RequestStatus.Idle,
      postReviewStatus: RequestStatus.Pending,
    };
    const result = reviewsDataSlice.reducer(undefined, postReview.pending);

    expect(result).toEqual(expectedState);
  });

  it('should set "reviews" to array with new review, set "postReviewStatus" to "RequestStatus.Success" with "postReview.fulfilled"', () => {
    const state = {
      reviews: [],
      fetchReviewsStatus: RequestStatus.Idle,
      postReviewStatus: RequestStatus.Idle,
    };
    const expectedState = {
      reviews: [mockReviews[0]],
      fetchReviewsStatus: RequestStatus.Idle,
      postReviewStatus: RequestStatus.Success,
    };
    const requestComment = {
      reviewData: {
        comment: 'any comment text',
        rating: 4,
      },
      offerId: mockReviews[0].id,
    };
    const result = reviewsDataSlice.reducer(
      state,
      postReview.fulfilled(mockReviews[0], '', requestComment)
    );

    expect(result).toEqual(expectedState);
  });

  it('should set "postReviewStatus" to "RequestStatus.Rejected" with "postReviewStatus.rejected"', () => {
    const expectedState = {
      reviews: [],
      fetchReviewsStatus: RequestStatus.Idle,
      postReviewStatus: RequestStatus.Rejected,
    };
    const result = reviewsDataSlice.reducer(undefined, postReview.rejected);

    expect(result).toEqual(expectedState);
  });
});
