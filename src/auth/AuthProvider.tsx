import {getLogger} from "../utils/logger";
import React, {useCallback, useEffect, useState} from "react";
import PropTypes from "prop-types";
import {login} from "./AuthApi";
import {getToken, saveToken} from "./TokenStorage";

const log = getLogger('AuthProvider')

type loginFunction = (username?: string, password?: string) => void

type logoutFunc = () => void

export interface AuthState {
    authError: Error | null
    isAuthenticated: boolean
    authenticating: boolean
    login?: loginFunction
    pending?: boolean
    username?: string
    password?: string
    token: string
    logout?: logoutFunc
}

const initialState: AuthState = {
    isAuthenticated: false,
    authenticating: false,
    authError: null,
    pending: false,
    token: '',
}

export const AuthContext = React.createContext<AuthState>(initialState)

interface AuthProviderProps {
    children: PropTypes.ReactNodeLike
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {

    const [state, setState] = useState<AuthState>(initialState)
    const { isAuthenticated, authenticating, authError, pending, token } = state

    useEffect(verifyTokenEffect, [])

    const loginFunc = useCallback<loginFunction>(loginCallback, [])
    const logoutFunc = useCallback<logoutFunc>(logoutCallback, [])

    useEffect(authEffect, [pending])

    const value = { isAuthenticated, authenticating, authError, token, login: loginFunc, logout: logoutFunc}
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )

    function logoutCallback() : void {
        log('Logout')
        setState({...state, isAuthenticated: false, token: ''})
    }

    // changes the state after login
    function loginCallback(username?: string, password?: string) : void {
        log('Login Function')
        setState({...state, pending: true, username: username, password: password})
    }

    function verifyTokenEffect() {
        log('verify token effect')
        getToken().then(
            token => {
                log(`value of token in storage: ${token}`)
                if (token != null && token !== '') {
                    setState({...state, isAuthenticated: true, token: token})
                }
            })
    }

    function authEffect() {
        let canceled = false

        authenticate().then()
        return () => { canceled = true }

        async function authenticate() {
            if (!pending) {
                log('not pending')
                return
            }
            try {
                log('authenticating...')
                setState({...state, authenticating: true})

                const { username, password } = state
                const token = await login(username, password).then(p => p.token)
                if (canceled) {
                    return
                }
                log(`successful authentication token=${token}`)
                await saveToken(token)
                setState( {...state, token: token, pending: false, isAuthenticated: true, authenticating: false })
            } catch (error) {
                if (canceled) {
                    return;
                }
                log('failed authentication')
                setState({...state, authenticating: false, isAuthenticated: false, authError: error})
            }
        }
    }


}