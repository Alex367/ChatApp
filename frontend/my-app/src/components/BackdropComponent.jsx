import classes from "../styles/backdropComponent.module.css";

export default function BackdropComponent(props) {
    return <div onClick={props.onConfirm} className={classes.backdrop} />;
}
