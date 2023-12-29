*** Settings ***
Library    SeleniumLibrary


*** Variables ***
${Remove_account} =    xpath=//div[contains(@class, "settings_fields")]/div/button[text() = "Remove account"]
${Remove_account_confirm} =    xpath=//button[contains(@class, "deleteAccountOverlay")]

${Insert_new_email} =    xpath=//form/label[text() = "Email"]/following::input[@value = "settings@test.com"]
${Insert_new_username} =    xpath=//form/label[text() = "Username"]/following::input[@value = "settings"]
${Save_button_new_email_username} =    xpath=//button[contains(@class, "Form_btn_save")]


*** Keywords ***
Load Page
    [Arguments]    ${SETTINGS_URL}
    Go To    ${SETTINGS_URL}
    Sleep    5s

Press Remove Button
    Wait Until Page Contains Element    ${Remove_account}
    Click Button    ${Remove_account}
    Click Button    ${Remove_account_confirm}

Insert Email Username
    [Arguments]    ${USER}
    Input Text    ${Insert_new_email}    ${USER.Email}
    Input Text    ${Insert_new_username}    ${USER.Username}

Save New Email Username
    Sleep    3s
    Click Button    ${Save_button_new_email_username}

Open Remove Dialog
    [Arguments]    ${SETTINGS_URL}
    Load Page    ${SETTINGS_URL}
    Press Remove Button