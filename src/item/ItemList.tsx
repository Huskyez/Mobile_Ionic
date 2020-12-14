import React, {useContext} from "react";
import {RouteComponentProps} from "react-router";
import {ItemContext} from "./ItemProvider";
import {getLogger} from "../utils/logger";
import { Item } from "./Item";

import {
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonList, IonLoading,
    IonPage,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonButton,
    IonButtons
} from "@ionic/react";
import {add} from "ionicons/icons";
import {useNetwork} from "../utils/useNetwork";
import {AuthContext} from "../auth/AuthProvider";
import {saveToken} from "../auth/TokenStorage";


const log = getLogger('ItemList');

const ItemList : React.FC<RouteComponentProps> = ({history}) => {

    const { networkStatus } = useNetwork()
    const { items, fetching, fetchingError } = useContext(ItemContext);

    const { logout } = useContext(AuthContext)

    log("render ItemList")
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>I hate js</IonTitle>
                    <IonLabel>
                        Network status: { JSON.stringify(networkStatus) }
                    </IonLabel>
                    <IonButtons slot="end">
                        <IonButton onClick={() => {logout && logout()}}>
                            Logout
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={fetching} message={"Fetching Items"}/>
                {items && (
                    <IonList>
                        {items.map(({_id, text, date, version}) =>
                            <Item key={_id} _id={_id} date={date} version={version} text={text} onEdit={id => history.push(`/item/${id}`)}/>)}
                    </IonList>)}
                {fetchingError && (
                    <div>{fetchingError.message || "Failed to fetch items"}</div>
                )}
            </IonContent>
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
                <IonFabButton onClick={() => history.push("/item")}>
                    <IonIcon icon={add} />
                </IonFabButton>
            </IonFab>
        </IonPage>

    )
}

export default ItemList;