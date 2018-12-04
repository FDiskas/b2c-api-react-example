import { WithStyles } from '@material-ui/core/styles/withStyles';
import {styles} from "./styles";
import {TOrderCollection} from "src/shared/interfaces/order/index";


export interface IOrderHistoryPageProps extends WithStyles<typeof styles> {
  getOrdersCollection: Function;
  isLoading: boolean;
  isRejected: boolean;
  isFulfilled: boolean;
  isAppDataSet: boolean;
  isUserLoggedIn: boolean;
  isInitiated: boolean;
  isHasOrders: boolean;
  orders: TOrderCollection;
}

export interface IOrderHistoryPageState {

}

export type TOrderHistoryContext = {
  viewClickHandler(event: any): any,
};

