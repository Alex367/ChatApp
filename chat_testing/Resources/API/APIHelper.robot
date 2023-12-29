*** Settings ***
Library    RequestsLibrary


*** Variables ***
${Endpoint_registration} =    /registration
${Endpoint_delete_account} =    /settings


*** Keywords ***
Verify Statis Code OK
    [Arguments]    ${Response}
    ${code_delete} =    Convert To String    ${Response.status_code}
    Should Be Equal    ${code_delete}    201

Registration New User API
    [Arguments]    ${API_DOMAIN}    ${API_USER}
    Create Session    createUserSession    ${API_DOMAIN}
    ${body_create} =    Create Dictionary    username=${API_USER.Username}    email=${API_USER.Email}    password=${API_USER.OldPassword}    repeatPassword=${API_USER.OldPassword}
    ${headers_create} =    Create Dictionary    Content-Type=application/json
    ${response_create} =    POST On Session    createUserSession    ${Endpoint_registration}    json=${body_create}    headers=${headers_create}
    [return]    ${response_create}

Delete Account API
    [Arguments]    ${API_DOMAIN}    ${TOKEN}
    Create Session    deleteAccountSession    ${API_DOMAIN}
    ${headers_delete} =    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${TOKEN}
    ${response_delete} =    DELETE On Session    deleteAccountSession    ${Endpoint_delete_account}    headers=${headers_delete}
    [return]    ${response_delete}