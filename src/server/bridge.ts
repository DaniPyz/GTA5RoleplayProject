import { install } from '../ui/src/bridge';
import * as rpc from 'rage-rpc';

export const Service = install(rpc, 'server');
