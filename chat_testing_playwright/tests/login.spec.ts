import {test} from "@playwright/test";
import { LoginPage } from "../PO/login";

test('login test', async({page}) => {
    const login = new LoginPage(page);
    await login.openLoginPage();
    await login.login(process.env.USERNAME, process.env.PASSWORD);
    await login.verifySuccessfullLogin();
});

test('invalid login test', async({page}) => {
    const login = new LoginPage(page);
    await login.openLoginPage();
    await login.login("testing@testing.com", "testing");
    await login.verifyFailedLogin();
});