import {test} from "@playwright/test";
import { LoginPage } from "../PO/login";
import { NavigationObjects } from "../PO/nav";

test('logout test', async({page}) => {
    const login = new LoginPage(page);
    await login.openLoginPage();
    await login.login(process.env.USERNAME, process.env.PASSWORD);
    const logout = new NavigationObjects(page);
    await logout.logout();
    await logout.verifyLogout();
});