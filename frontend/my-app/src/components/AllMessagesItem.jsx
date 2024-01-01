import classes from "../styles/allMessagesItem.module.css";

import { socket } from "../socket";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "../store/message_redux";

export default function AllMessagesItem(props) {
    const connectedUser = useSelector(
        (state) => state.doMessages.connectionStatus
    );

    const dispatch = useDispatch();

    const deleteMessageHandler = async () => {
        const idMessageDataToSend = props.itemToDelete._id;
        const userMessageDataToSend = props.itemToDelete.username;

        let dataStorage = localStorage.getItem("userData");
        dataStorage = JSON.parse(dataStorage);
        if (!dataStorage || !dataStorage.token) {
            dispatch(
                chatActions.setNofification({
                    status: "Failed",
                    message:
                        "Something with authentification! Try log in again!",
                })
            );
            return;
        }

        const response = await fetch("http://localhost:8080/", {
            method: "DELETE",
            body: JSON.stringify({
                id_item: idMessageDataToSend,
                user_item: userMessageDataToSend,
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
            dispatch(
                chatActions.setNofification({
                    status: "Success",
                    message: data.message,
                })
            );
        } else {
            dispatch(
                chatActions.setNofification({
                    status: "Failed",
                    message: data.message,
                })
            );
            return;
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
        </li>
    );
}
