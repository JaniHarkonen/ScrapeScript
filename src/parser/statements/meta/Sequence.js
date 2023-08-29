import { ERRORS, throwFatalError } from "../../../ERRORS.js";
import { didFail } from "../../../errorStates.js";
import { Fail, Success } from "../../parser.js";
import { isSequenceSeparator, tokenAt } from "../../parserUtils.js";


export default function Sequence(target, startPosition, acceptItem, endSequence) {
  let cursor = startPosition;
  let sequence = [];
  let lastItem = null;
  while( cursor < target.length )
  {
    const isEnd = endSequence(target, cursor);
  
    if( isEnd || isSequenceSeparator(tokenAt(target, cursor)) )
    {
      if( lastItem )
      sequence.push(lastItem);
      else if( !isEnd )
      throwFatalError(ERRORS.parser, ERRORS.parser.sequence.itemExpected);

      if( isEnd )
      {
        cursor--;
        break;
      }

      lastItem = null;
    }
    else
    {
      const rAccept = acceptItem(target, cursor);

      if( didFail(rAccept) )
      return Fail(startPosition);

      lastItem = rAccept.result;
      cursor = rAccept.position;
    }

    cursor++;
  }

  return Success(cursor, sequence);
}
