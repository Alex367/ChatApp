*** Settings ***
Resource    ./LoginApp.robot
Resource    ./PO/SettingsPage.robot
Resource    ./PO/Nav.robot
Resource    ./LoginApp.robot
Resource    ./RegistrationApp.robot
Resource    ./API/APIHelper.robot
Library    RequestsLibrary


*** Variables ***
${Url_request} =    http://localhost:8080
${Endpoint_change} =    /changePassword
${Endpoint_create} =    /registration
${Endpoint_delete} =    /settings


*** Keywords ***
Positive Remove Account
    [Arguments]    ${REGISTRATION_URL}    ${USER}    ${SETTINGS_URL}    ${LOGIN_URL}
    RegistrationApp.Positive Registration    ${REGISTRATION_URL}    ${USER}    ${SETTINGS_URL}    ${True}
    LoginApp.Login Incorrect Email    ${LOGIN_URL}    ${USER}

Positive Change Email Username
    [Arguments]    ${REGISTRATION_URL}    ${USER}    ${SETTINGS_URL}    ${USER_UPDATED}    ${LOGIN_URL}
    RegistrationApp.Positive Registration    ${REGISTRATION_URL}    ${USER}
    SettingsPage.Load Page    ${SETTINGS_URL}
    SettingsPage.Insert Email Username    ${USER_UPDATED}
    SettingsPage.Save New Email Username
    Nav.Logout
    LoginApp.Positive Login    ${LOGIN_URL}    ${USER_UPDATED}
    SettingsPage.Load Page    ${SETTINGS_URL}
    SettingsPage.Press Remove Button
    LoginPage.Verify Login Page Loaded

# Positive Upload Avatar
#     [Arguments]    ${API_DOMAIN}    ${API_CREATE_USERNAME}    ${API_CREATE_EMAIL}    ${API_PASSWORD}    ${LOGIN_URL}    ${SETTINGS_URL}
#     ${response_create} =    APIHelper.Registration New User API    ${API_DOMAIN}    ${API_CREATE_USERNAME}    ${API_CREATE_EMAIL}    ${API_PASSWORD}
#     IF  ${response_create.status_code} == 201
#         LoginApp.Positive Login    ${LOGIN_URL}    ${API_CREATE_EMAIL}    ${API_PASSWORD}
#         SettingsPage.Load Page    ${SETTINGS_URL}
#         # ${full_path_file}    Set Variable    ${CURDIR}${/}Data${/}avatar_testing.jpg
#         # Log    ${full_path_file}
#         Sleep    5s
#         Choose File    xpath=//div[@class="image-upload"]/button[text() = "Pick a new image"]    ${CURDIR}${/}Data${/}avatar_testing.jpg
#         # Click Button    //div[contains(@class, "uploadAvatar")]/following::button[text() = "Upload avatar"]
#         Sleep    10s
#         Click Button    //div[contains(@class, "uploadAvatar")]/following::button[text() = "Upload avatar"]
#         Sleep    10s
#         # Go To    http://localhost:3000/
#         ${src_path} =    Get Element Attribute    xpath=//ul[contains(@class, "mainNavigation")]/li/img    src
#         Log    ${src_path}
#     END