import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TInitialState} from '../../types/state';
import {NameSpace, RequestStatus} from '../../constants';
import {fetchReviews, postReview} from '../api-actions';
import { TReview } from '../../types/review';

type TReviewsDataState = Pick<TInitialState, 'reviews' | 'fetchReviewsStatus' | 'postReviewStatus'>;

const initialState: TReviewsDataState = {
  reviews: [],
  fetchReviewsStatus: RequestStatus.Idle,
  postReviewStatus: RequestStatus.Idle,
};

export const reviewsDataSlice = createSlice({
  name: NameSpace.Reviews,
  initialState,
  reducers: {
    resetPostStatus(state) {
      state.postReviewStatus = RequestStatus.Idle;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.fetchReviewsStatus = RequestStatus.Pending;
      })
      .addCase(fetchReviews.fulfilled, (state, action: PayloadAction<TReviewsDataState['reviews']>) => {
        state.fetchReviewsStatus = RequestStatus.Success;
        state.reviews = action.payload || [];
      })
      .addCase(fetchReviews.rejected, (state) => {
        state.fetchReviewsStatus = RequestStatus.Rejected;
      })
      .addCase(postReview.pending, (state) => {
        state.postReviewStatus = RequestStatus.Pending;
      })
      .addCase(postReview.fulfilled, (state, action: PayloadAction<TReview>) => {
        state.postReviewStatus = RequestStatus.Success;
        state.reviews.push(action.payload);
      })
      .addCase(postReview.rejected, (state) => {
        state.postReviewStatus = RequestStatus.Rejected;
      });
  },
});

export const { resetPostStatus } = reviewsDataSlice.actions;
