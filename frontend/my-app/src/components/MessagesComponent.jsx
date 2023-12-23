import AllMessagesList from "../components/AllMessagesList";

import { socket } from "../socket";

export default function MessagesComponent(props) {
    function connect() {
        localStorage.setItem("items", true);
        // socket.connect();
        window.location.reload();
    }

    function disconnect() {
        localStorage.setItem("items", false);
        socket.disconnect();
    }

    return (
        <div>
            <AllMessagesList />
            {props.isConnected ? (
                <div style={{ textAlign: "center", marginTop: "2.4rem" }}>
                    <div>Connected</div>
                    <button onClick={disconnect}>Disconnect</button>
                </div>
            ) : (
                <div style={{ textAlign: "center", marginTop: "2.4rem" }}>
                    <div>Disconnected</div>
                    <button onClick={connect}>Connect</button>
                </div>
            )}
        </div>
    );
}
