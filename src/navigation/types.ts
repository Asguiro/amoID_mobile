import type { NavigatorScreenParams } from '@react-navigation/native';
import {
  AUTH_ROUTES,
  MAIN_STACK_ROUTES,
  ROOT_ROUTES,
  type AuthRouteName,
  type MainStackRouteName,
  type RootRouteName,
} from '../constants/routes';
import type {
  EnrollmentStackParamList,
  TemporaryQrStackParamList,
} from './flow-types';

export type AuthStackParamList = {
  [AUTH_ROUTES.LOGIN]: undefined;
};

export type MainStackParamList = {
  [MAIN_STACK_ROUTES.HOME]: undefined;
  [MAIN_STACK_ROUTES.BENEFICIARIES]: undefined;
  [MAIN_STACK_ROUTES.BENEFICIARY_DETAIL]: { beneficiaryId: string };
  [MAIN_STACK_ROUTES.VERIFICATION]: undefined;
  [MAIN_STACK_ROUTES.ENROLLMENT]: NavigatorScreenParams<EnrollmentStackParamList> | undefined;
  [MAIN_STACK_ROUTES.TEMPORARY_QR]:
    | NavigatorScreenParams<TemporaryQrStackParamList>
    | undefined;
  [MAIN_STACK_ROUTES.AUDIT]: undefined;
  [MAIN_STACK_ROUTES.PROFILE]: undefined;
};

export type RootStackParamList = {
  [ROOT_ROUTES.AUTH]: NavigatorScreenParams<AuthStackParamList> | undefined;
  [ROOT_ROUTES.MAIN]: NavigatorScreenParams<MainStackParamList> | undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type { AuthRouteName, MainStackRouteName, RootRouteName };
