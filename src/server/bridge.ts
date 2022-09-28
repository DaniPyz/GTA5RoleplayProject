import { install } from '../ui/src/bridge';
import rpc from 'rage-rpc';

export const Service = install(rpc, 'server');
