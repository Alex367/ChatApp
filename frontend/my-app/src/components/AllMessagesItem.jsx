import classes from "../styles/allMessagesItem.module.css";

import { socket } from "../socket";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function AllMessagesItem(props) {
    const [isError, setIsError] = useState({ status: false, message: "" });
    const connectedUser = useSelector(
        (state) => state.doMessages.connectionStatus
    );

    const deleteMessageHandler = async () => {
        const idMessageDataToSend = props.itemToDelete._id;
        const userMessageDataToSend = props.itemToDelete.username;


        let dataStorage = localStorage.getItem("userData");
        dataStorage = JSON.parse(dataStorage);
        if (!dataStorage || !dataStorage.token) {
            console.log("Error!");
            return;
        }

        const response = await fetch("http://localhost:8080/", {
            method: "DELETE",
            body: JSON.stringify({
                id_item: idMessageDataToSend,
                user_item: userMessageDataToSend
            }),
            headers: {
                Authorization: `Bearer ${dataStorage.token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        if (response.ok) {
            socket.emit("delete_message", { _id: idMessageDataToSend }, () => {
                console.log("deleted via socket");
            });
        } else {
            console.log("No");
            setIsError({ status: true, message: data.message });
        }
    };

    return (
        <li className={classes.item_message}>
            <div className={classes.item_message_username_letter}>
                <span>{props.username}</span>: {props.letter}
            </div>
            {props.itemToDelete && connectedUser && (
                <button onClick={deleteMessageHandler}>Delete</button>
            )}
            {isError && <div>{isError.message}</div>}
        </li>
    );
}
