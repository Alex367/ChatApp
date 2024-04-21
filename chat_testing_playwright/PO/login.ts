import { expect } from "@playwright/test";

export class LoginPage{
    page: any;
    usernameField: any;
    passwordField: any;
    submitBtn: any;
    header: any;
    static failedLoginXpath: string = '//div[@id="notification-general"]/ul/li';

    constructor (page: any){
        this.page = page;
        this.usernameField = page.getByPlaceholder('email');
        this.passwordField = page.getByPlaceholder('password');
        this.submitBtn = page.getByRole('button', { name: 'Submit' });
        this.header = page.locator("h1");
    }

    async login(username: any, password: any){
        await this.usernameField.fill(username);
        await this.passwordField.fill(password);
        await this.submitBtn.click();
    }

    async openLoginPage(){
        await this.page.goto('http://localhost:3000/login');
    }

    async verifySuccessfullLogin(){
        await expect(this.page.locator("h1")).toHaveText("Chat Page");
    }

    async verifyFailedLogin(){
        await expect(this.page.locator(LoginPage.failedLoginXpath)).toHaveText("User doesn't exist. Try again.");
    }
}