import { SetMetadata } from '@nestjs/common';
import { AuthType } from '../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../../auth.constants';

export const Auth = (...authType: AuthType[]) => SetMetadata(AUTH_TYPE_KEY, authType);
