import Case from "./Case.js";
import Condition from "../meta/Condition.js";

import { wasSuccessful } from "../../../errorStates.js";
import { KEYWORDS } from "../../../tokenizer/tokenizer.js";
import { TYPES } from "../../../tokenizer/tokens.js";
import { Fail, OPERATIONS, Operation, Success } from "../../parser.js";
import { isBlockStart, isSequenceEnd, testToken, tokenAt } from "../../parserUtils.js";


export default function SwitchStatement(target, startPosition) {
  let rCondition;
  if(
    !testToken(tokenAt(target, startPosition), TYPES.keyword, KEYWORDS.switch) ||
    !wasSuccessful(rCondition = Condition(target, startPosition + 1)) ||
    !isBlockStart(tokenAt(target, rCondition.position + 1))
  )
  return Fail(startPosition);
  

  const opSwitch = Operation(OPERATIONS.switch);
  opSwitch.arguments = [rCondition.result];
  let rCase;
  let cursor = rCondition.position + 2;
  while( cursor < target.length )
  {
    if( !isSequenceEnd(tokenAt(target, cursor)) )
    {
      rCase = Case(target, cursor);

      if( !wasSuccessful(rCase) )
      {
        cursor--;
        break;
      }

      opSwitch.arguments.push(rCase.result);
      cursor = rCase.position;
    }

    cursor++;
  }

  return Success(rCase.position, opSwitch);
}
