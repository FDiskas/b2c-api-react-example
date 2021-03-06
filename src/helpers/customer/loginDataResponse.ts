import { ICustomerLoginDataParsed, TCustomerId } from '@interfaces/customer';
import { TAccessToken } from '@interfaces/login';
import jwtDecoder from 'jwt-decode';

interface ICustomerLoginDataResponse {
    data: {
        attributes: {
            accessToken: TAccessToken;
            expiresIn: number;
            refreshToken: TAccessToken;
            tokenType: string;
        },
        id: TCustomerId | null;
    };
}

export const parseLoginDataResponse = (response: ICustomerLoginDataResponse): ICustomerLoginDataParsed => {
    if (!response) {
        return null;
    }

    const {data: {attributes}}: ICustomerLoginDataResponse = response;
    const {sub}: { sub: string } = jwtDecoder(attributes.accessToken);
    const customerRef = JSON.parse(sub).customer_reference;

    const result = {
        accessToken: attributes.accessToken,
        expiresIn: attributes.expiresIn,
        refreshToken: attributes.refreshToken,
        tokenType: attributes.tokenType,
        customerRef,
    };

    return result;
};
