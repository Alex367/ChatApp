*** Settings ***
Resource    ../Resources/Common.robot
Resource    ../Resources/RegistrationApp.robot
Resource    ../Resources/Data/InputData.robot

Test Setup    Begin Web Test
Test Teardown    End Web Test


*** Test Cases ***
User should be able to regist a new profile
    [Documentation]    Positive Registration    TC_3 - TS_2
    [Tags]    Regression    currentReg
    RegistrationApp.Positive Registration    ${REGISTRATION_URL}    ${REGISTRATION_USER}    ${SETTINGS_URL}    ${True}

User should not be able to regist a new profile with email, which already exists in DB
    [Documentation]    Negative Registration    TC_4 - TS_2
    [Tags]    Regression    second
    RegistrationApp.Negative Registration    ${REGISTRATION_URL}    ${LOGIN_USER}    ${REGISTRATION_ERROR_INVALID_USERNAME}