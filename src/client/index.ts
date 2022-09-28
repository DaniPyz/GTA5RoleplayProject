import { createClientProxy } from '../ui/src/bridge/proxy';
import rpc from 'rage-rpc';

const proxy = createClientProxy(rpc);

proxy;
