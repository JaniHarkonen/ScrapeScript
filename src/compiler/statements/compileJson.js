import Compilation from "../Compilation.js";
import Snippet from "../Snippet.js";
import Instruction from "../Instruction.js";

import { OP } from "../OP.js";
import { compileOrReturn, formatString } from "../compilerUtils.js";


export default function compileJson(nTarget, context) {
  const addrTemp = context.memory.getTempAddress();
  const compResult = new Compilation();
  compResult.add(new Snippet(new Instruction(OP.json, addrTemp)));

  context.startScope();
    const addrFieldTemp = context.memory.getNewTempAddress();
    const addrValueTemp = context.memory.getNewTempAddress();
    for( let i = 0; i < nTarget.arguments.length; i += 2 )
    {
      compResult.add(new Snippet(new Instruction(OP.aiof, addrFieldTemp, addrTemp, formatString(nTarget.arguments[i].value))));

      const fieldValue = compileOrReturn(nTarget.arguments[i + 1], context, compResult, addrValueTemp);
      compResult.add(new Snippet(new Instruction(OP.set, addrFieldTemp, fieldValue, addrFieldTemp)));
    }
  context.releaseScope();

  return compResult;
}
