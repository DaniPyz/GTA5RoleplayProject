import * as rpc from '../shared/lib/rpc';

import type { ServerServices } from '../server/services';
import { createServerProxy } from '../ui/src/bridge/proxy';
import { install } from '../ui/src/bridge';

export const Service = install(rpc, 'client');
export const server = createServerProxy<ServerServices>(rpc);
