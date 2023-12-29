*** Settings ***
Library    SeleniumLibrary


*** Variables ***
${Error_path} =    xpath=//div[contains(@class, "container")]/div


*** Keywords ***
Load Page
    [Arguments]    ${URL}
    Go To    ${URL}

Verify Registration Page Loaded
    Wait Until Page Contains    Registration Page

Insert Credentials
    [Arguments]    ${USERNAME}    ${EMAIL}    ${PASSWORD}    ${REPEAT_PASSWORD}
    Input Text    name=username    ${USERNAME}
    Input Text    name=email    ${EMAIL}
    Input Text    name=password    ${PASSWORD}
    Input Text    name=repeat_password    ${REPEAT_PASSWORD}

Press Submit Button
    Click Button    Submit

Check Error Message
    [Arguments]    ${ERROR}
    Wait Until Page Contains Element    ${Error_path}
    Element Text Should Be    ${Error_path}    ${ERROR}