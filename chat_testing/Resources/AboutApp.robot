*** Settings ***
Resource    ./PO/AboutPage.robot


*** Keywords ***
Positive Open Test
    [Arguments]    ${ABOUT_URL}
    AboutPage.Load Page    ${ABOUT_URL}
    AboutPage.Verify About Page Loaded