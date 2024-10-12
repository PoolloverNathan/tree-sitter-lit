/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

// from https://github.com/tjdevries/tree-sitter-lua/blob/master/grammar.js

const sep = (inner, sep = ",") => optional(seq(inner, repeat(seq(sep, inner)), optional(sep)))
const choice1 = (...members) => members.length == 1 ? members[0] : choice(...members)
const binop = (level, ...ops) => $ => prec.left(level, seq(field("left", $._expression), choice1(...ops), field("right", $._expression)))

module.exports = grammar({
  name: "lit",
  word: $ => $.text_identifier,
  supertypes: $ => [$._statement, $._pat, $._expression, $._type],
  conflicts: $ => [[$.block, $.block_expr]],
  precedences: $ => [
    [
      "post",
      "pre",
      "mul",
      "add",
      "shift",
      "noteq",
      "eq",
      "and",
      "xor",
      "or",
      "throw",
      "anyway",
    ]
  ],
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
    let_statement: $ => seq("let", field("var", $._pat), optional(seq("=", field("value", $._expression))), ";"),
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
      $.throw_expr,
      $.panic_expr,
      $.ohfuck_expr,
      $.anyway_expr,
      $.fake_expr,
      $.var_expr,
    ),
    fake_expr: $ => "?expr?",
    anyway_expr: $ => prec.right("anyway", seq($._expression, "anyway", $._expression)),
    var_expr: $ => $._identifier,
    paren_expr: $ => seq(/\(/, $._expression, /\)/),
    block_expr: $ => seq("{", field("body", repeat($._statement)), optional(field("return", $._expression)), "}"),
    fun_expr: $ => "_",
    fun_call: $ => prec("post", seq(field("fn", $._expression), "(", field("args", sep($._expression)), ")")),
    _binop: $ => choice(
      $.add,
      $.sub,
      $.mul,
      $.div,
      $.or,
      $.and,
      $.xor,
      $.eq,
      $.ne,
      $.lt,
      $.le,
      $.gt,
      $.ge,
    ),
    throw_expr: $ => prec("throw", seq("throw", field("error", $._expression))),
    panic_expr: $ => prec("throw", seq("panic", field("message", $.string))),
    ohfuck_expr: $ => prec("throw", seq("ohfuck", field("message", $.string))),
    add: binop("add", "+"),
    sub: binop("add", "-"),
    mul: binop("mul", "*", "×"),
    div: binop("mul", "/", "÷"),
    or: binop("or", "or", "||"),
    and: binop("and", "and", "&&"),
    xor: binop("xor", "xor", "~~"),
    eq: binop("eq", "=="),
    ne: binop("eq", "!=", "~=", "≠", "≠≠"),
    lt: binop("noteq", "<"),
    le: binop("noteq", "<=", "≤"),
    gt: binop("noteq", ">"),
    ge: binop("noteq", ">=", "≥"),

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
    fake_type: $ => "?type?",
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
    string: $ => choice($._straight_string, $._curly_string, $._inject_string),
    
    nested_string: $ => $._curly_string,
    unescaped_string_fragment: _ => token.immediate(prec(1, /[^"“”\\]+/)),
    _string_contents: $ => choice(
      alias($.unescaped_string_fragment, $.string_fragment),
      $.nested_string,
      $.splice,
      // $.escape_sequence,
    ),
    splice: $ => seq("\\", token.immediate("("), $._expression, ")"),
    _straight_string: $ => seq(
      '"',
      field("content", repeat($._string_contents)),
      '"',
    ),
    _curly_string: $ => seq(
      "“",
      field("content", repeat($._string_contents)),
      "”",
    ),
    _inject_string: $ => seq(
      field("lang", $.text_identifier),
      "“",
      field("content", repeat($._string_contents)),
      "”",
    ),

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
