import {getLogger} from "../utils/logger";
import React, {useContext, useState} from "react";
import {RouteComponentProps} from "react-router";
import {AuthContext} from "./AuthProvider";
import {Redirect} from "react-router-dom";
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonLoading, IonButton} from "@ionic/react";


const log = getLogger('LoginPage')

interface LoginState {
    username?: string
    password?: string
}

export const LoginPage: React.FC<RouteComponentProps> = ({history}) => {

    const { isAuthenticated, authenticating, login, authError } = useContext(AuthContext)

    const [state, setState] = useState<LoginState>({})

    const { username, password } = state

    const handleLogin = (): void => {
        log(`handleLogin ${login}`)
        if (login) {
            login(username, password)
        }
    }
    if (isAuthenticated) {
        return <Redirect to={'/'} />
    }

    return (
        <IonPage>
            <IonHeader>
               <IonToolbar>
                   <IonTitle>Login Page</IonTitle>
               </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonInput
                    placeholder="Username"
                    value={username}
                    onIonChange={e => setState({...state, username: e.detail.value || ''})}
                />
                <IonInput
                    placeholder="Password"
                    type="password"
                    value={password}
                    onIonChange={e => setState({...state, password: e.detail.value || ''})}
                />
                <IonLoading isOpen={authenticating}/>
                {authError && (
                    <div>{authError.message || 'Failed to authenticate'}</div>
                )}
                <IonButton onClick={handleLogin}>Sign In</IonButton>
            </IonContent>
        </IonPage>
    )
}