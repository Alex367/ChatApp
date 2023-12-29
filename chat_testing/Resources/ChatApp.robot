*** Settings ***
Resource    ./PO/ChatPage.robot
Resource    ./LoginApp.robot


*** Variables ***
${Chat_list} =    xpath=//ul[contains(@class, "ul_message")]/li


*** Keywords ***
Send New Message
    [Arguments]    ${LOGIN_URL}    ${LOGIN_USER}
    LoginApp.Positive Login    ${LOGIN_URL}    ${LOGIN_USER}
    ${initial_cnt_items} =    Get Element Count    ${Chat_list}
    ChatPage.Connect User
    ChatPage.Send New Message
    ${new_cnt_items} =    Get Element Count    ${Chat_list}
    IF  ${initial_cnt_items + 1} == ${new_cnt_items}
        ChatPage.Verify New Message Fetched
    ELSE
        Fail    New message was not added
    END

Remove Message
    [Arguments]    ${LOGIN_URL}    ${LOGIN_USER}
    LoginApp.Positive Login    ${LOGIN_URL}    ${LOGIN_USER}
    ${initial_cnt_items} =    Get Element Count    ${Chat_list}
    ChatPage.Connect User
    ChatPage.Delete Message
    ${new_cnt_items} =    Get Element Count    ${Chat_list}
    IF  ${initial_cnt_items - 1} == ${new_cnt_items}
        ChatPage.Verify Message Was Deleted
    ELSE
        Fail    Message was not deleted
    END
    


