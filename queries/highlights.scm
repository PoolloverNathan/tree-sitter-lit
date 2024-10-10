(let_statement
  "let" @keyword
  ":"? @punctuation.delimiter
  "="? @punctuation.delimiter
  ";" @punctuation.delimiter
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
(throw_expr "throw" @keyword)
(panic_expr "panic" @keyword)
(ohfuck_expr "ohfuck" @keyword)
(expr_stateent ";" @punctuation.delimiter)
(add "+" @operator)
(sub "-" @operator)
(div "/" @operator)
(mul "*" @operator)
(mul "×" @operator)
(div "÷" @operator)
(fake_stmt) @constant
(fake_pat) @constant
(ident_pat) @property
(string lang: (text_identifier) @injection.language content: (_) @injection.content)
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
(string_fragment) @string
(fun_call "(" @punctuation.bracket ")" @punctuation.bracket)
(fun_call fn: (var_expr) @function)
(splice
  "\\" @escape
  "(" @punctuation.bracket
  ")" @punctuation.delimiter)
(boolean) @variable.builtin
(number) @number
(shebang program: _ @type.builtin argument: _? @string) @punctuation.delimiter
