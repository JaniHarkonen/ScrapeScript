import ConditionalBlock from "./meta/ConditionalBlock.js";
import BlockStatement from "./BlockStatement.js";
import Line from "./Line.js";

import { Fail, OPERATIONS, Success } from "../parser.js";
import { KEYWORDS } from "../../tokenizer/tokenizer.js";
import { wasSuccessful } from "../../errorStates.js";
import { attemptParse, testToken, tokenAt } from "../parserUtils.js";
import { TYPES } from "../../tokenizer/tokens.js";


export default function IfStatement(target, startPosition) {
    // Condition and main block
  const rIf = ConditionalBlock(target, startPosition, KEYWORDS.if, OPERATIONS.if);
  let cursor = rIf.position;

  if( !wasSuccessful(rIf) )
  return Fail(startPosition);

  const opResult = rIf.result;
  let rElseBody;

    // Possible else-block
  if(
    testToken(tokenAt(target, rIf.position + 1), TYPES.keyword, KEYWORDS.else) &&
    wasSuccessful(rElseBody = attemptParse(target, rIf.position + 2, [IfStatement, BlockStatement, Line]))
  )
  {
    opResult.arguments.push(rElseBody.result);
    cursor = rElseBody.position;
  }

  return Success(cursor, opResult);
}
