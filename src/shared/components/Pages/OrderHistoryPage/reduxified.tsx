import {reduxify} from '../../../lib/redux-helper';
import {getRouterHistoryPush, getRouterLocation} from "../../../selectors/Common/router";
import {getOrdersCollectionAction} from "../../../actions/Pages/Order";
import {
  getOrdersCollectionFromStore,
  isOrderHistoryFulfilled,
  isOrderHistoryInitiated,
  isOrderHistoryItems,
  isOrderHistoryLoading,
  isOrderHistoryStateRejected
} from "../../../reducers/Pages/OrderHistory";
import {isAppInitiated} from "../../../reducers/Common/Init";
import {isUserAuthenticated} from "../../../reducers/Pages/Login";
import {OrderHistoryPage} from "./index";


export const ConnectedOrderHistoryPage = reduxify(
  (state: any, ownProps: any) => {
    const location = getRouterLocation(state, ownProps);
    const isLoading: boolean = isOrderHistoryLoading(state, ownProps);
    const isRejected: boolean = isOrderHistoryStateRejected(state, ownProps);
    const isFulfilled = isOrderHistoryFulfilled(state, ownProps);
    const isInitiated = isOrderHistoryInitiated(state, ownProps);
    const isAppDataSet: boolean = isAppInitiated(state, ownProps);
    const isUserLoggedIn = isUserAuthenticated(state, ownProps);
    const isHasOrders = isOrderHistoryItems(state, ownProps);
    const orders = getOrdersCollectionFromStore(state, ownProps);
    const routerPush = getRouterHistoryPush(state, ownProps);

    return ({
      location,
      isLoading,
      isRejected,
      isFulfilled,
      isAppDataSet,
      isUserLoggedIn,
      isInitiated,
      isHasOrders,
      orders,
      routerPush,
    });
  },
  (dispatch: Function) => ({
    getOrdersCollection: () => dispatch(getOrdersCollectionAction()),
  })
)(OrderHistoryPage);
