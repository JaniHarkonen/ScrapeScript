import { ERRORS, throwFatalError } from "../../ERRORS.js";
import { TYPES } from "../../tokenizer/tokens.js";
import { Fail, OPERATIONS, Operation, Success } from "../parser.js";
import { isImport, testToken, tokenAt } from "../parserUtils.js";


export default function Import(target, startPosition) {
  if( !isImport(tokenAt(target, startPosition)) )
  return Fail(startPosition);

  const tImport = tokenAt(target, startPosition + 1);

  if( !testToken(tImport, TYPES.string) )
  throwFatalError(ERRORS.parser, ERRORS.parser.import.pathExpected);

  const opImport = Operation(OPERATIONS.import);
  opImport.arguments = [tImport.value];
  return Success(startPosition + 2, opImport);
}
