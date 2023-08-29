import Compilation from "../Compilation.js";
import Snippet from "../Snippet.js";
import Instruction from "../Instruction.js";

import { OP } from "../OP.js";
import { KEYWORDS } from "../../tokenizer/tokenizer.js";
import { compileOrReturn } from "../compilerUtils.js";


export default function compileVariableDeclaration(nTarget, context) {
  const compResult = new Compilation();
  const addrTemp = context.memory.getTempAddress();
  const isConstant = (nTarget.value === KEYWORDS.const);
  for( let i = 0; i < nTarget.arguments.length; i += 2 )
  {
    const variableName = nTarget.arguments[i].value;
    const initialAssignment = nTarget.arguments[i + 1];
    const addrVariable = context.memory.createAddress(variableName, isConstant);

    if( initialAssignment )
    {
      const value = compileOrReturn(initialAssignment, context, compResult, addrTemp);
      compResult.add(new Snippet(new Instruction(OP.seti, addrVariable, value, addrVariable)));
    }
  }

  return compResult;
};