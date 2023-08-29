import Condition from "../meta/Condition.js";
import LoopBlock from "./LoopBlock.js";

import { wasSuccessful } from "../../../errorStates.js";
import { KEYWORDS } from "../../../tokenizer/tokenizer.js";
import { TYPES } from "../../../tokenizer/tokens.js";
import { Fail, OPERATIONS, Operation, Success } from "../../parser.js";
import { testToken, tokenAt } from "../../parserUtils.js";


export default function DoWhileLoop(target, startPosition) {
  let rCondition;
  let rDoWhileBody;

  if(
    !testToken(tokenAt(target, startPosition), TYPES.keyword, KEYWORDS.do) ||
    !wasSuccessful(rDoWhileBody = LoopBlock(target, startPosition + 1)) ||
    !testToken(tokenAt(target, rDoWhileBody.position + 1), TYPES.keyword, KEYWORDS.while) ||
    !wasSuccessful(rCondition = Condition(target, rDoWhileBody.position + 2))
  )
  return Fail(startPosition);

  return Success(rCondition.position, Operation(OPERATIONS.doWhile, rDoWhileBody.result, rCondition.result));
}
