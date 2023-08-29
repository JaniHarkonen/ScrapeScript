import { ERRORS, throwFatalError } from "../ERRORS.js";
import { STATUS } from "../errorStates.js";
import { BuiltIn, Identifier, Keyword, Operator, SBoolean, SNumber, SString, Special } from "./tokens.js";


/**
 * "Enumeration" of reserved ScrapeScritp keywords.
 */
export const KEYWORDS = {
  let: "let",
  const: "const",
  if: "if",
  else: "else",
  switch: "switch",
  case: "case",
  default: "default",
  for: "for",
  while: "while",
  continue: "continue",
  break: "break",
  do: "do",
  repeat: "repeat",
  function: "function",
  return: "return",
  null: "null",
  NaN: "NaN",
  yield: "yield",
  import: "import"
};

/**
 * "Enumeration" of reserved function names that represent the 
 * built-in functions of ScrapeScript.
 */
export const BUILT_IN = {
  print: "print",
  floor: "floor",
  round: "round",
  ceil: "ceil",
  indexOf: "indexOf",
  lastIndexOf: "lastIndexOf",
  substring: "substring",
  length: "length",
  parseNumber: "parseNumber",
  parseBoolean: "parseBoolean",
  push: "push",
  pop: "pop",
  remove: "remove",
  shift: "shift",
  unshift: "unshift",
  insert: "insert",
  concat: "concat",
  replace: "replace",
  replaceAll: "replaceAll",
  split: "split",
  typeOf: "typeOf",
  isNaN: "isNaN",
  keys: "keys",
  stringify: "stringify",
  includes: "includes",
  combine: "combine",
  random: "random",
  sqrt: "sqrt",
  max: "max",
  min: "min",
  abs: "abs",
  clamp: "clamp",
  sign: "sign",
  getArgument: "getArgument",
  charAt: "charAt",
  timeNow: "timeNow"
};

/**
 * "Enumeration" of the identifiers of operations
 * available in ScrapeScript.
 */
export const OPERATORS = {
  add: "add",                           // +
  subtract: "subtract",                 // -
  multiply: "multiply",                 // *
  divide: "divide",                     // /
  increment: "increment",               // ++
  decrement: "decrement",               // --
  assign: "assign",                     // =
  addAssign: "addAssign",               // +=
  subtractAssign: "subtractAssign",     // -=
  multiplyAssign: "multiplyAssign",     // *=
  divideAssign: "divideAssign",         // /=
  equals: "equals",                     // ==
  notEquals: "notEquals",               // !=
  greater: "greater",                   // >
  less: "less",                         // <
  greaterOrEqual: "greaterOrEqual",     // >=
  lessOrEqual: "lessOrEqual",           // <=
  not: "not",                           // !
  and: "and",                           // &
  ands: "ands",                         // &&
  andAssign: "andAssign",               // &=
  or: "or",                             // |
  ors: "ors",                           // ||
  orAssign: "orAssign",                 // |=
  xor: "xor",                           // ^
  xorAssign: "xorAssign",               // ^=
  modulo: "modulo",                     // %
  moduloAssign: "moduloAssign",         // %=
  shiftLeft: "shiftLeft",               // <<
  shiftRight: "shiftRight"              // >>
};

/**
 * "Enumeration" of special characters used by ScrapeScript.
 */
export const SPECIALS = {
  expressionStart: "expressionStart",           // (
  expressionEnd: "expressionEnd",               // )
  blockStart: "blockStart",                     // {
  blockEnd: "blockEnd",                         // }
  arrayStart: "arrayStart",                     // [
  arrayEnd: "arrayEnd",                         // ]
  fieldAccess: "fieldAccess",                   // .
  sequenceSeparator: "sequenceSeparator",       // ,
  sequenceEnd: "sequenceEnd",                   // ;
  fieldStart: "fieldStart"                      // :
};

const Result = (position = -1) => {
  return {
    errorStatus: null,
    position
  };
};

const Success = (position = -1, tokens = []) => {
  return {
    ...Result(position),
    tokens,
    errorStatus: {
      status: STATUS.successful
    }
  };
};

const Fail = (position = -1) => {
  return {
    ...Result(position),
    errorStatus: {
      status: STATUS.failed
    }
  };
};

