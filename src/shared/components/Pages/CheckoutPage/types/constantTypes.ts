import {IRadioItem} from "src/shared/components/UI/SprykerForm/types";
import {IMenuItemSelect} from "src/shared/components/UI/SprykerSelect/types";
import {IPaymentMethod, IShipmentMethod} from "src/shared/interfaces/checkout/index";
import {IAddressItem} from "src/shared/interfaces/addresses/index";

export interface ICheckoutFormsNames {
  billing: string;
  delivery: string;
  invoice: string;
  creditCard: string;
  savedDelivery: string;
  sameAsDeliveryForm: string;
  savedBilling: string;
  shipmentMethodBase: string;
  paymentMethod: string;
}

export interface ICheckoutPaymentMethodsNames {
  invoice: string;
  creditCard: string;
}

export interface IPaymentMethodsGrouped {
  [key: string]: Array<IPaymentMethod>;
}

export type TPaymentProvidersCollection = Array<IMenuItemSelect>;

export interface IPaymentMethodGroupItem extends IRadioItem {}

export interface IShipmentMethodsGrouped {
  [key: string]: Array<IShipmentMethod>;
}

export interface ICheckoutSelectionInputs {
  isAddNewDeliveryValue: string;
  isAddNewBillingValue: string;
  isSameAsDeliveryValue: string;
}

// Can be moved
export type TAddressType = 'delivery' | 'billing';

export type TExtraOptionsToSelection = Array<IRadioItem> | null;

export type TCurrentValueDeliverySelection = ICheckoutSelectionInputs["isAddNewDeliveryValue"]
                                             | IAddressItem["id"]
                                             | null;

export type TCurrentValueBillingSelection = ICheckoutSelectionInputs["isAddNewBillingValue"]
                                            | ICheckoutSelectionInputs["isSameAsDeliveryValue"]
                                            | IAddressItem["id"]
                                            | null;