*** Settings ***
Resource    ../Resources/ChatApp.robot
Resource    ../Resources/Common.robot
Resource    ../Resources/Data/InputData.robot

Test Setup    Begin Web Test
Test Teardown    End Web Test


*** Test Cases ***
User should be able to send a new message inside the chat
    [Documentation]    Positive send message test    TC6 - TS_4
    [Tags]    Regression
    ChatApp.Send New Message    ${LOGIN_URL}    ${LOGIN_USER}

User should be able to delete a message inside the chat
    [Documentation]    Positive remove message Test    TC7 - TS_5
    [Tags]    Regression
    ChatApp.Remove Message    ${LOGIN_URL}    ${LOGIN_USER}