const getString = (target, startPosition) => {
  const firstChar = target.charAt(startPosition);

    // First character must be " or ', ending character must be the same
  if( firstChar !== '"' && firstChar !== "'" )
  return Fail(startPosition);

  const quote = firstChar;

    // Handle empty string
  if( target.charAt(startPosition + 1) === quote )
  return Success(startPosition + 2, SString(""));

  let extractedString = "";
  let lastChar = null;
  let i;
  for( i = startPosition + 1; i < target.length; i++ )
  {
    const currentChar = target.charAt(i);
    let proposedLastChar = currentChar;

    if( currentChar === quote && lastChar !== "\\" )
    break;

    if( currentChar === "\\" )
    {
      if( lastChar === "\\" )
      proposedLastChar = null;
      else
      {
        lastChar = currentChar;
        continue;
      }
    }

    extractedString += currentChar;
    lastChar = proposedLastChar;
  }
  
  return Success(i + 1, SString(extractedString));
};

const getNumber = (target, startPosition) => {
  let isDecimalFound = false;
  let readNumber = "";

  let i;
  let readChar;
  for( i = startPosition; i < target.length; i++ )
  {
    readChar = target.charAt(i);

      // Handle decimal point
    if( readChar === "." )
    {
      if( isDecimalFound )
      throwFatalError(ERRORS.tokenizer, ERRORS.tokenizer.extraDecimal, { f: startPosition });

      isDecimalFound = true;
    }
    else
    {
      const readCharCode = readChar.charCodeAt(0);

        // Number non-number encountered
      if( readCharCode < 48 || readCharCode > 57 )
      {
          // No number was read
        if( readNumber === "" || readNumber === "." )
        return Fail(startPosition);
        else
        break;
      }
    }

    readNumber += readChar;
  }

  return Success(i, SNumber(readNumber));
};

const getIdentifier = (target, startPosition) => {
  let readIdentifier = "";

  let i;
  for( i = startPosition; i < target.length; i++ )
  {
    const currentChar = target.charAt(i);
    const currentCharCode = currentChar.charCodeAt(0);

    if(
      (currentCharCode < 65 || currentCharCode > 90) &&
      (currentCharCode < 97 || currentCharCode > 122) &&
      (currentCharCode < 48 || currentCharCode > 57) &&
      currentChar !== "_"
    )
    {
      if( readIdentifier === "" )
      return Fail(startPosition);

      break;
    }

    readIdentifier += currentChar;
  }

    // Determine if the identifier is a reserved keyword
  if( KEYWORDS[readIdentifier] )
  {
      // Ignore destructured imports
    if( readIdentifier === KEYWORDS.import )
    {
      let isDestructuringFound = false;
      for( let j = i; j < target.length; j++ )
      {
        const currentImportChar = target.charAt(j);

        if( currentImportChar === " " )
        continue;

        if( currentImportChar === "{" )
        isDestructuringFound = true;
        else if( isDestructuringFound )
        {
          if( currentImportChar === ";" )
          return Success(j + 1, null);
        }
        else
        break;
      }
    }

    return Success(i, Keyword(readIdentifier));
  }
  
    // Determine if the identifier is a built-in function
  if( BUILT_IN[readIdentifier] )
  return Success(i, BuiltIn(readIdentifier));

    // Determine if identifier is a boolean
  if( readIdentifier === "true" || readIdentifier === "false" )
  return Success(i, SBoolean((readIdentifier === "true") ? true : false));

  return Success(i, Identifier(readIdentifier));
};

const returnAlternateOperatorConditional = (char, conditionalChar, positionTrue, positionFalse, ifTrue, ifFalse) => {
  if( char === conditionalChar )
  return Success(positionTrue, Operator(ifTrue));

  return Success(positionFalse, Operator(ifFalse));
};

