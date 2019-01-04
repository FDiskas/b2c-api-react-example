import { toast } from 'react-toastify';
import { IAddressItem } from 'src/shared/interfaces/addresses';
import { RefreshTokenService } from '../../Common/RefreshToken/index';
import api, { setAuthToken } from '../../api';
import {
  addressAdd,
  addressDelete,
  addressUpdate,
} from 'src/shared/constants/messages/addresses';
import { ApiServiceAbstract } from '../../apiAbstractions/ApiServiceAbstract';
import {IApiResponseData} from "src/shared/services/types";
import {
  IAddressDataRawResponse,
  IRequestAddAddressBody,
  IRequestUpdateAddressBody
} from "src/shared/services/Pages/Addresses/types";


export class AddressesService extends ApiServiceAbstract {
  public static async getCustomerAddresses(ACTION_TYPE: string, dispatch: Function, customerId: string): Promise<void> {
    try {
      const token = await RefreshTokenService.getActualToken(dispatch);
      setAuthToken(token);

      const endpoint = `customers/${customerId}/addresses`;
      const response: IApiResponseData = await api.get(endpoint, {}, {withCredentials: true});

      if (response.ok) {
        const addresses = response.data.data.map((
          address: IAddressDataRawResponse,
        ): IAddressItem => ({id: address.id, ...address.attributes}));

        dispatch({
          type: ACTION_TYPE + '_FULFILLED',
          addresses,
        });
      } else {
        const errorMessage = this.getParsedAPIError(response);
        dispatch({
          type: ACTION_TYPE + '_REJECTED',
          error: errorMessage,
        });
        toast.error('Request Error: ' + errorMessage);
      }

    } catch (error) {
      dispatch({
        type: ACTION_TYPE + '_REJECTED',
        error: error.message,
      });
      toast.error('Unexpected Error: ' + error.message);
    }
  }

  public static async addAddress(ACTION_TYPE: string,
                                 dispatch: Function,
                                 payload: IAddressItem,
                                 customerId: string): Promise<void> {
    try {
      const token = await RefreshTokenService.getActualToken(dispatch);
      setAuthToken(token);

      const body: IRequestAddAddressBody = {
        data: {
          type: 'addresses',
          attributes: payload,
        },
      };

      const endpoint = `customers/${customerId}/addresses`;
      const response: IApiResponseData = await api.post(endpoint, body, {withCredentials: true});

      if (response.ok) {
        dispatch({
          type: ACTION_TYPE + '_FULFILLED',
          address: {id: response.data.data.id, ...response.data.data.attributes},

        });
        toast.success(addressAdd);

        // TODO - when after adding address in response will be id !== null - delete getCustomerAddresses
        await AddressesService.getCustomerAddresses('ADDRESSES_LIST', dispatch, customerId);
      } else {
        const errorMessage = this.getParsedAPIError(response);
        dispatch({
          type: ACTION_TYPE + '_REJECTED',
          error: errorMessage,
        });
        toast.error('Request Error: ' + errorMessage);
      }

    } catch (error) {
      dispatch({
        type: ACTION_TYPE + '_REJECTED',
        error,
      });
      toast.error('Unexpected Error: ' + error.message);
    }
  }

  public static async deleteAddress(ACTION_TYPE: string,
                                    dispatch: Function,
                                    addressId: string,
                                    customerId: string): Promise<void> {
    try {
      const token = await RefreshTokenService.getActualToken(dispatch);
      setAuthToken(token);

      const response: IApiResponseData = await api.delete(
        `customers/${customerId}/addresses/${addressId}`, {}, {withCredentials: true},
      );

      if (response.ok) {
        toast.success(addressDelete);
        dispatch({
          type: ACTION_TYPE + '_FULFILLED',
          addressId,
        });
      } else {
        const errorMessage = this.getParsedAPIError(response);
        dispatch({
          type: ACTION_TYPE + '_REJECTED',
          error: errorMessage,
        });
        toast.error('Request Error: ' + errorMessage);
      }

    } catch (error) {
      dispatch({
        type: ACTION_TYPE + '_REJECTED',
        error,
      });
      toast.error('Unexpected Error: ' + error.message);
    }
  }

  public static async updateAddress(ACTION_TYPE: string,
                                    dispatch: Function,
                                    addressId: string,
                                    customerId: string,
                                    payload: IAddressItem): Promise<void> {
    try {
      const token = await RefreshTokenService.getActualToken(dispatch);
      setAuthToken(token);

      const body: IRequestUpdateAddressBody = {
        data: {
          type: 'addresses',
          id: addressId,
          attributes: payload,
        },
      };

      const response: IApiResponseData = await api.patch(
        `customers/${customerId}/addresses/${addressId}`, body, {withCredentials: true},
      );

      if (response.ok) {
        dispatch({
          type: ACTION_TYPE + '_FULFILLED',
          payloadFulfilled: {
            addressId,
            data: response.data.data.attributes,
          }
        });
        toast.success(addressUpdate);
      } else {
        const errorMessage = this.getParsedAPIError(response);
        dispatch({
          type: ACTION_TYPE + '_REJECTED',
          error: errorMessage,
        });
        toast.error('Request Error: ' + errorMessage);
      }

    } catch (error) {
      dispatch({
        type: ACTION_TYPE + '_REJECTED',
        error,
      });
      toast.error('Unexpected Error: ' + error.message);
    }
  }
}
