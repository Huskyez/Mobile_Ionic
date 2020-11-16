import {getLogger} from "../utils/logger";
import {RouteComponentProps} from "react-router";
import {useContext, useEffect, useState} from "react";
import {ItemContext} from "./ItemProvider";
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonLoading,
    IonButton,
    IonLabel,
    IonFooter,
    IonItem,
    IonTextarea
} from "@ionic/react";
import React from "react";

const log = getLogger('ItemDetail');

interface ItemDetailProps extends RouteComponentProps<{id? : string}> {}

const ItemDetail: React.FC<ItemDetailProps> = ({history, match}) => {

    const {items, saving, savingError, saveFunc } = useContext(ItemContext);
    log(`${saveFunc}`);

    const [text, setText] = useState('');
    const [item, setItem] = useState<ItemProps>();

    useEffect(() => {

        log("useEffect");

        const routeId = match.params.id || '';
        const item = items?.find(it => it.id === routeId);
        setItem(item);
        if (item) {
            setText(item.text);
        }
    },
        [match.params.id, items]
    );
    const handleSave = () => {
        const editedItem = item ? { id: item.id, text: text, date: item.date, version: item.version } : { id: undefined, text: text, date: new Date(), version: 0 }
        log(`handleSave editedItem: ${editedItem.id} - ${editedItem.text}`);
        log(`handleSave saveFunc: ${saveFunc}`);
        saveFunc && saveFunc(editedItem).then(() => history.goBack());
    };

    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Edit Item</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                <IonItem>
                    <IonLabel>ID: {item?.id}</IonLabel>
                </IonItem>
                <IonItem>
                    <IonTextarea value={text || ''} onIonChange={t => {setText(t.detail.value || ''); log(`t value - ${t.detail.value}`)}} />
                </IonItem>
                <IonItem>
                    <IonLabel>Last Changed: {item?.date}</IonLabel>
                </IonItem>
                <IonItem>
                    <IonLabel>Version: {item?.version}</IonLabel>
                </IonItem>

                <IonLoading isOpen={saving}/>
                {savingError && (
                    <div>{savingError.message || "Failed to save item"}</div>
                )}

            </IonContent>
            <IonFooter>
                <IonButton strong={true} onClick={() => handleSave()} >
                    Save
                </IonButton>
            </IonFooter>
        </IonPage>
    );
}

export default ItemDetail;