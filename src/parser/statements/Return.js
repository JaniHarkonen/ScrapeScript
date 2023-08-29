import Expression from "./Expression.js";

import { wasSuccessful } from "../../errorStates.js";
import { Fail, OPERATIONS, Operation, Success } from "../parser.js";
import { isReturn, tokenAt } from "../parserUtils.js";


export default function Return(target, startPosition) {
  if( !isReturn(tokenAt(target, startPosition)) )
  return Fail(startPosition);

  const rReturnExpression = Expression(target, startPosition + 1);

  if( !wasSuccessful(rReturnExpression) )
  return rReturnExpression;

  return Success(rReturnExpression.position, Operation(OPERATIONS.return, rReturnExpression.result));
}
