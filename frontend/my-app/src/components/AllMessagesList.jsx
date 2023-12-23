import AllMessagesItem from "./AllMessagesItem";
import classes from "../styles/allMessagesList.module.css";
import { useSelector } from "react-redux";

export default function AllMessagesList(props) {
    const chatMessages = useSelector((state) => state.doMessages.messages);
    const userLoggedInfo = useSelector((state) => state.doMessages.logged);

    // Find index of last message from User
    let lastMessageFromUserIndex = chatMessages
        .map((el) => el.username)
        .lastIndexOf(userLoggedInfo.username);

    // console.log(chatMessages);

    return (
        <ul className={classes.ul_messages}>
            {chatMessages.map((item, index) =>
                lastMessageFromUserIndex === index ? (
                    <AllMessagesItem
                        key={index}
                        id={index}
                        username={item.username}
                        letter={item.text}
                        itemToDelete={
                            chatMessages[lastMessageFromUserIndex]
                        }
                    />
                ) : (
                    <AllMessagesItem
                        key={index}
                        id={index}
                        username={item.username}
                        letter={item.text}
                    />
                )
            )}
        </ul>
    );
}
