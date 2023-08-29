- parser
    -- else of an if-statement is not parsed properly (doesn't accept Lines, only accepts BlockStatements)

- interpreter
    -- change `ATYPES` into integers to preserve memory while interpreting

FOR NEXT VERSION
- special characters should be treated as operators? (this could give proper precedence to nested function calls)
- re-think memory architecture especially in interpreter (can stacks replace temporary variables?)