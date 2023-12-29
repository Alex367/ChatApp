*** Settings ***
Library    SeleniumLibrary

*** Keywords ***
Begin Web Test
    Open Browser    about:blank    chrome
    Maximize Browser Window

End Web Test
    Sleep    3s
    Close Browser

# Insert Testing Data
    # Log    I am setting up the test data...

# Cleanup Testing Data
#     Log    I am cleanig up the test data...