import { STATUS } from "../errorStates.js";
import { KEYWORDS, OPERATORS, SPECIALS } from "../tokenizer/tokenizer.js";
import { TYPES } from "../tokenizer/tokens.js";
import { Fail, OPERATIONS } from "./parser.js";


export const testToken = (token, type, value) => {
  if( !token )
  return false;

  if( type && token.type !== type )
  return false;

  if( value && token.value !== value )
  return false;

  return true;
};

export const tokenAt = (target, position) => {
  if( position < 0 || position >= target.length )
  return null;

  return target[position];
};

export const attemptParse = (target, startPosition, parsers) => {
  for( let parse of parsers )
  {
    const parseResult = parse(target, startPosition);

    if( parseResult.errorStatus.status === STATUS.successful )
    return parseResult;
  }

  return Fail(startPosition);
};

export const combineBlocks = (block, targetBlock) => {
  targetBlock.operations = targetBlock.operations.concat(block.operations);
  return targetBlock;
};


// HELPER FUNCTIONS FOR TOKEN TESTING

export const isValue = (token) => (
    testToken(token, TYPES.string) ||
    testToken(token, TYPES.number) ||
    testToken(token, TYPES.boolean) ||
    testToken(token, TYPES.keyword, KEYWORDS.null) ||
    testToken(token, TYPES.keyword, KEYWORDS.NaN)
);

export const isReference = (token) => (
  testToken(token, TYPES.identifier) ||
  testToken(token, TYPES.builtIn)
);

export const isFieldName = (token) => (
  testToken(token, TYPES.identifier) ||
  testToken(token, TYPES.builtIn) ||
  testToken(token, TYPES.string)
);

export const isFieldIdentifier = (token) => (
  testToken(token, TYPES.identifier) ||
  testToken(token, TYPES.builtIn)
);

export const isAccess = (token) => {
  if( token.type !== TYPES.special )
  return false;

  const value = token.value;
  return (
    value === SPECIALS.arrayStart ||
    value === SPECIALS.fieldAccess
  );
};

export const isVariableDeclaration = (token) => {
  if( token.type !== TYPES.keyword )
  return false;

  const value = token.value;
  return (
    value === KEYWORDS.const ||
    value === KEYWORDS.let
  );
};

export const isFirstOrderKeyword = (token) => {
  if( token.type !== TYPES.keyword )
  return false;

  const value = token.value;
  return (
    value === KEYWORDS.let ||
    value === KEYWORDS.const ||
    value === KEYWORDS.do ||
    value === KEYWORDS.for ||
    value === KEYWORDS.if ||
    value === KEYWORDS.repeat ||
    value === KEYWORDS.return ||
    value === KEYWORDS.switch ||
    value === KEYWORDS.while
  );
};

export const isIdentifier = (token) => testToken(token, TYPES.identifier);
export const isFieldAccess = (token) => testToken(token, TYPES.special, SPECIALS.fieldAccess);
export const isArrayStart = (token) => testToken(token, TYPES.special, SPECIALS.arrayStart);
export const isArrayEnd = (token) => testToken(token, TYPES.special, SPECIALS.arrayEnd);
export const isExpressionStart = (token) => testToken(token, TYPES.special, SPECIALS.expressionStart);
export const isExpressionEnd = (token) => testToken(token, TYPES.special, SPECIALS.expressionEnd);
export const isBlockStart = (token) => testToken(token, TYPES.special, SPECIALS.blockStart);
export const isBlockEnd = (token) => testToken(token, TYPES.special, SPECIALS.blockEnd);
export const isSequenceSeparator = (token) => testToken(token, TYPES.special, SPECIALS.sequenceSeparator);
export const isSequenceEnd = (token) => testToken(token, TYPES.special, SPECIALS.sequenceEnd);
export const isOperator = (token) => testToken(token, TYPES.operator);
export const isFieldStart = (token) => testToken(token, TYPES.special, SPECIALS.fieldStart);
export const isAssignment = (token) => testToken(token, TYPES.operator, OPERATORS.assign);
export const isFunctionDeclaration = (token) => testToken(token, TYPES.keyword, KEYWORDS.function);
export const isReturn = (token) => testToken(token, TYPES.keyword, KEYWORDS.return);
export const isYield = (token) => testToken(token, TYPES.keyword, KEYWORDS.yield);
export const isImport = (token) => testToken(token, TYPES.keyword, KEYWORDS.import);

export const isFunctionCall = (token) => (token.type === TYPES.operation && token.operator === OPERATIONS.call);
export const isBuiltIn = (token) => (token.type === TYPES.builtIn);