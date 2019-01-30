import api, { setAuthToken } from 'src/shared/services/api';
import { RefreshTokenService } from 'src/shared/services/Common/RefreshToken';
import { ICheckoutRequest, IcheckoutResponse, IShipmentMethod, IPaymentMethod } from 'src/shared/interfaces/checkout';
import {
    getCheckoutDataInitPendingStateAction,
    getCheckoutDataInitRejectedStateAction,
    getCheckoutDataInitFulfilledStateAction,
    sendCheckoutDataPendingStateAction,
    sendCheckoutDataRejectedStateAction,
    sendCheckoutDataFulfilledStateAction,
} from '@stores/actions/pages/checkout';

import { ApiServiceAbstract } from 'src/shared/services/apiAbstractions/ApiServiceAbstract';
import { ICheckoutResponseData } from 'src/shared/stores/reducers/pages/checkout/types';
import { IApiResponseData } from 'src/shared/services/types';
import { NotificationsMessage } from '@components/Common/Notifications/NotificationsMessage';
import {
    typeMessageSuccess,
    typeMessageError
} from 'src/shared/constants/notifications';

interface IRequestBody {
    data: {
        type: string;
        include?: string;
        attributes: ICheckoutRequest;
    };
}

export class CheckoutService extends ApiServiceAbstract {
    public static async getCheckoutData(
        dispatch: Function,
        payload: ICheckoutRequest,
        anonymId: string
    ): Promise<void> {
        try {
            let headers: { withCredentials: boolean, headers?: {} };

            if (anonymId) {
                headers = {withCredentials: true, headers: {'X-Anonymous-Customer-Unique-Id': anonymId}};
            } else {
                const token = await RefreshTokenService.getActualToken(dispatch);
                setAuthToken(token);
                headers = {withCredentials: true};
            }

            const body: IRequestBody = {
                data: {
                    type: 'checkout-data',
                    attributes: payload,
                }
            };

            dispatch(getCheckoutDataInitPendingStateAction());

            const response: IApiResponseData = await api.post('checkout-data', body, headers);

            if (response.ok) {
                const payload = CheckoutService.parseCheckoutData(response.data.data.attributes);
                dispatch(getCheckoutDataInitFulfilledStateAction(payload));
            } else {
                const errorMessage = this.getParsedAPIError(response);
                dispatch(getCheckoutDataInitRejectedStateAction(errorMessage));
                NotificationsMessage({
                    messageWithCustomText: 'request.error.message',
                    message: errorMessage,
                    type: typeMessageError
                });
            }

        } catch (error) {
            dispatch(getCheckoutDataInitRejectedStateAction(error.message));
            NotificationsMessage({
                messageWithCustomText: 'unexpected.error.message',
                message: error.message,
                type: typeMessageError
            });
        }
    }

    public static async sendOrderData(dispatch: Function, payload: ICheckoutRequest, anonymId: string): Promise<void> {
        try {
            let headers: { withCredentials: boolean, headers?: {} };

            if (anonymId) {
                headers = {withCredentials: true, headers: {'X-Anonymous-Customer-Unique-Id': anonymId}};
            } else {
                const token = await RefreshTokenService.getActualToken(dispatch);
                setAuthToken(token);
                headers = {withCredentials: true};
            }

            const body: IRequestBody = {
                data: {
                    type: 'checkout',
                    attributes: payload,
                }
            };

            dispatch(sendCheckoutDataPendingStateAction());

            const response: IApiResponseData = await api.post('checkout', body, headers);

            if (response.ok) {
                dispatch(sendCheckoutDataFulfilledStateAction(response.data.data.attributes.orderReference));
                NotificationsMessage({
                    id: 'order.successfully.created.message',
                    type: typeMessageSuccess
                });
            } else {
                const errorMessage = this.getParsedAPIError(response);
                dispatch(sendCheckoutDataRejectedStateAction(errorMessage));
                NotificationsMessage({
                    messageWithCustomText: 'request.error.message',
                    message: errorMessage,
                    type: typeMessageError
                });
            }

        } catch (error) {
            dispatch(sendCheckoutDataRejectedStateAction(error.message));
            NotificationsMessage({
                messageWithCustomText: 'unexpected.error.message',
                message: error.message,
                type: typeMessageError
            });
        }
    }

    private static parseCheckoutData(data: IcheckoutResponse): ICheckoutResponseData {
        const payments: IPaymentMethod[] = [];

        Array.isArray(data.paymentProviders) && data.paymentProviders.forEach(provider => {
            provider.paymentMethods.forEach(paymentMethod => {
                payments.push({
                    ...paymentMethod,
                    paymentProviderName: provider.paymentProviderName,
                });
            });
        });

        return ({
            payments,
            shipments: data.shipmentMethods.map((method: IShipmentMethod) => ({...method, id: method.id.toString()})),
            addressesCollection: Array.isArray(data.addresses) ? data.addresses : [],
        });
    }
}
