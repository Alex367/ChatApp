import { useState } from "react";
import UploadAvatar from "./UploadAvatar";
import extractLocalStorage from "../lib/local-storage-extract";
import { useDispatch } from "react-redux";
import { chatActions } from "../store/message_redux";

export default function UploadAvatarForm() {
    const [isSavedFile, setIsSavedFile] = useState();
    const [isUploadValid, setIsUploadValid] = useState(true);

    const dispatch = useDispatch();

    const avatarSubmitHandler = async (e) => {
        e.preventDefault();
        console.log("Sent form");

        const { dataCredentials, connectionStatus } = extractLocalStorage();

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
            console.log("YES");
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
            return;
        }
        setIsSavedFile(items.pickedFile);
    };

    return (
        <form onSubmit={avatarSubmitHandler}>
            <UploadAvatar onInput={uploadAvatarFormHandler} />
            <button type="submit">Upload avatar</button>
            {!isUploadValid && <p style={{ color: "red" }}>Error while uploading file...</p>}
        </form>
    );
}
