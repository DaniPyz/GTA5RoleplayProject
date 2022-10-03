import { install } from '../ui/src/bridge';
import * as rpc from '../shared/lib/rpc';

export const Service = install(rpc, 'client');
