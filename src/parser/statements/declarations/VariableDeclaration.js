import Expression from "../Expression.js";

import { isIdentifier, isSequenceEnd, isSequenceSeparator, isVariableDeclaration, testToken, tokenAt } from "../../parserUtils.js";
import { Operation, Fail, Success } from "../../parser.js";
import { wasSuccessful } from "../../../errorStates.js";
import { TYPES } from "../../../tokenizer/tokens.js";
import { KEYWORDS, OPERATORS } from "../../../tokenizer/tokenizer.js";
import { ERRORS, throwFatalError } from "../../../ERRORS.js";


export default function VariableDeclaration(target, startPosition) {
  const tDeclarator = tokenAt(target, startPosition);

  if( !isVariableDeclaration(tDeclarator) )
  return Fail(startPosition);

  const requireInitializations = (tDeclarator.value === KEYWORDS.const);
  const declarations = [];
  let lastVariableName;
  let lastInitValue = undefined;
  let cursor = startPosition + 1;
  while( cursor < target.length )
  {
    const tCurrent = tokenAt(target, cursor);
    const isEnd = isSequenceEnd(tCurrent);

    if( isEnd || isSequenceSeparator(tCurrent) )
    {
      if( !lastVariableName )
      throwFatalError(ERRORS.parser, ERRORS.parser.variableDeclaration.initializationExpected);

      declarations.push(lastVariableName);

      if( lastInitValue !== undefined )
      declarations.push(lastInitValue);
      
      if( requireInitializations && lastInitValue === null )
      throwFatalError(ERRORS.parser, ERRORS.parser.variableDeclaration.initializeConstants);

      if( isEnd )
      {
        cursor--;
        break;
      }
    }
    else 
    {
      const tIdentifier = tokenAt(target, cursor);

      if( !isIdentifier(tIdentifier) )
      break;

      lastVariableName = tIdentifier;

      if( !testToken(tokenAt(target, cursor + 1), TYPES.operator, OPERATORS.assign) )
      lastInitValue = null;
      else
      {
        const rAssignment = Expression(target, cursor + 2);

        if( !wasSuccessful(rAssignment) )
        throwFatalError(ERRORS.parser, ERRORS.parser.variableDeclaration.assignmentExpected);

        lastInitValue = rAssignment.result;
        cursor = rAssignment.position;
      }
    }

    cursor++;
  }

  const opDeclaration = Operation(tDeclarator.value);
  opDeclaration.arguments = declarations;
  return Success(cursor, opDeclaration);
};
