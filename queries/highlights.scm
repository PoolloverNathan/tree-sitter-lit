(let_statement
  "let" @keyword
  name: (_) @attribute
  ":"? @punctuation.delimiter
  "="? @punctuation.delimiter
  )
(if_statemnt
  "if" @keyword
  ":"? @punctuation.delimiter)
(block
  "{" @punctuation.bracket
  "}" @punctuation.bracket)
(block_expr
  "{" @punctuation.bracket
  "}" @punctuation.bracket)
(add "+" @operator)
(sub "-" @operator)
(div "/" @operator)
(mul "*" @operator)
(mul "×" @operator)
(div "÷" @operator)
(fake_stmt) @constant
(fake_pat) @constant
(fake_expr) @constant
(fake_type) @constant
(primitive_type) @type.builtin
(applied_type
  name: (_) @type
  "(" @punctuation.bracket
  "," @punctuation.delimiter
  ")" @punctuation.bracket)
(array_type
  "[" @punctuation.bracket
  "]" @punctuation.bracket)
(tuple_type
  "(" @punctuation.bracket
  "," @punctuation.delimiter
  ")" @punctuation.bracket)
(union_type "||" @operator)
(add_type "+" @operator)
(ERROR) @error
(nil) @variable.builtin
(string) @string
(boolean) @variable.builtin
(number) @number
(shebang program: _ @type.builtin argument: _? @string) @punctuation.delimiter
