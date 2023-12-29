*** Settings ***
Resource    ../Resources/Common.robot
Resource    ../Resources/AboutApp.robot
Resource    ../Resources/Data/InputData.robot

Test Setup    Begin Web Test
Test Teardown    End Web Test


*** Test Cases ***
User should be able to open about page
    [Documentation]    Positive About Page Test    TC_5 - TS_3
    [Tags]    Regression
    AboutApp.Positive Open Test    ${ABOUT_URL}