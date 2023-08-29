import Instruction from "../Instruction.js";

import compileSingleInstruction from "./compileSingleInstruction.js";
import { OP } from "../OP.js";


export default function compileContinue(nTarget, context) {
  return compileSingleInstruction(new Instruction(OP.GOTO_CONTINUE));
}
