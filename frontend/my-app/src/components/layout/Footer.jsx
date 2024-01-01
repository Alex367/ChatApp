import classes from "../../styles/footer.module.css";
import DarkTheme from "../../dark.svg";
import LightTheme from "../../light.svg";

export default function FooterComponent() {
    const lightThemeHandler = () => {
        document.querySelector("body").setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
    };

    const darkThemeHandler = () => {
        document.querySelector("body").setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    };

    return (
        <footer>
            <p>Footer</p>
            <button onClick={darkThemeHandler}>
                <img src={DarkTheme} className={classes.theme_img} />
                Dark Theme
            </button>
            <button onClick={lightThemeHandler}>
                <img src={LightTheme} className={classes.theme_img} />
                Light Theme
            </button>
        </footer>
    );
}
