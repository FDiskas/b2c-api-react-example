import { RouteProps } from 'react-router';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import {orderHistoryStyles} from "./styles";
import {TOrderCollection} from "src/shared/interfaces/order/index";


export interface IOrderHistoryPageProps extends WithStyles<typeof orderHistoryStyles>, RouteProps {
  getOrdersCollection: Function;
  isLoading: boolean;
  isRejected: boolean;
  isFulfilled: boolean;
  isAppDataSet: boolean;
  isUserLoggedIn: boolean;
  isInitiated: boolean;
  isHasOrders: boolean;
  orders: TOrderCollection;
  routerPush: Function;
}

export interface IOrderHistoryPageState {

}

export type TOrderHistoryContext = {
  viewClickHandler(event: any): any,
};
