*** Settings ***
Resource    ../Resources/Common.robot
Resource    ../Resources/LoginApp.robot
Resource    ../Resources/Data/InputData.robot
# Suite Setup    Insert Testing Data
Test Setup    Begin Web Test
Test Teardown    End Web Test
# Suite Teardown    Cleanup Testing Data


*** Test Cases ***
User should be able to log in to the chat page
    [Documentation]    Positive log in test    TC_1 - TS_1
    [Tags]    Regression
    LoginApp.Positive Login    ${LOGIN_URL}    ${LOGIN_USER}

User should not be able to log in to the chat page with incorrect format email
    [Documentation]    Negative log in Test    TC_2 - TS_1
    [Tags]    Regression
    LoginApp.Login Incorrect Email    ${LOGIN_URL}    ${LOGIN_USER_2}

User should be able to log out from the page
    [Documentation]    Positive log out test    TC_1_1 - TS_1
    [Tags]    Regression
    LoginApp.Logout    ${LOGIN_URL}    ${LOGIN_USER}

User should not be able to log in to the chat page with email, which doesnt exist in DB
    [Documentation]    Negative log in Test    TC12.1 - TS_1
    [Tags]    Regression
    LoginApp.Login Incorrect Email    ${LOGIN_URL}    ${LOGIN_USER_3}