const getOperator = (target, startPosition) => {
  const firstChar = target.charAt(startPosition);
  const secondChar = target.charAt(startPosition + 1);
  let endPosition;

  if( secondChar === "=" )
  {
    endPosition = startPosition + 2;

    switch( firstChar )
    {
      case "+": return Success(endPosition, Operator(OPERATORS.addAssign));
      case "-": return Success(endPosition, Operator(OPERATORS.subtractAssign));
      case "*": return Success(endPosition, Operator(OPERATORS.multiplyAssign));
      case "/": return Success(endPosition, Operator(OPERATORS.divideAssign));
      case "=": return Success(endPosition, Operator(OPERATORS.equals));
      case "!": return Success(endPosition, Operator(OPERATORS.notEquals));
      case ">": return Success(endPosition, Operator(OPERATORS.greaterOrEqual));
      case "<": return Success(endPosition, Operator(OPERATORS.lessOrEqual));
      case "&": return Success(endPosition, Operator(OPERATORS.andAssign));
      case "|": return Success(endPosition, Operator(OPERATORS.orAssign));
      case "^": return Success(endPosition, Operator(OPERATORS.xorAssign));
      case "%": return Success(endPosition, Operator(OPERATORS.moduloAssign));
    }
  }

  endPosition = startPosition + 1;

  switch( firstChar )
  {
    case "+": return returnAlternateOperatorConditional(secondChar, "+", endPosition + 1, endPosition, OPERATORS.increment, OPERATORS.add);
    case "-": return returnAlternateOperatorConditional(secondChar, "-", endPosition + 1, endPosition, OPERATORS.decrement, OPERATORS.subtract);
    case "*": return Success(endPosition, Operator(OPERATORS.multiply));
    case "/": return Success(endPosition, Operator(OPERATORS.divide));
    case "%": return Success(endPosition, Operator(OPERATORS.modulo));
    case "=": return Success(endPosition, Operator(OPERATORS.assign));
    case ">": return returnAlternateOperatorConditional(secondChar, ">", endPosition + 1, endPosition, OPERATORS.shiftRight, OPERATORS.greater);
    case "<": return returnAlternateOperatorConditional(secondChar, "<", endPosition + 1, endPosition, OPERATORS.shiftLeft, OPERATORS.less);
    case "!": return Success(endPosition, Operator(OPERATORS.not));
    case "&": return returnAlternateOperatorConditional(secondChar, "&", endPosition + 1, endPosition, OPERATORS.ands, OPERATORS.and);
    case "|": return returnAlternateOperatorConditional(secondChar, "|", endPosition + 1, endPosition, OPERATORS.ors, OPERATORS.or);
    case "^": return Success(endPosition, Operator(OPERATORS.xor));

    default: return Fail(startPosition);
  }
};

const getSpecial = (target, startPosition) => {
  const char = target.charAt(startPosition);
  const endPosition = startPosition + 1;

  switch( char )
  {
    case "(": return Success(endPosition, Special(SPECIALS.expressionStart));
    case ")": return Success(endPosition, Special(SPECIALS.expressionEnd));
    case "{": return Success(endPosition, Special(SPECIALS.blockStart));
    case "}": return Success(endPosition, Special(SPECIALS.blockEnd));
    case "[": return Success(endPosition, Special(SPECIALS.arrayStart));
    case "]": return Success(endPosition, Special(SPECIALS.arrayEnd));
    case ".": return Success(endPosition, Special(SPECIALS.fieldAccess));
    case ",": return Success(endPosition, Special(SPECIALS.sequenceSeparator));
    case ";": return Success(endPosition, Special(SPECIALS.sequenceEnd));
    case ":": return Success(endPosition, Special(SPECIALS.fieldStart));
  }

  return Fail(startPosition);
};

const skipComment = (target, startPosition) => {
  const firstChar = target.charAt(startPosition);
  const secondChar = target.charAt(startPosition + 1);

  if( firstChar === "/" )
  {
    if( secondChar === "/" )
    {
      const commentEndPosition = target.indexOf("\n", startPosition);

      if( commentEndPosition === -1 )
      return Success(target.length);

      return  Success(commentEndPosition + 1);
    }
    else if( secondChar === "*" )
    {
      const commentEndChar = "*/";
      const commentEndPosition = target.indexOf(commentEndChar, startPosition);

      if( commentEndPosition === -1 )
      throwFatalError(ERRORS.tokenizer, ERRORS.tokenizer.unclosedComment, { f: startPosition });

      return Success(commentEndPosition + commentEndChar.length);
    }
  }
  
  return Fail(startPosition);
};

export default function tokenize(scriptString) {
  if( !scriptString || scriptString === "" )
  {
    return {
      tokens: [],
      errorStatus: {
        status: STATUS.fatalError,
        message: "Tokenization failed! The script string is empty or null."
      }
    };
  }

  const tokenGetters = [
    getString,
    getNumber,
    getIdentifier,
    getOperator,
    getSpecial
  ];

  const tokens = [];
  for( let i = 0; i < scriptString.length; i++ )
  {
      // Skip comments if there are any
    i = skipComment(scriptString, i).position;

    if( i >= scriptString.length )
    break;

      // Attempt to extract each type of token and push the tokens to the array
      // when a match is found
    for( let get of tokenGetters )
    {
      const result = get(scriptString, i);

        // Failed -> continue search
      if( result.errorStatus.status === STATUS.failed )
      continue;

        // Fatal error -> abort tokenization
      if( result.errorStatus.status === STATUS.fatalError )
      {
        return {
          tokens: [],
          errorStatus: {
            status: STATUS.fatalError,
            message: result.errorStatus.message
          }
        };
      }
      
        // Valid token
      if( result.tokens )
      tokens.push(result.tokens);

      i = result.position - 1;
      break;
    }
  }

  return {
    tokens,
    errorStatus: {
      status: STATUS.successful
    }
  };
}
