*** Settings ***
Library    SeleniumLibrary


*** Variables ***
${Error_path} =    xpath=//*[contains(@class, "container")]/div


*** Keywords ***
Load Page
    [Arguments]    ${URL}
    Go To    ${URL}

Verify Login Page Loaded
    Wait Until Page Contains    Login Page

Insert Credentials
    [Arguments]    ${EMAIL}    ${PASSWORD}
    Input Text    name=email    ${EMAIL}
    Input Password    name=password    ${PASSWORD}    

Press Submit Button
    Click Button    Submit

Login Error
    [Arguments]    ${ERROR}
    Wait Until Page Contains Element    ${Error_path}
    Element Text Should Be    ${Error_path}    ${ERROR}