import classes from "../styles/chatPage.module.css";
import { socket } from "../socket";
import MessagesComponent from "../components/MessagesComponent";
import ChatForm from "../components/ChatForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { chatActions } from "../store/message_redux";
import useFetchData from "../hook/fetch-hook";
import extractLocalStorage from "../lib/local-storage-extract";

export default function ChatPage() {
    const connectedUser = useSelector(
        (state) => state.doMessages.connectionStatus
    );

    const { isError, sendRequest } = useFetchData();

    const dispatch = useDispatch();

    useEffect(() => {
        console.log("HERE");
        function onConnect() {
            console.log("oncon");
            dispatch(chatActions.setConnectionStatus(true));
        }

        function onDisconnect() {
            console.log("ondis");
            dispatch(chatActions.setConnectionStatus(false));
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        console.log("mail val 2 ", socket.connected);
        if (!socket.connected) {
            console.log("inner val 2");
            if (connectedUser) {
                console.log("double yes");
                socket.connect();
            }
        }

        return () => {
            socket.removeAllListeners();
            // socket.off("connect", onConnect);
            // socket.off("disconnect", onDisconnect);
        };
    }, [connectedUser, dispatch]);

    const transformData = (dataObj) => {
        dispatch(chatActions.populateMessage(dataObj));
    };

    useEffect(() => {
        socket.on("receive_message", async (data) => {
            console.log("received");
            const { dataCredentials, connectionStatus } = extractLocalStorage();
            sendRequest(
                {
                    url: "http://localhost:8080/",
                    headers: {
                        Authorization: `Bearer ${dataCredentials.token}`,
                    },
                },
                transformData
            );
        });

        socket.on("receive_deleted_message", async (data) => {
            console.log("received deleted message");
            dispatch(chatActions.deleteOneMessage({ _id: data._id }));
        });
    }, [dispatch]);

    // console.log("ChatPage ", connectedUser);

    return (
        <div className={`container ${classes.home_container}`}>
            <h1>Chat Page</h1>
            <ChatForm isConnected={connectedUser} />
            <MessagesComponent isConnected={connectedUser} />
            {isError.status && (
                <div style={{ color: "red" }}>
                    Error fetching data. Try to re-load the page
                </div>
            )}
        </div>
    );
}
