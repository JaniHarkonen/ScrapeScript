import Compilation from "../Compilation.js";
import Instruction from "../Instruction.js";
import Snippet from "../Snippet.js";

import { OP } from "../OP.js";
import { compileOrReturn } from "../compilerUtils.js";


export default function compileArray(nTarget, context) {
  const addrTemp = context.memory.getTempAddress();
  const compResult = new Compilation();
  compResult.add(new Snippet(new Instruction(OP.arra, addrTemp)));

  context.startScope();
    const addrIndexTemp = context.memory.getNewTempAddress();
    for( const index of nTarget.arguments )
    {
      const initialValue = compileOrReturn(index, context, compResult, addrIndexTemp);
      compResult.add(new Snippet(new Instruction(OP.cpsh, addrTemp)));
      compResult.add(new Snippet(new Instruction(OP.cpsh, initialValue)));
      compResult.add(new Snippet(new Instruction(OP.push)));
    }
  context.releaseScope();

  return compResult;
}
