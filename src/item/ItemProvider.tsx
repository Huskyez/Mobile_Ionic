
import React, {useCallback, useContext, useEffect, useReducer} from "react";
import {createItem, getItems, updateItem} from "./api/ItemAPI";
import {getLogger} from "../utils/logger";
import PropTypes from 'prop-types';
import {AuthContext} from "../auth/AuthProvider";
import {insertAll, insertItem, findItems, findItem, clearItems} from "./local/ItemStorage";

const log = getLogger('ItemProvider');


type SaveItemFunc = (item: ItemProps) => Promise<any>;

export interface ItemsState {
    items? : ItemProps[],
    fetching : boolean,
    fetchingError : Error | null,
    saving : boolean,
    savingError : Error | null,
    saveFunc? : SaveItemFunc
}

interface ActionProps {
    type : string;
    payload? : any;
}

const initialState : ItemsState = {
    fetching: false,
    saving: false,
    fetchingError: null,
    savingError: null
};

const FETCH_ITEMS_STARTED = 'FETCH_ITEMS_STARTED';
const FETCH_ITEMS_SUCCEEDED = 'FETCH_ITEMS_SUCCEEDED';
const FETCH_ITEMS_FAILED = 'FETCH_ITEMS_FAILED';
const SAVE_ITEM_STARTED = 'SAVE_ITEM_STARTED';
const SAVE_ITEM_SUCCEEDED = 'SAVE_ITEM_SUCCEEDED';
const SAVE_ITEM_FAILED = 'SAVE_ITEM_FAILED';

const reducer: (state: ItemsState, action: ActionProps) => ItemsState = (state, { type, payload }) => {

    switch (type) {
            case FETCH_ITEMS_STARTED:
                return { ...state, fetching: true, fetchingError: null };
            case FETCH_ITEMS_SUCCEEDED:
                return { ...state, items: payload.items, fetching: false };
            case FETCH_ITEMS_FAILED:
                return { ...state, items: payload.items, fetchingError: payload.error, fetching: false };
            case SAVE_ITEM_STARTED:
                return { ...state, savingError: null, saving: true };
            case SAVE_ITEM_SUCCEEDED:
                const items = [...(state.items || [])];
                const item = payload.item;
                const index = items.findIndex(it => it._id === item._id);
                if (index === -1) {
                    items.splice(0, 0, item);
                } else {
                    items[index] = item;
                }
                return { ...state, items, saving: false };
            case SAVE_ITEM_FAILED:
                return { ...state, savingError: payload.error, saving: false };
            default:
                return state;
        }
    };

export const ItemContext = React.createContext<ItemsState>(initialState);

interface ItemProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const ItemProvider: React.FC<ItemProviderProps> = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const { items, fetching, fetchingError, saving, savingError } = state;

    const { token }  = useContext(AuthContext)

    useEffect(getItemsEffect, [token]);
    // useEffect(wsEffect, []);

    const saveCallback = useCallback<SaveItemFunc>(saveItemCallback, [token]);

    const value = { items, fetching, fetchingError, saving, savingError, saveFunc: saveCallback };

    // log(`value: ${value.saveFunc}`);

    return (
        <ItemContext.Provider value={value}>
            {children}
        </ItemContext.Provider>
    );

    function getItemsEffect() {
        let canceled = false;
        fetchItems().then()
        return () => {
            canceled = true;
        }

        async function fetchItems() {
            try {
                log('fetchItems started');
                dispatch({ type: FETCH_ITEMS_STARTED });
                const items = await getItems(token);

                await clearItems()
                await insertAll(items)

                log(`fetchItems succeeded\n ${items}`);
                if (!canceled) {
                    dispatch({ type: FETCH_ITEMS_SUCCEEDED, payload: { items: await findItems() } });
                }
            } catch (error) {
                log('fetchItems failed');
                dispatch({ type: FETCH_ITEMS_FAILED, payload: { error: error, items: await findItems() } });
            }
        }
    }

    async function saveItemCallback(item: ItemProps) {
        try {
            log('saveItem started');
            dispatch({ type: SAVE_ITEM_STARTED });
            const savedItem = await (item._id ? updateItem(item, token) : createItem(item, token));

            await insertItem(savedItem)

            log('saveItem succeeded');
            dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item: savedItem } });
        } catch (error) {
            log('saveItem failed');
            dispatch({ type: SAVE_ITEM_FAILED, payload: { error } });
        }
    }

    // function wsEffect() {
    //     let canceled = false;
    //     log('wsEffect - connecting');
    //     const closeWebSocket = itemWebSocket(message => {
    //         if (canceled) {
    //             return;
    //         }
    //         const { event, payload: { item }} = message;
    //         log(`ws message, item ${event}`);
    //         if (event === 'created' || event === 'updated') {
    //             dispatch({ type: SAVE_ITEM_SUCCEEDED, payload: { item } });
    //         }
    //     });
    //     return () => {
    //         log('wsEffect - disconnecting');
    //         canceled = true;
    //         closeWebSocket();
    //     }
    // }
};