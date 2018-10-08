
import {
  IOrderCollectionParsed,
  IOrderCollectionResponse,
  IOrderItem,
  IOrderItemResponse,
} from "../../interfaces/order/index";


export const parseGetOrdersCollectionResponse = (data: IOrderCollectionResponse): IOrderCollectionParsed | null => {
  console.log('parseGetOrdersCollectionResponse: data', data);
  if (!Array.isArray(data.data) || !data.data.length) {
    return null;
  }

  const items = data.data.map((item: IOrderItemResponse): IOrderItem => (
    {
      id: item.id,
      dateCreated: item.attributes.createdAt,
      currency: item.attributes.currencyIsoCode,
      totals: item.attributes.totals,
    }
  ));

  const response = {
    items,
  };
  console.log('parseGetOrdersCollectionResponse: response', response);
  return response;
};
