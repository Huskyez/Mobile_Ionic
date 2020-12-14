import {ResponseProps} from "./api";

export const getLogger: (tag: string) => (...args: any) => void =
    tag => (...args) => console.log(tag, ...args);


const log = getLogger('api')

export function withLogs<T>(promise: Promise<ResponseProps<T>>, funcName: String) : Promise<T> {
    log(`${funcName} - started`);
    return promise
        .then(res => {
            log(`${funcName} - succeeded`);
            return Promise.resolve(res.data);
        })
        .catch(err => {
            log(`${funcName} - failed`);
            return Promise.reject(err);
        });
}