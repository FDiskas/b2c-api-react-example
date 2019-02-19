import api from 'src/shared/services/api';
import { parseCatalogSearchResponse } from 'src/shared/helpers/catalog/catalogSearchResponse';
import { ApiServiceAbstract } from 'src/shared/services/apiAbstractions/ApiServiceAbstract';
import { IProductCard } from 'src/shared/interfaces/product';
import { ISearchQuery } from 'src/shared/interfaces/searchPageData';
import { IApiResponseData } from 'src/shared/services/types';
import { TRowProductResponseIncluded } from 'src/shared/helpers/product/types';
import { NotificationsMessage } from '@components/components/Notifications/NotificationsMessage';
import { typeNotificationError } from 'src/shared/constants/notifications';
import {
    sendSearchPendingState,
    sendSearchRejectState,
    sendSearchFulfilledState,
    suggestPendingState,
    suggestRejectState,
    suggestFullfiledState
} from '@stores/actions/pages/search';

export class CatalogService extends ApiServiceAbstract {
    public static async catalogSearch(dispatch: Function, params: ISearchQuery): Promise<void> {
        dispatch(sendSearchPendingState());
        try {
            params.include = 'abstract-products,product-labels,';
            const response: IApiResponseData = await api.get('catalog-search', params, {withCredentials: true});

            if (response.ok) {
                const responseParsed = parseCatalogSearchResponse(response.data);
                dispatch(sendSearchFulfilledState(responseParsed, params.q));
            } else {
                const errorMessage = this.getParsedAPIError(response);
                dispatch(sendSearchRejectState(errorMessage));
                NotificationsMessage({
                    messageWithCustomText: 'request.error.message',
                    message: errorMessage,
                    type: typeNotificationError
                });
            }

        } catch (error) {
            dispatch(sendSearchRejectState(error.message));
            NotificationsMessage({
                messageWithCustomText: 'unexpected.error.message',
                message: error.message,
                type: typeNotificationError
            });
        }
    }

    public static async catalogSuggestion(dispatch: Function, query: string): Promise<void> {
        dispatch(suggestPendingState());
        try {

            const response: IApiResponseData = await api.get(
                'catalog-search-suggestions',
                {q: query, include: 'abstract-products,abstract-product-prices'},
                {withCredentials: true}
            );

            if (response.ok) {
                const {data} = response;

                const products: IProductCard[] = data.data[0].attributes.abstractProducts.slice(0, 4);
                let counter = 0;

                data.included && data.included.some((row: TRowProductResponseIncluded) => {
                    if (row.type === 'abstract-product-prices') {
                        const product: IProductCard = products.find(
                            (prod: IProductCard) => prod.abstractSku === row.id
                        );

                        if (product && row.attributes.prices && row.attributes.prices.length) {
                            counter++;
                            product.prices = row.attributes.prices;
                        }
                    }

                    return counter >= 4;
                });

                const payloadSuggestionFulfilled = {
                    suggestions: products,
                    categories: data.data[0].attributes.categories,
                    completion: data.data[0].attributes.completion
                };

                dispatch(suggestFullfiledState(payloadSuggestionFulfilled));
            } else {
                const errorMessage = this.getParsedAPIError(response);
                dispatch(suggestRejectState(errorMessage));
                NotificationsMessage({
                    messageWithCustomText: 'request.error.message',
                    message: errorMessage,
                    type: typeNotificationError
                });

                return null;
            }
        } catch (error) {
            dispatch(suggestRejectState(error.message));
            NotificationsMessage({
                messageWithCustomText: 'unexpected.error.message',
                message: error.message,
                type: typeNotificationError
            });
        }
    }
}
