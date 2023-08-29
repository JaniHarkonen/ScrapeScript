import Break from "../singulars/Break.js";
import BlockStatement from "../BlockStatement.js";
import Line from "../Line.js";


export const DEFAULT_CASE_BLOCK_STATEMENTS = [
  Line,
  Break
];

export default function LoopBlock(target, startPosition) {
  return BlockStatement(target, startPosition, DEFAULT_CASE_BLOCK_STATEMENTS);
}
