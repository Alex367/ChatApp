*** Settings ***
Resource    ../Resources/APITestsApp.robot
Resource    ../Resources/Data/InputData.robot


*** Test Cases ***
User should be able to registr a new profile change password delete his account
    [Documentation]    Positive Registr New Profile Change Password Delete Account test, TC11 - TS_9
    [Tags]    Regression    API    current
    APITestsApp.Positive Registration Change Password Delete Account API    ${API_DOMAIN}    ${API_USER}