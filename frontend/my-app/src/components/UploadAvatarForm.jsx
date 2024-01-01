import { useState } from "react";
import UploadAvatar from "./UploadAvatar";
import extractLocalStorage from "../lib/local-storage-extract";
import { useDispatch } from "react-redux";
import { chatActions } from "../store/message_redux";

export default function UploadAvatarForm() {
    const [isSavedFile, setIsSavedFile] = useState();
    const [isUploadValid, setIsUploadValid] = useState();

    const dispatch = useDispatch();

    const avatarSubmitHandler = async (e) => {
        e.preventDefault();

        const { dataCredentials } = extractLocalStorage();

        const formData = new FormData();
        formData.append("file", isSavedFile);
        const response = await fetch("http://localhost:8080/settings/avatar", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${dataCredentials.token}`,
            },
        });

        const data = await response.json();
        if (response.ok) {
            // uploads/images/default.jpg
            const fullPath = "uploads/images/" + data.filename;
            dispatch(chatActions.populateAvatar(fullPath));
        } else {
            setIsUploadValid(false);
        }
    };

    const uploadAvatarFormHandler = (items) => {
        setIsUploadValid(items.fileIsValid)
        if(!items.fileIsValid){
            dispatch(
                chatActions.setNofification({
                    status: "Failed",
                    message: "Invalid file!",
                })
            );
            return;
        }
        setIsSavedFile(items.pickedFile);
    };

    return (
        <form onSubmit={avatarSubmitHandler}>
            <UploadAvatar onInput={uploadAvatarFormHandler} />
            {isUploadValid && <button type="submit">Upload avatar</button>}
            {isUploadValid === false && <p style={{ color: "red" }}>Error while uploading file...</p>}
        </form>
    );
}
