import Compilation from "../Compilation.js";
import Snippet from "../Snippet.js";
import Instruction from "../Instruction.js";

import { OP } from "../OP.js";
import { compileOrReturn } from "../compilerUtils.js";


export default function compileExit(nTarget, context) {
  const argReturnValue = nTarget.arguments[0];
  const compResult = new Compilation();

  context.startScope();
    const addrReturnTemp = context.memory.getNewTempAddress();
    const returnedValue = compileOrReturn(argReturnValue, context, compResult, addrReturnTemp);
  context.releaseScope();

  compResult.add(new Snippet(new Instruction(OP.yld, returnedValue)));
  return compResult;
};