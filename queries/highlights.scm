(let_statement
	"let" @keyword
	name: (_) @attribute)
":" @operator
"=" @operator
"+" @operator
"-" @operator
"/" @operator
"*" @operator
"×" @operator
"÷" @operator
(primitive_type) @type.builtin
(applied_type
  name: (_) @type)
(union_type "||" @operator)
(add_type "+" @operator)
(ERROR) @error
(nil) @variable.builtin
(string) @string
(boolean) @variable.builtin
(number) @number
"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"," @punctuation.delimiter
(shebang program: _ @type.builtin argument: _? @string) @punctuation.delimiter
; "{" @punctuation.bracket
; "}" @punctuation.bracket
