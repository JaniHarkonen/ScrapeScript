import Break from "../singulars/Break.js";
import Continue from "../singulars/Continue.js";
import BlockStatement from "../BlockStatement.js";
import Line from "../Line.js";

import { attemptParse } from "../../parserUtils.js";
import { wasSuccessful } from "../../../errorStates.js";


export const DEFAULT_LOOP_BLOCK_STATEMENTS = [
  Line,
  Break,
  Continue
];

export default function LoopBlock(target, startPosition) {
  const rLoopBlock = BlockStatement(target, startPosition, DEFAULT_LOOP_BLOCK_STATEMENTS);

  if( wasSuccessful(rLoopBlock) )
  return rLoopBlock;
  else
  return attemptParse(target, startPosition, DEFAULT_LOOP_BLOCK_STATEMENTS);
}
