import ReactDOM from "react-dom";
import BackdropComponent from "./BackdropComponent";
import classes from "../styles/deleteAccountOverlay.module.css";
import useFetchData from "../hook/fetch-hook";
import { useDispatch } from "react-redux";
import { chatActions } from "../store/message_redux";
import { useNavigate } from "react-router-dom";

export default function DeleteAccount(props) {
    const { isError, sendRequest } = useFetchData();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const dataOutput = (dataObj) => {
        dispatch(chatActions.clearAllMessages());
        dispatch(chatActions.clearLogged());
        localStorage.removeItem("userData");
        if (localStorage.getItem("items")) {
            localStorage.removeItem("items");
        }
        console.log(dataObj.message);
        navigate("/login");
    };

    const removeUserAccount = () => {
        const userCredentials = localStorage.getItem("userData");
        let dataCredentials = JSON.parse(userCredentials);
        if (!dataCredentials || !dataCredentials.token) {
            return;
        }

        sendRequest(
            {
                url: "http://localhost:8080/settings",
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${dataCredentials.token}`,
                    "Content-Type": "application/json",
                },
            },
            dataOutput
        );
    };

    const DeleteAccountOverlay = (props) => {
        return (
            <div className={`modalOverlay ${classes.deleteAccountOverlay}`}>
                <h1>Remove account</h1>
                <button
                    onClick={removeUserAccount}
                    className={classes.remove_btn}
                >
                    Remove
                </button>
                <button onClick={props.onConfirm}>Cancel</button>
                {isError.status && <p>Something wrong...</p>}
            </div>
        );
    };

    return (
        <>
            {ReactDOM.createPortal(
                <BackdropComponent onConfirm={props.onConfirm} />,
                document.getElementById("backdrop_overlay")
            )}
            {ReactDOM.createPortal(
                <DeleteAccountOverlay onConfirm={props.onConfirm} />,
                document.getElementById("remove_account")
            )}
        </>
    );
}
