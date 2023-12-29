*** Settings ***
Library    SeleniumLibrary


*** Keywords ***
Load Page
    [Arguments]    ${ABOUT_URL}
    Go To    ${ABOUT_URL}

Verify About Page Loaded
    Wait Until Page Contains    About Page Opened    10s