import { authMode } from '../constants';

export type AuthModeType = typeof authMode[keyof typeof authMode];
