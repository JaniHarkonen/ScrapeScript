import Expression from "./Expression.js";

import { wasSuccessful } from "../../errorStates.js";
import { Fail, OPERATIONS, Operation, Success } from "../parser.js";
import { isYield, tokenAt } from "../parserUtils.js";


export default function Yield(target, startPosition) {
  if( !isYield(tokenAt(target, startPosition)) )
  return Fail(startPosition);

  const rReturnExpression = Expression(target, startPosition + 1);

  if( !wasSuccessful(rReturnExpression) )
  return rReturnExpression;

  return Success(rReturnExpression.position, Operation(OPERATIONS.yield, rReturnExpression.result));
}
