import { writable } from 'svelte/store';
import type { _tab, _chatbox } from './Interface';
const io = require('socket.io-client');

import Admin from './Admin';
import Cognito from './Cognito';
import Dynamo from './Dynamodb';
import Store from './Storage';

export const server = writable(io('http://localhost:4000', {transports: ['websocket'], upgrade: false}));

export const $admin = new Admin();
export const admin = writable($admin);
export const cognito = writable(new Cognito());
export const $dynamo = new Dynamo();
export const dynamo = writable($dynamo);
export const s3 = writable(new Store());
export const isAuth = writable(false);

export const organForm = writable(false);
export const postForm = writable(false);
export const eventForm = writable(false);
export const userForm = writable(false);
export const comForm = writable(false);
export const userCard = writable(false);

let _t:_tab[] = [];
let _cb:_chatbox[] = [];
let activeTabs:number[] = []

export const tabs = writable(_t);
export const chatboxes = writable(_cb);
export const activeTabValue = writable(1);
export const activeChatBox = writable(activeTabs);
export const online = writable(new Set());