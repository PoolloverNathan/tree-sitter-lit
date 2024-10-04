"let" @keyword
(text_identifier) @attribute
(applied_type name: (_) @type)
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
; "{" @punctuation.bracket
; "}" @punctuation.bracket
