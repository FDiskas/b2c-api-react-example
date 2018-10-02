import {IReduxState} from "../../typings/app";

export const getReducerPartFulfilled = (): IReduxState => ({
    error: false,
    pending: false,
    fulfilled: true,
    rejected: false,
});

export const getReducerPartPending = (): IReduxState => ({
  error: false,
  pending: true,
  fulfilled: false,
  rejected: false,
});

export const getReducerPartRejected = (errorMessage: string): IReduxState => ({
  error: errorMessage,
  pending: false,
  fulfilled: false,
  rejected: true,
});