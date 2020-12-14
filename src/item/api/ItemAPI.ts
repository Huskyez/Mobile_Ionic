
import axios from 'axios'
import {getLogger, withLogs} from '../../utils/logger';
import {authConfig, BASE_URL} from "../../utils/api";


const log = getLogger('itemApi');

const API_URL = `http://${BASE_URL}/api/item`;


export const getItems: (token: string) => Promise<ItemProps[]> = (token) => {
    return withLogs(axios.get(API_URL, authConfig(token)), 'GetItems');
}

export const createItem: (item: ItemProps, token: string) => Promise<ItemProps> = (item, token) => {
    return withLogs(axios.post(API_URL, item, authConfig(token)), 'CreateItem');
}

export const updateItem: (item: ItemProps, token: string) => Promise<ItemProps> = (item, token) => {
    return withLogs(axios.put(`${API_URL}/${item._id}`, item, authConfig(token)), 'UpdateItem');
}

interface MessageData {
    event: string;
    payload: {
        item: ItemProps;
    };
}

// export const itemWebSocket = (onMessage: (data: MessageData) => void) => {
//     const ws = new WebSocket(`ws://${BASE_URL}`)
//     ws.onopen = () => {
//         log('web socket onopen');
//     };
//     ws.onclose = () => {
//         log('web socket onclose');
//     };
//     ws.onerror = error => {
//         log('web socket onerror', error);
//     };
//     ws.onmessage = messageEvent => {
//         log('web socket onmessage');
//         onMessage(JSON.parse(messageEvent.data));
//     };
//     return () => {
//         ws.close();
//     }
// }