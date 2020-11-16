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
    IonToolbar
} from "@ionic/react";
import {add} from "ionicons/icons";


const log = getLogger('ItemList');

const ItemList : React.FC<RouteComponentProps> = ({history}) => {

    const { items, fetching, fetchingError } = useContext(ItemContext);

    log("render ItemList")
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>I hate js</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen={fetching} message={"Fetching Items"}/>
                {items && (
                    <IonList>
                        {items.map(({id, text, date, version}) =>
                            <Item key={id} id={id} date={date} version={version} text={text} onEdit={id => history.push(`/item/${id}`)}/>)}
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