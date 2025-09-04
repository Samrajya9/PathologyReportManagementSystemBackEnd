import { AppAuthenticatedUser } from './express';

interface AppJwtPayloadBase extends AppAuthenticatedUser {}

export type AppJwtPayload<T extends object = {}> = AppJwtPayloadBase & T;
