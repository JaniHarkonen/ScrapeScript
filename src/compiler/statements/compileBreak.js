import Instruction from "../Instruction.js";

import { OP } from "../OP.js";
import compileSingleInstruction from "./compileSingleInstruction.js";


export default function compileBreak(nTarget, context) {
  return compileSingleInstruction(new Instruction(OP.GOTO_BREAK));
}
