import {Plugins} from "@capacitor/core";
import {getLogger} from "../../utils/logger";


const log = getLogger('ItemStorage')

const { Storage } = Plugins

export const insertItem = async (item: ItemProps) =>  {
    log(`insert item: ${item}`)
    if (item._id) {
        await Storage.set({key: item._id, value: JSON.stringify(item)})
    }
}

export const insertAll = async (items: ItemProps[]) => {
    for (let i = 0; i < items.length; i++) {
        await insertItem(items[i])
    }
}

export const findItem = async (id: string): Promise<ItemProps | null> => {
    log(`get item id: ${id}`)

    let item = undefined
    const result = await Storage.get({key: id})
    if (result.value) {
        item = JSON.parse(result.value)
        return item
    }
    return null
}

export const findItems = async (): Promise<ItemProps[]> => {
    let items: ItemProps[] = []
    const { keys } = await Storage.keys()

    for (let i = 0; i < keys.length; i++) {
        const item  = await findItem(keys[i])
        if (item != null) {
            items.push(item)
        }
    }
    return items
}

export const removeItem = async (id: string) => {
    await Storage.remove({key: id})
}

export const clearItems = async() => {
    await Storage.clear()
}

