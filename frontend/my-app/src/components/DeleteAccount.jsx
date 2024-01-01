import ReactDOM from "react-dom";
import BackdropComponent from "./BackdropComponent";
import classes from "../styles/deleteAccountOverlay.module.css";
import useFetchData from "../hook/fetch-hook";
import { useDispatch } from "react-redux";
import { chatActions } from "../store/message_redux";
import { useNavigate } from "react-router-dom";

export default function DeleteAccount(props) {
    const { sendRequest } = useFetchData();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const dataOutput = (dataObj, isError) => {
        if(isError.status){
            dispatch(
                chatActions.setNofification({
                    status: "Failed",
                    message: isError.message,
                })
            );
            return;
        }
        dispatch(chatActions.clearAllMessages());
        dispatch(chatActions.clearLogged());
        localStorage.removeItem("userData");
        if (localStorage.getItem("items")) {
            localStorage.removeItem("items");
        }
        dispatch(
            chatActions.setNofification({
                status: "Success",
                message: dataObj.message,
            })
        );
        navigate("/login");
    };

    const removeUserAccount = () => {
        const userCredentials = localStorage.getItem("userData");
        let dataCredentials = JSON.parse(userCredentials);
        if (!dataCredentials || !dataCredentials.token) {
            dispatch(
                chatActions.setNofification({
                    status: "Failed",
                    message:
                        "Something with authentification! Try log in again!",
                })
            );
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
