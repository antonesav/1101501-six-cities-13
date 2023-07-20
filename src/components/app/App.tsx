import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from '../pages/page-main/Main';
import PageNotFound from '../pages/page-not-found/PageNotFound';
import Login from '../pages/page-login/Login';
import Offer from '../pages/page-offer/Offer';
import Favorites from '../pages/page-favorites/Favorites';
import Layout from '../layout/Layout';
import PrivateRoute from '../private-route/PrivateRoute';
import { AppRoute, AuthorizationStatus } from '../../constants';
import {TOffers} from '../../types/offer';
import {TOffersFull} from '../../types/offerFull';
import {TReviews} from '../../types/review';

type TAppProps = {
  offersCount: number;
  offers: TOffers;
  offersFull: TOffersFull;
  reviews: TReviews;
};

function App({ offersCount, offers, offersFull, reviews }: TAppProps): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoute.Root} element={<Layout />}>
          <Route index element={<Main offersCount={offersCount} />} />
          <Route path={AppRoute.Login} element={<Login />} />
          <Route path={AppRoute.Offer} element={<Offer />} />
          <Route
            path={AppRoute.Favorites}
            element={
              <PrivateRoute authStatus={AuthorizationStatus.NoAuth}>
                <Favorites />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="*" element={<PageNotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
