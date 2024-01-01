import MainNavigation from "./MainNavigation";
import FooterComponent from "./Footer";

export default function Layout(props){
    return(
        <div>
            <MainNavigation/>
            <main>{props.children}</main>
            <FooterComponent/>
        </div>
    );
}