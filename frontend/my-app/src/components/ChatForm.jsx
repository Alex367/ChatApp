import { useEffect, useRef, useState } from "react";
import classes from "../styles/chatForm.module.css";

import { socket } from "../socket";
import { useSelector } from "react-redux";

export default function CharForm(props) {
    const textInputValue = useRef();
    const [isSending, setIsSending] = useState(false);
    const [isError, setIsError] = useState({ status: false, message: "" });

    const fetchDataError = useSelector(
        (state) => state.doMessages.errorFetchChatData
    );

    useEffect(() => {
        console.log("hide error");
        let time;
        if (isError.status) {
            time = setTimeout(() => {
                setIsError({ status: false, message: "" });
            }, 2000);
        }
        return () => clearTimeout(time);
    }, [isError]);

    const formHandler = async (e) => {
        e.preventDefault();
        setIsSending(true);

        const textInput = textInputValue.current.value;

        if (textInput.length === 0) {
            setIsError({
                status: true,
                message: "Message length should be > 0",
            });
            setIsSending(false);
            return;
        } else {
            let dataStorage = localStorage.getItem("userData");
            dataStorage = JSON.parse(dataStorage);
            if (!dataStorage || !dataStorage.token) {
                console.log("Error!");
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

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
            } else {
                setIsError({
                    status: true,
                    message: "Something with sending a message!",
                });
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
            setIsError({ status: false, message: "" });
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
            {isError && <div style={{ color: "red" }}>{isError.message}</div>}
            {fetchDataError && <div style={{ color: "red" }}>Loading data error, try to refresh page.</div>}
        </form>
    );
}
