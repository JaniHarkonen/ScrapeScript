import { TYPES } from "../../../tokenizer/tokens.js";
import { Fail, Operation, Success } from "../../parser.js";
import { testToken, tokenAt } from "../../parserUtils.js";


export default function Singular(target, startPosition, keyword) {
  if( testToken(tokenAt(target, startPosition), TYPES.keyword, keyword) )
  return Success(startPosition, Operation(keyword));

  return Fail(startPosition);
}
