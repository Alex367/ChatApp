*** Settings ***
Resource    PO/LoginPage.robot
Resource    PO/ChatPage.robot
Resource    PO/Nav.robot


*** Keywords ***
Positive Login
    [Arguments]    ${LOGIN_URL}    ${LOGIN_USER}
    Inserting Login Values    ${LOGIN_URL}    ${LOGIN_USER}
    ChatPage.Verify Chat Page Loaded

Login Incorrect Email
    [Arguments]    ${LOGIN_URL}    ${LOGIN_USER}
    Inserting Login Values    ${LOGIN_URL}    ${LOGIN_USER}
    LoginPage.Login Error   ${LOGIN_USER.Error}
    LoginPage.Check Page

Logout
    [Arguments]    ${LOGIN_URL}    ${LOGIN_USER}
    Positive Login    ${LOGIN_URL}    ${LOGIN_USER}
    Nav.Logout
    LoginPage.Verify Login Page Loaded

Inserting Login Values
    [Arguments]    ${URL}    ${LOGIN_USER}
    LoginPage.Load Page    ${URL}
    LoginPage.Verify Login Page Loaded
    LoginPage.Insert Credentials    ${LOGIN_USER.Email}    ${LOGIN_USER.Password}
    LoginPage.Press Submit Button