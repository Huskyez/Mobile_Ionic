
import axios from 'axios'
import { getLogger } from '../../utils/logger';


const log = getLogger('itemApi');

const BASE_URL = "localhost:3000";
const API_URL = `http://${BASE_URL}/item`;


interface ResponseProps<T> {
    data: T;
}

function withLogs<T>(promise: Promise<ResponseProps<T>>, fnName: string): Promise<T> {
    log(`${fnName} - started`);
    return promise
        .then(res => {
            log(`${fnName} - succeeded`);
            return Promise.resolve(res.data);
        })
        .catch(err => {
            log(`${fnName} - failed`);
            return Promise.reject(err);
        });
}

const config = {
    headers: {
        'Content-Type': 'application/json'
    }
};

export const getItems: () => Promise<ItemProps[]> = () => {
    return withLogs(axios.get(API_URL, config), 'GetItems');
}

export const createItem: (item: ItemProps) => Promise<ItemProps> = item => {
    return withLogs(axios.post(API_URL, item, config), 'CreateItem');
}

export const updateItem: (item: ItemProps) => Promise<ItemProps> = item => {
    return withLogs(axios.put(`${API_URL}/${item.id}`, item, config), 'UpdateItem');
}

interface MessageData {
    event: string;
    payload: {
        item: ItemProps;
    };
}

export const itemWebSocket = (onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://${BASE_URL}`)
    ws.onopen = () => {
        log('web socket onopen');
    };
    ws.onclose = () => {
        log('web socket onclose');
    };
    ws.onerror = error => {
        log('web socket onerror', error);
    };
    ws.onmessage = messageEvent => {
        log('web socket onmessage');
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
        ws.close();
    }
}