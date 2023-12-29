*** Settings ***
Resource    ./API/APIHelper.robot


*** Variables ***
${Endpoint_change_password} =    /changePassword


*** Keywords ***
Positive Registration Change Password Delete Account API
    [Arguments]    ${API_DOMAIN}    ${API_USER}
    # CREATE new user
    ${response_create} =    APIHelper.Registration New User API    ${API_DOMAIN}    ${API_USER}

    # Get token
    ${extracted_token}    Set Variable    ${response_create.json()['token']}
    APIHelper.Verify Statis Code OK    ${response_create}

    Log    User was created
    Sleep    5s
    
    # CHANGE his password
    Create Session    changePasswordSession    ${API_DOMAIN}
    ${body_change} =    Create Dictionary    oldPassword=${API_USER.OldPassword}    newPassword=${API_USER.NewPassword}
    ${headers_change} =    Create Dictionary    Content-Type=application/json    Authorization=Bearer ${extracted_token}
    ${response_change} =    PATCH On Session    changePasswordSession    ${Endpoint_change_password}    json=${body_change}    headers=${headers_change}

    APIHelper.Verify Statis Code OK    ${response_change}

    Log    Password was changed
    Sleep    5s

    # DELETE this account
    ${response_delete} =    APIHelper.Delete Account API    ${API_DOMAIN}    ${extracted_token}
    APIHelper.Verify Statis Code OK    ${response_delete}

    Log    Account was deleted
    Sleep    5s