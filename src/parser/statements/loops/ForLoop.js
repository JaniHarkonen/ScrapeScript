import Expression from "../Expression.js";
import FunctionDeclaration from "../declarations/FunctionDeclaration.js";
import VariableDeclaration from "../declarations/VariableDeclaration.js";
import LoopBlock from "./LoopBlock.js";

import { KEYWORDS } from "../../../tokenizer/tokenizer.js";
import { TYPES } from "../../../tokenizer/tokens.js";
import { Fail, OPERATIONS, Operation, Success } from "../../parser.js";
import { attemptParse, isExpressionEnd, isExpressionStart, isSequenceEnd, testToken, tokenAt } from "../../parserUtils.js";
import { wasSuccessful } from "../../../errorStates.js";
import { ERRORS, throwFatalError } from "../../../ERRORS.js";


const initializationStatements = [FunctionDeclaration, VariableDeclaration, Expression];
const defaultStatements = [Expression];

export default function ForLoop(target, startPosition) {
  if(
    !testToken(tokenAt(target, startPosition), TYPES.keyword, KEYWORDS.for) ||
    !isExpressionStart(tokenAt(target, startPosition + 1))
  )
  return Fail(startPosition);

  const numberOfHeaders = 3;
  const headers = [null, null, null];
  let cursor = startPosition + 2;
  let statements = initializationStatements;
  let headerIndex = 0;
  while( cursor < target.length )
  {
    const tCurrent = tokenAt(target, cursor);

      // Immediately encountered semicolon, skip
    if( !isSequenceEnd(tCurrent) )
    {
      const rHeader = attemptParse(target, cursor, statements);
      headers[headerIndex] = rHeader.result;
      cursor = rHeader.position + 1;
    }

    headerIndex++;
    cursor++;
    statements = defaultStatements;

    if( isExpressionEnd(tokenAt(target, cursor)) )
    {
      cursor++;
      headerIndex = numberOfHeaders;
    }

    if( headerIndex >= numberOfHeaders )
    break;
  }

  const rForBody = LoopBlock(target, cursor);

  if( !wasSuccessful(rForBody) )
  throwFatalError(ERRORS.parser, ERRORS.parser.loop.bodyExpected);

  const opResult = Operation(OPERATIONS.for);
  opResult.arguments = [...headers, rForBody.result];

  return Success(rForBody.position, opResult);
}
