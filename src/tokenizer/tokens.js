/**
 * Types of tokens output by the tokenizer.
 */
export const TYPES = {
  string: "string",
  number: "number",
  boolean: "boolean",
  identifier: "identifier",
  keyword: "keyword",
  builtIn: "builtIn",
  operator: "operator",
  special: "special",
  operation: "operation",
  block: "block"
};

const Token = (type, value) => {
  return {
    type,
    value
  };
};

export const SString = (value = "") => {
  return Token(TYPES.string, value);
};

export const SNumber = (value = 0) => {
  return Token(TYPES.number, value);
};

export const SBoolean = (value = false) => {
  return Token(TYPES.boolean, value);
};

export const Identifier = (value = "") => {
  return Token(TYPES.identifier, value);
};

export const Keyword = (value = "") => {
  return Token(TYPES.keyword, value);
};

export const BuiltIn = (value = "") => {
  return Token(TYPES.builtIn, value);
};

export const Operator = (value = "") => {
  return Token(TYPES.operator, value);
};

export const Special = (value = "") => {
  return Token(TYPES.special, value);
};
