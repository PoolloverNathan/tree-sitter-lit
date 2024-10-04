"let" @keyword
(text_identifier) @attribute
(applied_type name: (_) @type)
(primitive_type) @type.builtin
":" @punctuation.delimiter
"number" @type.builtin
(ERROR) @property
"nil" @variable.builtin
"true" @variable.builtin
"false" @variable.builtin
(number) @number
"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"," @punctuation.delimiter
(shebang program: _ @type.builtin argument: _? @string) @punctuation.delimiter
; "{" @punctuation.bracket
; "}" @punctuation.bracket
