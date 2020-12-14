import axios from "axios";
import {BASE_URL} from "../utils/api";
import {withLogs} from "../utils/logger";

const AUTH_URL = `http://${BASE_URL}/api/auth/login`

export interface AuthProps {
    token: string
}

export const login: (username? : string, password? : string) => Promise<AuthProps> = ((username, password) => {
    return withLogs(axios.post(AUTH_URL, {username, password}), 'login')
})