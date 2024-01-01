import { useRef } from "react";
import classes from "../styles/changePasswordForm.module.css";
import { useDispatch } from "react-redux";
import { chatActions } from "../store/message_redux";

export default function ChangePasswordForm(props) {
    const oldPasswordInputRef = useRef();
    const newPasswordInputRef = useRef();

    const dispatch = useDispatch();

    const changePasswordHandler = async (e) => {
        e.preventDefault();

        const userCredentials = localStorage.getItem("userData");
        let dataCredentials = JSON.parse(userCredentials);
        if (!dataCredentials || !dataCredentials.token) {
            dispatch(
                chatActions.setNofification({
                    status: "Failed",
                    message: "Something with authentification! Try again!",
                })
            );
            return;
        }

        const oldPassword = oldPasswordInputRef.current.value;
        const newPassword = newPasswordInputRef.current.value;

        // Validation on FE

        const response = await fetch("http://localhost:8080/changePassword", {
            method: "PATCH",
            body: JSON.stringify({
                oldPassword: oldPassword,
                newPassword: newPassword,
            }),
            headers: {
                Authorization: `Bearer ${dataCredentials.token}`,
                "Content-Type": "application/json",
            },
        });

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
        }
    };

    return (
        <form
            onSubmit={changePasswordHandler}
            className={classes.change_password_form}
        >
            <label>Old Password</label>
            <input
                type="password"
                name="old_password"
                ref={oldPasswordInputRef}
                required
            />
            <label>New Password</label>
            <input
                type="password"
                name="new_password"
                ref={newPasswordInputRef}
                required
            />
            <div className={classes.change_password_btn}>
                <button type="button" onClick={props.onConfirm}>
                    Close
                </button>
                <button type="submit">Confirm</button>
            </div>
        </form>
    );
}
