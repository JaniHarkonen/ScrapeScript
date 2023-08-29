import Program from "./statements/Program.js";

import { STATUS } from "../errorStates.js";
import { OPERATORS } from "../tokenizer/tokenizer.js";
import { TYPES } from "../tokenizer/tokens.js";

/**
 * The names of the operations that will be used to form the 
 * nodes of the AST.
 */
export const OPERATIONS = {
  access: "access",
  call: "call",
  json: "json",
  array: "array",
  function: "function",
  init: "init",
  return: "return",
  if: "if",
  repeat: "repeat",
  while: "while",
  break: "break",
  continue: "continue",
  doWhile: "doWhile",
  for: "for",
  case: "case",
  default: "default",
  switch: "switch",
  yield: "yield",
  import: "import"
};

/**
 * Associativity indicates to the parser whether the left side or the 
 * right side of the operator will be prioritized upon execution.
 */
export const ASSOCIATIVITY = {
  left: "left",
  right: "right"
};

export const PrecedenceEntry = (precedence, associativity = ASSOCIATIVITY.left) => {
  return {
    precedence,
    associativity
  };
};

/**
 * Mapping of operators to their PrecedenceEntries, which contain
 * the precedence score of the operator as well as its associativity.
 * The lower the precedence score the earlier the operation will be
 * executed.
 */
export const PRECEDENCE = {
  [OPERATORS.increment]:      PrecedenceEntry(1),
  [OPERATORS.decrement]:      PrecedenceEntry(1),

  [OPERATORS.not]:            PrecedenceEntry(2, ASSOCIATIVITY.right),

  [OPERATORS.multiply]:       PrecedenceEntry(3),
  [OPERATORS.divide]:         PrecedenceEntry(3),
  [OPERATORS.modulo]:         PrecedenceEntry(3),

  [OPERATORS.add]:            PrecedenceEntry(4),
  [OPERATORS.subtract]:       PrecedenceEntry(4),

  [OPERATORS.shiftLeft]:      PrecedenceEntry(5),
  [OPERATORS.shiftRight]:     PrecedenceEntry(5),

  [OPERATORS.greater]:        PrecedenceEntry(6),
  [OPERATORS.less]:           PrecedenceEntry(6),
  [OPERATORS.greaterOrEqual]: PrecedenceEntry(6),
  [OPERATORS.lessOrEqual]:    PrecedenceEntry(6),

  [OPERATORS.equals]:         PrecedenceEntry(7),
  [OPERATORS.notEquals]:      PrecedenceEntry(7),

  [OPERATORS.and]:            PrecedenceEntry(8),

  [OPERATORS.xor]:            PrecedenceEntry(9),

  [OPERATORS.or]:             PrecedenceEntry(10),

  [OPERATORS.ands]:           PrecedenceEntry(11),

  [OPERATORS.ors]:            PrecedenceEntry(12),

  [OPERATORS.assign]:         PrecedenceEntry(13, ASSOCIATIVITY.right),
  [OPERATORS.addAssign]:      PrecedenceEntry(13, ASSOCIATIVITY.right),
  [OPERATORS.subtractAssign]: PrecedenceEntry(13, ASSOCIATIVITY.right),
  [OPERATORS.multiplyAssign]: PrecedenceEntry(13, ASSOCIATIVITY.right),
  [OPERATORS.divideAssign]:   PrecedenceEntry(13, ASSOCIATIVITY.right),
  [OPERATORS.andAssign]:      PrecedenceEntry(13, ASSOCIATIVITY.right),
  [OPERATORS.orAssign]:       PrecedenceEntry(13, ASSOCIATIVITY.right),
  [OPERATORS.xorAssign]:      PrecedenceEntry(13, ASSOCIATIVITY.right),
  [OPERATORS.moduloAssign]:   PrecedenceEntry(13, ASSOCIATIVITY.right)
};

export const Operation = (operator = "", ...args) => {
  if( args.length === 0 )
  args = [null];

  return {
    type: TYPES.operation,
    operator,
    arguments: (args.length === 1) ? [...args, null] : [...args]
  }
};

export const Block = (operations = null) => {
  return {
    type: TYPES.block,
    operations
  };
};

export const Result = (position = -1) => {
  return {
    position
  };
};

export const Success = (position, result = null) => {
  return {
    ...Result(position),
    result,
    errorStatus: {
      status: STATUS.successful
    }
  };
};

export const Fail = (position) => {
  return {
    ...Result(position),
    errorStatus: {
      status: STATUS.failed
    }
  };
};

export const getOperatorPrecedence = (token) => {
  if( !token )
  return PrecedenceEntry(-1);

  return PRECEDENCE[token.value];
};

export const getOperationPrecedence = (operation) => {
  if( !operation || operation.type !== TYPES.operation )
  return PrecedenceEntry(-1);

  return PRECEDENCE[operation.operator];
}

export default function parse(tokens) {
  if( !tokens || tokens.length === 0 )
  {
    return {
      operations: [],
      errorStatus: {
        status: STATUS.fatalError,
        message: "Parsing failed! No tokens provided or the token array is NULL."
      }
    };
  }

  const operations = [];
  operations.push(Program(tokens, 0).result);
  
  return operations;
}
