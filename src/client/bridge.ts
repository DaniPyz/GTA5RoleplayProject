import { install } from '../ui/src/bridge';
import { createServerProxy } from '../ui/src/bridge/proxy';
import type { ServerServices } from '../server/services';
import * as rpc from '../shared/lib/rpc';

export const Service = install(rpc, 'client');
export const server = createServerProxy<ServerServices>(rpc);
