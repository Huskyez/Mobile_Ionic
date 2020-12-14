export const BASE_URL = "localhost:3000"

export interface ResponseProps<T> {
    data: T
}

export const authConfig = (token? : String) => ({
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    }
})