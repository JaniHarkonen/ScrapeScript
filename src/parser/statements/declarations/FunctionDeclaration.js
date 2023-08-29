import Sequence from "../meta/Sequence.js";

import BlockStatement from "../BlockStatement.js";

import { Fail, OPERATIONS, Operation, Success } from "../../parser.js";
import { isExpressionEnd, isExpressionStart, isFunctionDeclaration, isIdentifier, tokenAt } from "../../parserUtils.js";
import { wasSuccessful } from "../../../errorStates.js";
import { ERRORS, throwFatalError } from "../../../ERRORS.js";


const Parameter = (target, cursor) => {
  const token = tokenAt(target, cursor);

  if( isIdentifier(token) )
  return Success(cursor, token);

  return Fail(cursor);
};

const endParameterSequence = (target, cursor) => isExpressionEnd(tokenAt(target, cursor));

export default function FunctionDeclaration(target, startPosition) {
  const tFunctionName = tokenAt(target, startPosition + 1);

  if(
    !isFunctionDeclaration(tokenAt(target, startPosition)) ||
    !isIdentifier(tFunctionName) ||
    !isExpressionStart(tokenAt(target, startPosition + 2))
  )
  return Fail(startPosition);

  const rFunctionParameters = Sequence(
    target,
    startPosition + 3,
    Parameter,
    endParameterSequence
  );

  if( !wasSuccessful(rFunctionParameters) )
  return Fail(startPosition);

  const rFunctionBody = BlockStatement(target, rFunctionParameters.position + 2);

  if( !wasSuccessful(rFunctionBody) )
  throwFatalError(ERRORS.parser, ERRORS.parser.functionDeclaration.bodyExpected);

  const operation = Operation(OPERATIONS.function);
  operation.arguments = [tFunctionName, ...rFunctionParameters.result, rFunctionBody.result];

  return Success(rFunctionBody.position, operation);
}
