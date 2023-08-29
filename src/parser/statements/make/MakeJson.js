import Expression from "../Expression.js";

import { Operation, OPERATIONS, Fail, Success } from "../../parser.js";
import { isBlockEnd, isBlockStart, isFieldName, isFieldStart, isSequenceSeparator, tokenAt } from "../../parserUtils.js";
import { wasSuccessful } from "../../../errorStates.js";
import { ERRORS, throwFatalError } from "../../../ERRORS.js";


export default function MakeJson(target, startPosition) {
  const tStart = tokenAt(target, startPosition);

  if( !isBlockStart(tStart) )
  return Fail(startPosition);

  const jsonStructure = [];
  let cursor = startPosition + 1;
  let expectField = true;
  let fieldName = null;
  while( cursor < target.length )
  {
    const tCurrent = tokenAt(target, cursor);

    if( isBlockEnd(tCurrent) )
    break;

    if( expectField )
    {
      if( !isFieldName(tCurrent) )
      throwFatalError(ERRORS.parser, ERRORS.parser.makeJson.fieldNameExpected);

      fieldName = tCurrent;
      jsonStructure.push(fieldName);
      expectField = false;
    }
    else if( isSequenceSeparator(tCurrent) )
    {
      expectField = true;
      fieldName = null;
    }
    else if( !isFieldStart(tCurrent) )
    {
      const rInitialization = Expression(target, cursor);

      if( !wasSuccessful(rInitialization) )
      throwFatalError(ERRORS.parser, ERRORS.parser.makeJson.valueExpected);

      jsonStructure.push(rInitialization.result);
      cursor = rInitialization.position;
    }

    cursor++;
  }

  const opResult = Operation(OPERATIONS.json);
  opResult.arguments = jsonStructure;
  return Success(cursor, opResult);
};
