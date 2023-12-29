*** Settings ***
Library    SeleniumLibrary
Library    String


*** Variables ***
# Here is important to have the last item in order after submitting a message
${Chat_username_path} =    xpath=//ul[contains(@class, "ul_message")]/li[last()]/div[contains(@class, "letter")]/span
${Chat_button} =    xpath=//ul[contains(@class, "ul_message")]/li[last()]/button
${Chat_all_text} =    xpath=//ul[contains(@class, "ul_message")]/li[last()]/div

# Here is not so important to have an order
${Chat_username_to_delete} =    xpath=//ul[contains(@class, "ul_message")]/li/div/span[text() = "test"]
${Chat_button_to_delete} =    xpath=//ul[contains(@class, "ul_message")]/li/div/span[text() = "test"]/following::button[text() = "Delete"]

${Send_message_button} =    xpath=//form[contains(@class, "chatForm")]/button[@type="submit"]

${Chat_username} =    test


*** Keywords ***
Verify Chat Page Loaded
    Wait Until Page Contains    Chat Page    10s

Connect User
    Click Button    Connect
    Wait Until Page Contains    Disconnect    10s

Send New Message
    Input Text    id=text    Hello From Testing!
    Click Button    ${Send_message_button}
    Sleep    10s

Verify New Message Fetched
    Element Text Should Be    ${Chat_username_path}    ${Chat_username}
    ${all_text} =    Get Text    ${Chat_all_text}
    @{only_message} =    Split String    ${all_text}    :
    Should Be Equal As Strings    ${only_message[1].strip()}    Hello From Testing!
    Page Should Contain Element    ${Chat_button}

Delete Message
    Element Text Should Be    ${Chat_username_to_delete}    ${Chat_username}
    Click Button    ${Chat_button_to_delete}
    Sleep    10s

Verify Message Was Deleted
    Page Should Not Contain Element    ${Chat_username_to_delete}