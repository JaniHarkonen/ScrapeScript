import BlockStatement from "../BlockStatement.js";
import Line from "../Line.js";
import Condition from "./Condition.js";

import { Fail, Operation, Success } from "../../parser.js";
import { attemptParse, testToken, tokenAt } from "../../parserUtils.js";
import { wasSuccessful } from "../../../errorStates.js";
import { TYPES } from "../../../tokenizer/tokens.js";


export default function ConditionalBlock(target, startPosition, keword, operation, block = BlockStatement) {
  let rCondition;
  let rIfBody;
  if(
    !testToken(tokenAt(target, startPosition), TYPES.keyword, keword) ||
    !wasSuccessful(rCondition = Condition(target, startPosition + 1)) ||
    !wasSuccessful(rIfBody = attemptParse(target, rCondition.position + 1, [block, Line]))
  )
  return Fail(startPosition);

  return Success(rIfBody.position, Operation(operation, rCondition.result, rIfBody.result));
}
