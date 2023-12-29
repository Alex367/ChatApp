*** Settings ***
Resource    ../Resources/Common.robot
Resource    ../Resources/Data/InputData.robot
Resource    ../Resources/SettingsApp.robot

Test Setup    Begin Web Test
Test Teardown    End Web Test


*** Test Cases ***
User should be able to remove his account
    [Documentation]    Positive remove account test, TC12 - TS_10
    [Tags]    Regression    remove
    SettingsApp.Positive Remove Account    ${REGISTRATION_URL}    ${SETTINGS_USER_REMOVE}    ${SETTINGS_URL}    ${LOGIN_URL}

User should be able to change Email & Username via Settings section
    [Documentation]    Positive change email & username test, TC10 - TS_8
    [Tags]    Regression
    SettingsApp.Positive Change Email Username    ${REGISTRATION_URL}    ${SETTINGS_USER}    ${SETTINGS_URL}    ${SETTINGS_USER_UPDATED}    ${LOGIN_URL}

# User should be able to upload a new avatar image
#     [Documentation]    Positive upload new avatar, TC13 - TS_11
#     [Tags]    Regression    current
#     SettingsApp.Positive Upload Avatar    ${API_DOMAIN}    ${API_CREATE_USERNAME}    ${API_CREATE_EMAIL}    ${API_OLD_PASSWORD}    ${LOGIN_URL}    ${SETTINGS_URL}