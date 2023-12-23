import { useSelector } from "react-redux";
import classes from "../styles/uploadAvatar.module.css";
import { useEffect, useRef, useState } from "react";

export default function UploadAvatar(props) {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(true);

    const filePickerRef = useRef();

    useEffect(() => {
        if (!file) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    const pickerHandler = (event) => {
        let pickedFile;
        let fileIsValid = isValid;
        if (event.target.files || event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false;
        }
        // let id_item = event.target.name;
        props.onInput({pickedFile, fileIsValid});
    };

    const pickImageHandler = () => {
        filePickerRef.current.click();
    };

    return (
        <div className={classes.settings_avatar}>
            <input
                id="file"
                name="file"
                style={{ display: "none" }}
                type="file"
                ref={filePickerRef}
                accept=".jpg,.png,.jpeg"
                onChange={pickerHandler}
            />
            <div className={`image-upload`}>
                <div className="image-upload__preview">
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className={classes.avatar}
                        />
                    )}
                    {!previewUrl && <p>Please pick a new image.</p>}
                </div>
                <button type="button" onClick={pickImageHandler}>
                    Pick a new image
                </button>
            </div>
            {!isValid && <p>Error!!!</p>}
        </div>
    );
}
