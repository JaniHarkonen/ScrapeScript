import CaseBlock from "./CaseBlock.js";
import Line from "../Line.js";
import Expression from "../Expression.js";
import Break from "../singulars/Break.js";
import Default from "./Default.js";

import { KEYWORDS } from "../../../tokenizer/tokenizer.js";
import { TYPES } from "../../../tokenizer/tokens.js";
import { Block, Fail, OPERATIONS, Operation, Success } from "../../parser.js";
import { attemptParse, isFieldStart, isSequenceEnd, testToken, tokenAt } from "../../parserUtils.js";
import { wasSuccessful } from "../../../errorStates.js";
import { ERRORS, throwFatalError } from "../../../ERRORS.js";


export default function Case(target, startPosition) {
  let rCaseCondition;

  if(
    !wasSuccessful(rCaseCondition = Default(target, startPosition)) &&
    (
      !testToken(tokenAt(target, startPosition), TYPES.keyword, KEYWORDS.case) ||
      !wasSuccessful(rCaseCondition = Expression(target, startPosition + 1))
    ) ||
    !isFieldStart(tokenAt(target, rCaseCondition.position + 1))
  )
  return Fail(startPosition);

  const opCase = Operation(OPERATIONS.case, rCaseCondition.result);
  let rCaseBody = attemptParse(target, rCaseCondition.position + 2, [CaseBlock, Case]);
  let cursor = rCaseBody.position;

  if( wasSuccessful(rCaseBody) )
  opCase.arguments[1] = rCaseBody.result;
  else
  {
    let rLine;
    rCaseBody = Block([]);
    while( cursor < target.length )
    {
      if( !isSequenceEnd(tokenAt(target, cursor)) )
      {
        let didBreak = false;
        rLine = Line(target, cursor);

        if( wasSuccessful(rLine) || (didBreak = wasSuccessful(rLine = Break(target, cursor))) )
        {
          rCaseBody.operations.push(rLine.result);
          cursor = rLine.position;

          if( didBreak )
          break;
        }
        else
        throwFatalError(ERRORS.parser, ERRORS.parser.case.bodyExpected);
      }

      cursor++;
    }

    opCase.arguments[1] = rCaseBody;
  }

  return Success(cursor, opCase);
}
