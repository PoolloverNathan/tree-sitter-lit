/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "lit",
  word: $ => $.text_identifier,

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => repeat($.statement),
    statement: $ => seq("let", choice($._identifier, seq($._identifier_with_colon, $.union)), "=", $.number),
    union: $ => seq($.type, repeat(seq("||", $.type))),
    type: $ => seq($.basic_type, repeat(seq("+", $.basic_type))),
    basic_type: $ => choice($.primitive, $.applied_type, seq("[", $.basic_type, "]"), $.tuple_type),
    applied_type: $ => seq(field("name", $._identifier), optional(seq("[", optional(field("args", $._type_args)), "]"))),
    tuple_type: $ => choice(seq("(", ")"), seq("(", $.union, ",", optional(seq($.union, repeat(seq(",", $.union)))), ")")),
    primitive: $ => choice("number", "string", "boolean"),
    const_type: $ => choice($.number, $.boolean, $.string, "nil"),
    string: $ => /""/,
    number: $ => /\d+/,
    boolean: $ => choice("true", "false"),
    _identifier: $ => choice($.text_identifier, $.emoji_identifier),
    _identifier_with_colon: $ => choice(seq($.text_identifier, ":"), seq($.emoji_identifier, optional(":"))),
    _type_args: $ => seq(choice($.union, "~"), repeat(seq(",", choice($.union, "~")))),
    text_identifier: $ => /\p{XID_Start}\p{XID_Continue}*/,
    emoji_identifier: $ => /\p{Emoji}/,
  }
});
