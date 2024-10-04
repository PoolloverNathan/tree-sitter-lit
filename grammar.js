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
    let_statement: $ => seq("let", choice(field("names", $._identifier), seq($._identifier_with_colon, field("type", $.union))), "=", $._expression),

    // expressions
    _expression: $ => choice(
      $.constant,
      $.block_expr,
      $.fun_expr,
      $.fun_call,
      $._binop,
    ),
    block_expr: $ => seq("{", field("body", repeat($._statement)), optional(field("return", $._expression)), "}"),
    fun_expr: $ => "_",
    fun_call: $ => "__",
    _binop: $ => choice($.add, $.sub, $.mul, $.div),
    add: $ => seq(field("left", $._expression), "+", field("right", $._expression)),
    sub: $ => seq(field("left", $._expression), "-", field("right", $._expression)),
    mul: $ => seq(field("left", $._expression), "*", field("right", $._expression)),
    div: $ => seq(field("left", $._expression), "/", field("right", $._expression)),

    // typesystem
    union: $ => seq($.type, repeat(seq("||", $.type))),
    type: $ => seq($.basic_type, repeat(seq("+", $.basic_type))),
    basic_type: $ => choice(
      $.primitive_type,
      $.applied_type,
      seq("[", $.basic_type, "]"),
      $.tuple_type,
      $.constant,
      seq("(", $.union, ")"),
    ),
    applied_type: $ => seq(field("name", $._identifier), optional(seq("[", optional(field("args", $._type_args)), "]"))),
    tuple_type: $ => choice(seq("(", ")"), seq("(", $.union, ",", optional(seq($.union, repeat(seq(",", $.union)))), ")")),
    primitive_type: $ => choice("number", "string", "boolean"),
    _identifier: $ => choice($.text_identifier, $.emoji_identifier),
    _identifier_with_colon: $ => choice(seq($.text_identifier, ":"), seq($.emoji_identifier, optional(":"))),
    _type_args: $ => seq(choice($.union, "~"), repeat(seq(",", choice($.union, "~")))),

    // constants — acceptable as both types and values
    constant: $ => choice(
      $.number,
      $.boolean,
      $.string,
      "nil",
    ),
    string: $ => /""/,
    number: $ => /\d+/,
    boolean: $ => choice("true", "false"),

    // pieces
    nonword: $ => /\S+/,
    text_identifier: $ => /\p{XID_Start}\p{XID_Continue}*/,
    emoji_identifier: $ => /\p{Emoji}/,
  }
});
