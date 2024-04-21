import { expect } from "@playwright/test";

export class NavigationObjects{
    page: any;
    logoutBtn: any;
    logoutNotification: any;

    constructor(page: any){
        this.page = page;
        this.logoutBtn = page.getByRole('button', { name: 'Logout' });
        this.logoutNotification = page.getByRole('heading', { name: 'Login Page' });
    }

    async logout(){
        await this.logoutBtn.click();
    }

    async verifyLogout(){
        await expect(this.logoutNotification).toBeVisible();
    }
    
}