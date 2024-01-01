import { useEffect, useRef, useState } from "react";
import classes from "../styles/chatForm.module.css";

import { socket } from "../socket";
import { useDispatch } from "react-redux";
import { chatActions } from "../store/message_redux";

export default function CharForm(props) {
    const textInputValue = useRef();
    const [isSending, setIsSending] = useState(false);

    const dispatch = useDispatch();

    const formHandler = async (e) => {
        e.preventDefault();
        setIsSending(true);

        const textInput = textInputValue.current.value;

        if (textInput.length === 0) {
            dispatch(
                chatActions.setNofification({
                    status: "Failed",
                    message: "Message length should be > 0",
                })
            );
            setIsSending(false);
            return;
        } else {
            let dataStorage = localStorage.getItem("userData");
            dataStorage = JSON.parse(dataStorage);
            if (!dataStorage || !dataStorage.token) {
                dispatch(
                    chatActions.setNofification({
                        status: "Failed",
                        message:
                            "Something with authentification. Try to log in again.",
                    })
                );
                return;
            }

            const response = await fetch("http://localhost:8080/", {
                method: "POST",
                body: JSON.stringify({
                    message: textInput,
                    username: dataStorage.username,
                }),
                headers: {
                    Authorization: `Bearer ${dataStorage.token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log("sended");

            const data = await response.json();
            if (response.ok) {
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

            socket
                .timeout(5000)
                .emit(
                    "send_message",
                    { username: dataStorage.username, text: textInput },
                    () => {
                        console.log("sended via socket");
                        setIsSending(false);
                    }
                );
            textInputValue.current.value = "";
        }
    };

    return (
        <form className={classes.form_items} onSubmit={formHandler}>
            <label>Send a new text</label>
            <input
                type="text"
                name="text"
                id="text"
                placeholder="Paste a new text"
                ref={textInputValue}
            />
            <button type="submit" disabled={isSending || !props.isConnected}>
                Send
            </button>
        </form>
    );
}
