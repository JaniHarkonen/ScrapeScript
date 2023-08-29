import Expression from "../Expression.js";
import Sequence from "../meta/Sequence.js";

import { wasSuccessful } from "../../../errorStates.js";
import { Fail, OPERATIONS, Operation, Success } from "../../parser.js";
import { isArrayEnd, isArrayStart, tokenAt } from "../../parserUtils.js";


const didSequenceEnd = (target, cursor) => isArrayEnd(target[cursor]);

export default function MakeArray(target, startPosition) {
  const tStart = tokenAt(target, startPosition);

  if( !isArrayStart(tStart) )
  return Fail(startPosition);

  const rArray = Sequence(
    target,
    startPosition + 1,
    Expression,
    didSequenceEnd
  );

  if( !wasSuccessful(rArray) )
  return Fail(startPosition);

  const opArray = Operation(OPERATIONS.array);
  opArray.arguments = rArray.result;

  return Success(rArray.position + 1, opArray);
};
