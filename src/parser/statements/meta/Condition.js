import Expression from "../Expression.js";

import { wasSuccessful } from "../../../errorStates.js";
import { Fail, Success } from "../../parser.js";
import { isExpressionEnd, isExpressionStart, tokenAt } from "../../parserUtils.js";


export default function Condition(target, startPosition) {
  let rCondition;

  if(
    !isExpressionStart(tokenAt(target, startPosition)) ||
    !wasSuccessful(rCondition = Expression(target, startPosition + 1)) ||
    !isExpressionEnd(tokenAt(target, rCondition.position + 1))
  )
  return Fail(startPosition);

  return Success(rCondition.position + 1, rCondition.result);
}
