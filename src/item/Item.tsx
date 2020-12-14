import React from "react";
import { IonItem, IonLabel } from '@ionic/react';


interface ItemPropsComponent extends ItemProps {
    onEdit: (id? : string) => void;
}

export const Item: React.FC<ItemPropsComponent> = (item: ItemPropsComponent) => {
    return(
        <IonItem onClick={() => item.onEdit(item._id)}>
            <IonLabel>{item.text}</IonLabel>
        </IonItem>
    )
}


// class ItemComponent extends React.Component {
//
//     private item: ItemProps;
//     private readonly onEdit: (id? : string) => void
//
//     constructor(item: ItemProps, onEdit: (id? : string) => void) {
//         super(item, onEdit);
//         this.item = item;
//         this.onEdit = onEdit;
//     }
//
//     render() {
//         return <IonItem onClick={() => this.onEdit(this.item.id)}>
//             <IonLabel>{this.item.text}</IonLabel>
//         </IonItem>
//     }
// }