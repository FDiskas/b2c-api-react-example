import { bindActionCreators, Dispatch } from 'redux';

import { reduxify } from 'src/shared/lib/redux-helper';
import { getRouterHistoryPush } from 'src/shared/selectors/Common/router';
import { getCustomerReference } from '@stores/reducers/pages/login';
import {
  getAddressesCollection,
  getCurrentAddress,
  isPageAddressesStateLoading,
  isAddressesInitiated,
} from '@stores/reducers/pages/addresses';
import { IAddressItem } from 'src/shared/interfaces/addresses';
import {
  getAddressesAction,
  setCurrentAddressAction,
  deleteAddressAction,
} from '@stores/actions/pages/addresses';

const mapStateToProps = (state: any, ownProps: any) => {
  const routerPush: Function = getRouterHistoryPush(state, ownProps);
  const customer: string | null = getCustomerReference(state, ownProps);
  const addresses: IAddressItem[] = getAddressesCollection(state, ownProps);
  const currentAddress: IAddressItem = getCurrentAddress(state, ownProps);
  const isLoading: boolean = isPageAddressesStateLoading(state, ownProps);
  const isAddressesInit: boolean = isAddressesInitiated(state, ownProps);

  return ({
    customer,
    currentAddress,
    addresses,
    routerPush,
    isLoading,
    isAddressesInit,
  });
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({
    getAddressesAction,
    setCurrentAddressAction,
    deleteAddressAction,
  }, dispatch);

export const connect = reduxify(mapStateToProps, mapDispatchToProps);
