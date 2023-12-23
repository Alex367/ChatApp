import { useRef, useState } from "react";
import classes from "../styles/changePasswordForm.module.css";

export default function ChangePasswordForm(props) {
    const [isError, setIsError] = useState({ status: false, message: "" });
    const [isChanged, setIsChanged] = useState(false);

    const oldPasswordInputRef = useRef();
    const newPasswordInputRef = useRef();

    const changePasswordHandler = async (e) => {
        e.preventDefault();

        const userCredentials = localStorage.getItem("userData");
        let dataCredentials = JSON.parse(userCredentials);
        if (!dataCredentials || !dataCredentials.token) {
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
            console.log(data);
            setIsChanged(true);
        } else {
            setIsError({ status: true, message: data.message });
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
            {isError.status && (
                <div style={{ color: "red" }}>{isError.message}</div>
            )}
            {isChanged && (
                <div style={{ color: "green" }}>Password was changed</div>
            )}
        </form>
    );
}
