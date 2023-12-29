*** Settings ***
Resource    ./PO/RegistrationPage.robot
Resource    ./PO/ChatPage.robot
Resource    ./PO/SettingsPage.robot
Resource    ./PO/LoginPage.robot


*** Keywords ***
Positive Registration
    [Arguments]    ${REGISTRATION_URL}    ${USER}    ${SETTINGS_URL}=${None}    ${REMOVE}=${False}
    Inserting Registration Values    ${REGISTRATION_URL}    ${USER}
    ChatPage.Verify Chat Page Loaded
    # Delete created profile or not
    IF  ${REMOVE} == ${True}
        SettingsPage.Open Remove Dialog    ${SETTINGS_URL}
        LoginPage.Verify Login Page Loaded
    END

Negative Registration
    [Arguments]    ${REGISTRATION_URL}    ${USER}    ${ERROR}
    Inserting Registration Values    ${REGISTRATION_URL}    ${USER}
    RegistrationPage.Check Error Message    ${ERROR}

Inserting Registration Values
    [Arguments]    ${URL}    ${USER}
    RegistrationPage.Load Page    ${URL}
    RegistrationPage.Verify Registration Page Loaded
    RegistrationPage.Insert Credentials    ${USER.Username}    ${USER.Email}    ${USER.Password}    ${USER.Password}
    RegistrationPage.Press Submit Button