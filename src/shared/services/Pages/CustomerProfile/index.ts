import api, { setAuthToken } from 'src/shared/services/api';
import { toast } from 'react-toastify';
import * as CustomerProfileActions from '@stores/actions/pages/customerProfile';
import {
  ICustomerDataParsed,
  ICustomerProfileIdentity,
  ICustomerProfilePassword,
  TCustomerReference,
} from 'src/shared/interfaces/customer';
import { parseCustomerDataResponse } from 'src/shared/helpers/customer/customerDataResponse';
import { RefreshTokenService } from 'src/shared/services/Common/RefreshToken';
import { CustomerProfileAuthenticateErrorMessage } from 'src/shared/translation/index';
import { ApiServiceAbstract } from 'src/shared/services/apiAbstractions/ApiServiceAbstract';
import { logout } from '@stores/actions/pages/login';
import {IApiResponseData} from "src/shared/services/types";

interface IRequestBody {
  data: {
    type: string;
    id?: TCustomerReference;
    include?: string;
    attributes: ICustomerProfileIdentity | ICustomerProfilePassword;
  };
}

export class CustomerProfileService extends ApiServiceAbstract {
  private static getCustomersEndpoint = (customerReference: TCustomerReference) => (`/customers/${customerReference}`);

  // Retrieve customer data.
  public static async getProfileData(dispatch: Function, customerReference: TCustomerReference): Promise<void> {
    try {
      dispatch(CustomerProfileActions.getCustomerProfilePendingStateAction());

      const token = await RefreshTokenService.getActualToken(dispatch);
      if (!token) {
        throw new Error(CustomerProfileAuthenticateErrorMessage);
      }
      setAuthToken(token);
      const response: IApiResponseData = await api.get(
        this.getCustomersEndpoint(customerReference),
        {include: ''},
        {withCredentials: true},
      );

      if (response.ok) {
        const responseParsed: ICustomerDataParsed | null = parseCustomerDataResponse(response.data);
        dispatch(CustomerProfileActions.getCustomerProfileFulfilledStateAction(responseParsed));
      } else {
        const errorMessage = this.getParsedAPIError(response);
        dispatch(CustomerProfileActions.getCustomerProfileRejectedStateAction(errorMessage));
        toast.error('Request Error: ' + errorMessage);
      }

    } catch (error) {
      dispatch(CustomerProfileActions.getCustomerProfileRejectedStateAction(error.message));
      toast.error('Unexpected Error: ' + error.message);
    }
  }

  // Update customer data
  public static async updateProfileData(dispatch: Function,
                                        customerReference: TCustomerReference,
                                        payload: ICustomerProfileIdentity): Promise<void> {
    try {
      dispatch(CustomerProfileActions.updateCustomerProfilePendingStateAction());

      const body: IRequestBody = {
        data: {
          type: 'customers',
          id: customerReference,
          attributes: payload,
          include: '',
        },
      };

      const token = await RefreshTokenService.getActualToken(dispatch);
      if (!token) {
        throw new Error(CustomerProfileAuthenticateErrorMessage);
      }
      setAuthToken(token);
      const response: IApiResponseData = await api.patch(
        this.getCustomersEndpoint(customerReference),
        body,
        {withCredentials: true},
      );

      if (response.ok) {
        const responseParsed: ICustomerDataParsed = parseCustomerDataResponse(response.data);
        dispatch(CustomerProfileActions.updateCustomerProfileFulfilledStateAction(responseParsed));
        toast.success('Your Profile Data was successfully updated!');
      } else {
        const errorMessage = this.getParsedAPIError(response);
        dispatch(CustomerProfileActions.updateCustomerProfileRejectedStateAction(errorMessage));
        toast.error('Request Error: ' + errorMessage);
      }

    } catch (error) {
      dispatch(CustomerProfileActions.updateCustomerProfileRejectedStateAction(error.message));
      toast.error('Unexpected Error: ' + error);
    }
  }

  // Update customer password.
  public static async updatePasswordData(dispatch: Function,
                                         customerReference: TCustomerReference,
                                         payload: ICustomerProfilePassword): Promise<void> {
    try {
      dispatch(CustomerProfileActions.updateCustomerPasswordPendingStateAction());

      const body: IRequestBody = {
        data: {
          type: 'customer-password',
          attributes: payload,
        },
      };

      const token: string = await RefreshTokenService.getActualToken(dispatch);
      if (!token) {
        throw new Error(CustomerProfileAuthenticateErrorMessage);
      }
      setAuthToken(token);
      const response: IApiResponseData = await api.patch(`customer-password`, body, {withCredentials: true});

      if (response.ok) {
        dispatch(CustomerProfileActions.updateCustomerPasswordFulfilledStateAction());
        toast.success('Your Password was successfully updated!');
      } else {
        const errorMessage = this.getParsedAPIError(response);
        dispatch(CustomerProfileActions.updateCustomerPasswordRejectedStateAction(errorMessage));
        toast.error('Request Error: ' + errorMessage);
      }

    } catch (error) {
      dispatch(CustomerProfileActions.updateCustomerPasswordRejectedStateAction(error.message));
      toast.error('Unexpected Error: ' + error);
    }
  }

  // Delete Customer Profile - Anonymize customers.
  public static async deleteCustomerEntity(dispatch: Function, customerReference: TCustomerReference): Promise<void> {
    try {
      dispatch(CustomerProfileActions.deleteCustomerPendingStateAction());

      const token = await RefreshTokenService.getActualToken(dispatch);
      if (!token) {
        throw new Error(CustomerProfileAuthenticateErrorMessage);
      }
      setAuthToken(token);
      const endpoint = `customers/${customerReference}`;
      const response: IApiResponseData = await api.delete(endpoint, null, {withCredentials: true});

      if (response.ok) {
        dispatch(logout());
        dispatch(CustomerProfileActions.deleteCustomerFulfilledStateAction());
        toast.success('Your account was deleted!');
      } else {
        const errorMessage = this.getParsedAPIError(response);
        dispatch(CustomerProfileActions.deleteCustomerRejectedStateAction(errorMessage));
        toast.error('Request Error: ' + errorMessage);
      }

    } catch (error) {
      console.error('deleteCustomerEntity error', error);
      dispatch(CustomerProfileActions.deleteCustomerRejectedStateAction(error.message));
      toast.error('Unexpected Error: ' + error);
    }
  }
}
