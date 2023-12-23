import classes from "../styles/changePassword.module.css";
import ReactDOM from "react-dom";
import ChangePasswordForm from "./ChangePasswordForm";
import BackdropComponent from "./BackdropComponent";

const ModalOverlay = (props) => {
    return (
        <div className="modalOverlay">
            <h1>Change Password</h1>
            <ChangePasswordForm onConfirm={props.onConfirm} />
        </div>
    );
};

export default function ChangePassword(props) {
    return (
        <>
            {ReactDOM.createPortal(
                <BackdropComponent onConfirm={props.onConfirm} />,
                document.getElementById("backdrop_overlay")
            )}
            {ReactDOM.createPortal(
                <ModalOverlay onConfirm={props.onConfirm} />,
                document.getElementById("change_password_overlay")
            )}
        </>
    );
}
