import Line from "./Line.js";

import { wasSuccessful } from "../../errorStates.js";
import { Block, Success } from "../parser.js";
import { isSequenceEnd, tokenAt } from "../parserUtils.js";


export default function Program(target, cursor) {
  const rProgram = Block([]);

  while( cursor < target.length )
  {
    const tCurrent = tokenAt(target, cursor);

    if( !isSequenceEnd(tCurrent) )
    {
      const rLine = Line(target, cursor);

      if( !wasSuccessful(rLine) )
      break;

      rProgram.operations.push(rLine.result);
      cursor = rLine.position;
    }

    cursor++;
  }

  return Success(cursor, rProgram);
}
