import Line from "./Line.js";

import { didFail, wasSuccessful } from "../../errorStates.js";
import { Block, Fail, Success } from "../parser.js";
import { attemptParse, isBlockEnd, isBlockStart, isSequenceEnd, tokenAt } from "../parserUtils.js";


export const DEFAULT_BLOCK_STATEMENTS = [
  Line
];

export default function BlockStatement(target, startPosition, statements = DEFAULT_BLOCK_STATEMENTS) {
  if( !isBlockStart(tokenAt(target, startPosition)) )
  return Fail(startPosition);
  
  const operations = [];
  let cursor = startPosition + 1;
  let lastLine = null;
  while( cursor < target.length )
  {
    const currentToken = tokenAt(target, cursor);

      // Ignore semicolons (;)
    if( !isSequenceEnd(currentToken) )
    {
      const isEnd = isBlockEnd(currentToken);
      const rStatement = attemptParse(target, cursor, statements);

      if( isEnd || wasSuccessful(rStatement) )
      {
        if( lastLine )
        operations.push(lastLine);

        lastLine = rStatement.result;
        cursor = rStatement.position;

        if( isEnd )
        break;
      }
      else if( didFail(rStatement) )
      return Fail(startPosition);
    }

    cursor++;
  }

  return Success(cursor, Block(operations));
}
