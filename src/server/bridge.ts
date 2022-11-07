import * as rpc from '../shared/lib/rpc';

import type { ClientServices } from '../client/services';
import { createClientProxy } from '../ui/src/bridge/proxy';
import { install } from '../ui/src/bridge';

export const Service = install(rpc, 'server');

