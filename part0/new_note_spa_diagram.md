## New note in single page app diagram
```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: The browser creates local note from user input and prevent the default behavior.

    Note right of browser: The browser add the note to the notes list and reset the form.

    Note right of browser: The browser executes the callback function that render the notes.

    browser ->> server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    browser ->> server: {content: "Hieu Akisuri from VN!", date: "2024-12-20T15:14:52.236Z"}
    activate server
    server ->> browser: {"message":"note created"}
    deactivate server
    
```