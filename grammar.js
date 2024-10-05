/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "lit",
  word: $ => $.text_identifier,

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => seq(optional($.shebang), repeat(seq($._statement))),
    shebang: $ => seq(/#!/, field("program", $.nonword), optional(field("argument", $.nonword))),
    _statement: $ => choice(
      $.let_statement,
    ),
    let_statement: $ => seq("let", field("name", $._identifier), optional(seq(":", field("type", $._type))), optional(seq("=", field("value", $._expression)))),

    // expressions
    _expression: $ => choice(
      $._constant,
      $.block_expr,
      $.fun_expr,
      $.fun_call,
      $._binop,
      // seq("(", $._expression, ")"),
    ),
    block_expr: $ => seq("{", field("body", repeat($._statement)), optional(field("return", $._expression)), "}"),
    fun_expr: $ => "_",
    fun_call: $ => "__",
    _binop: $ => choice($.add, $.sub, $.mul, $.div),
    add: $ => prec.left(1, seq(field("left", $._expression), "+", field("right", $._expression))),
    sub: $ => prec.left(1, seq(field("left", $._expression), "-", field("right", $._expression))),
    mul: $ => prec.left(2, seq(field("left", $._expression), choice("*", "×"), field("right", $._expression))),
    div: $ => prec.left(2, seq(field("left", $._expression), choice("/", "÷"), field("right", $._expression))),

    // typesystem
    _type: $ => choice(
      $.union_type,
      $.add_type,
      $.primitive_type,
      $.applied_type,
      $.array_type,
      $.tuple_type,
      $._constant,
      seq("(", $._type, ")"),
    ),
    union_type: $ => prec.left(4, seq($._type, "||", $._type)),
    add_type: $ => prec.left(3, seq($._type, "+", $._type)),
    array_type: $ => seq("[", $._type, "]"),
    applied_type: $ => seq(field("name", $._identifier), optional(seq("(", optional(field("args", $._type_args)), ")"))),
    tuple_type: $ => seq("(", optional(seq($._type, ",", optional(seq($._type, repeat(seq(",", $._type)))))), ")"),
    primitive_type: $ => choice("number", "string", "boolean"),
    _identifier: $ => choice($.text_identifier, $.emoji_identifier),
    _identifier_with_colon: $ => choice(seq($.text_identifier, ":"), seq($.emoji_identifier, optional(":"))),
    _type_args: $ => seq(choice($._type, "~"), repeat(seq(",", choice($._type, "~")))),

    // constants — acceptable as both types and values
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

    // pieces
    nonword: $ => /\S+/,
    text_identifier: $ => /\p{XID_Start}\p{XID_Continue}*/,
    emoji_identifier: $ => /\p{Emoji}/,
  }
});
