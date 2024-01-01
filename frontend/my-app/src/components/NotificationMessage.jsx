import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import classes from '../styles/notificationMessage.module.css'
import { chatActions } from "../store/message_redux";
import { useEffect } from "react";

export default function NotificationMessage(){

    const notificationData = useSelector((state) => state.doMessages.notificationValue);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("hide error message");
        let time;
        if (notificationData) {
            time = setTimeout(() => {
                dispatch(
                    chatActions.setNofification(null)
                );
            }, 2000);
        }
        return () => clearTimeout(time);
    }, [notificationData]);

    let styles = "";
    if(!notificationData){
        return;
    } else if (notificationData.status === "Success"){
        styles = classes.success;
    } else if (notificationData.status === "Failed"){
        styles = classes.failed;
    }

    const cssStyles = `${classes.notification_ul} ${styles}`;

    return(
        <>
            {ReactDOM.createPortal(
                <ul className={cssStyles}>
                    <li>{notificationData.message}</li>
                </ul>,
                document.getElementById("notification-general")
            )}
        </>
    );
}