/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "lit",
  word: $ => $.text_identifier,
  supertypes: $ => [$._statement, $._pat, $._expression, $._type],
  conflicts: $ => [[$.block, $.block_expr]],

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => seq(optional($.shebang), repeat(seq($._statement))),
    shebang: $ => seq(/#!/, field("program", $.nonword), optional(field("argument", $.nonword))),

    //{{{1 statements
    _statement: $ => choice(
      $.expr_stateent,
      $.if_statemnt,
      $.let_statement,
      $.fun_statement,
      $.block,
      $.fake_stmt,
    ),
    expr_stateent: $ => seq($._expression, ";"),
    if_statemnt: $ => seq("if", field("condition", $._expression), choice(field("body", $.block), seq(":", field("body", $._statement)))),
    let_statement: $ => seq("let", field("name", $._identifier), optional(seq(":", field("type", $._type))), optional(seq("=", field("value", $._expression)))),
    fun_statement: $ => seq("fun", field("name", $._identifier), $._fun_rhs),
    block: $ => seq("{", field("body", repeat($._statement)), optional(field("return", $._expression)), "}"),
    fake_stmt: $ => "?stmt?",


    //{{{1 functions
    _fun_rhs: $ => seq("(", field("args", optional(seq($.fun_arg, repeat(seq(",", $.fun_arg))))), ")"),
    fun_arg: $ => $._pat,

    //{{{1 patterns
    _pat: $ => choice(
      $.ident_pat,
      $.type_pat,
      $.fake_pat,
    ),
    ident_pat: $ => $._identifier,
    type_pat: $ => seq($._pat, ":", $._type),
    fake_pat: $ => "?pat?",

    //{{{1 expressions
    _expression: $ => choice(
      $._constant,
      $.block_expr,
      $.fun_expr,
      $.fun_call,
      $._binop,
      $.paren_expr,
      $.fake_expr,
    ),
    fake_expr: $ => "?expr",
    paren_expr: $ => seq(/\(/, $._expression, /\)/),
    block_expr: $ => seq("{", field("body", repeat($._statement)), optional(field("return", $._expression)), "}"),
    fun_expr: $ => "_",
    fun_call: $ => "__",
    _binop: $ => choice($.add, $.sub, $.mul, $.div),
    add: $ => prec.left(1, seq(field("left", $._expression), "+", field("right", $._expression))),
    sub: $ => prec.left(1, seq(field("left", $._expression), "-", field("right", $._expression))),
    mul: $ => prec.left(2, seq(field("left", $._expression), choice("*", "×"), field("right", $._expression))),
    div: $ => prec.left(2, seq(field("left", $._expression), choice("/", "÷"), field("right", $._expression))),

    //{{{1 types
    _type: $ => choice(
      $.union_type,
      $.add_type,
      $.primitive_type,
      $.applied_type,
      $.array_type,
      $.tuple_type,
      $._constant,
      $.paren_type,
      $.fake_type,
    ),
    paren_type: $ => seq("(", $._type, ")"),
    union_type: $ => prec.left(4, seq($._type, "||", $._type)),
    add_type: $ => prec.left(3, seq($._type, "+", $._type)),
    array_type: $ => seq("[", $._type, "]"),
    applied_type: $ => seq(field("name", $._identifier), optional(seq("(", optional(field("args", $._type_args)), ")"))),
    tuple_type: $ => seq("(", optional(seq($._type, ",", optional(seq($._type, repeat(seq(",", $._type)))))), ")"),
    primitive_type: $ => choice("number", "string", "boolean"),
    fake_type: $ => "?type",
    _identifier: $ => choice($.text_identifier, $.emoji_identifier),
    _identifier_with_colon: $ => choice(seq($.text_identifier, ":"), seq($.emoji_identifier, optional(":"))),
    _type_args: $ => choice($.vararg, seq($._type, repeat(seq(",", $._type)), optional(seq(",", $.vararg)))),

    //{{{1 constants — acceptable as both types and values
    _constant: $ => choice(
      $.number,
      $.boolean,
      $.string,
      $.nil,
    ),
    string: $ => /""/,
    number: $ => /\d+/,
    boolean: $ => choice("true", "false"),
    nil: $ => "nil",

    //{{{1 pieces
    nonword: $ => /\S+/,
    vararg: $ => "...",
    text_identifier: $ => /\p{XID_Start}\p{XID_Continue}*/,
    emoji_identifier: $ => /\p{Emoji}/,

    //}}}1
  }
});
