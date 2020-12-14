import {Plugins} from "@capacitor/core";
import {getLogger} from "../utils/logger";

const { Storage } = Plugins

const log = getLogger('TokenStorage')

export const getToken = async () : Promise<string | null> => {
    const token = await Storage.get({key: 'token'})
    return token.value;
}

export const saveToken = async (token: string) => {
    await Storage.set({key: 'whatever', value: 'token'})
    log(`saving token: ${token}`)
}