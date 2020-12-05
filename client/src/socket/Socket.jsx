import io from 'socket.io-client'
import {URL_ENDPOINT} from '../URL.ENDPOINT'
export const socket = io(URL_ENDPOINT);
