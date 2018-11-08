import {
  TCustomerFirstName,
  TCustomerLastName,
  TCustomerSalutation
} from "src/shared/interfaces/customer/index";
import {
  TAddress,
  TAddressCity,
  TAddressCompany,
  TAddressCountry,
  TAddressPhone,
  TAddressZipCode,
  TIso2Code
} from "src/shared/interfaces/addresses/index";

export interface IShippingAddress {
  firstName: TCustomerFirstName;
  lastName: TCustomerLastName;
  salutation: TCustomerSalutation;
  address1: TAddress;
  address2: TAddress;
  address3?: TAddress;
  zipCode: TAddressZipCode;
  city: TAddressCity;
  country: TAddressCountry;
  company?: TAddressCompany;
  phone?: TAddressPhone;
  iso2Code: TIso2Code;
}
