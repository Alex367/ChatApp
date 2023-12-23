import classes from "../styles/settings.module.css";
import SettingsEmaiUsernameForm from "../components/SettingsEmailUsernameForm";
import ChangePassword from "../components/ChangePassword";
import { useState } from "react";
import UploadAvatarForm from "../components/UploadAvatarForm";
import DeleteAccount from "../components/DeleteAccount";

export default function SettingsPage() {
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [isRemoveAccount, setIsRemoveAccount] = useState(false);

    const changePasswordHandler = () => {
        setIsChangePassword((prev) => !prev);
    };

    const removeAccountHandler = () => {
        setIsRemoveAccount((prev) => !prev);
    };

    return (
        <div className={`container ${classes.container_settings}`}>
            <h1>Settings</h1>
            <div className={classes.settings_fields}>
                <div className={classes.settings_field_div}>
                    <SettingsEmaiUsernameForm />
                    <button onClick={changePasswordHandler}>
                        Change Password
                    </button>
                    {isChangePassword && (
                        <ChangePassword onConfirm={changePasswordHandler} />
                    )}
                </div>
                <UploadAvatarForm />
                <div>
                    <button onClick={removeAccountHandler}>
                        Remove account
                    </button>
                    {isRemoveAccount && (
                        <DeleteAccount onConfirm={removeAccountHandler} />
                    )}
                </div>
            </div>
        </div>
    );
}
