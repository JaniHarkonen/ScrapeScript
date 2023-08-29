import Compilation from "../Compilation.js";
import Snippet from "../Snippet.js";
import Instruction from "../Instruction.js";

import compileAST from "../compiler.js";
import { TYPES } from "../../tokenizer/tokens.js";
import { OP } from "../OP.js";
import { compileOrReturn, formatString } from "../compilerUtils.js";


export default function compileAccess(nTarget, context) {
  const addrTemp = context.memory.getTempAddress();
  const accessTarget = nTarget.arguments[0];

  const compResult = new Compilation();
  const iSet = new Instruction(OP.setp, addrTemp);

    // Resolve access target (typically variable name)
  if( accessTarget.type === TYPES.operation )
  {
    compResult.mergeEnd(compileAST(accessTarget, context));
    iSet.pushOperand(addrTemp);
  }
  else
  iSet.pushOperand(context.memory.getAddress(accessTarget.value));

  if( iSet.getOperand(0) !== iSet.getOperand(1) )
  compResult.add(new Snippet(iSet));

  const compArrayIndicies = new Compilation();

    // Resolve field access
  context.startScope();
    let addrAccessTemp = addrTemp;
    let addrAccessTempLast = addrTemp;
    for( let i = 1; i < nTarget.arguments.length; i++ )
    {
      const fieldAccess = nTarget.arguments[i];
      let arrayIndex;

      if( fieldAccess.type === TYPES.identifier )
      arrayIndex = formatString(fieldAccess.value);
      else
      {
        const addrArrayIndex = context.memory.getNewTempAddress();
        arrayIndex = compileOrReturn(fieldAccess, context, compArrayIndicies, addrArrayIndex);
      }

      const iArrayIndexOf = new Instruction(OP.aiof, addrAccessTemp, addrAccessTemp, arrayIndex);
      compResult.add(new Snippet(iArrayIndexOf));
      addrAccessTemp = context.memory.getNewTempAddress();
      iArrayIndexOf.setOperand(0, addrAccessTemp);

      const addrAccessTempNext = context.memory.getNewTempAddress();
      if( i < nTarget.arguments.length - 1 )
      {
        compResult.add(new Snippet(new Instruction(OP.seti, addrAccessTempNext, addrAccessTemp, addrAccessTemp)));
        addrAccessTempLast = addrAccessTempNext;
      }
      else
      {
        iArrayIndexOf.setOperand(0, addrTemp);
        iArrayIndexOf.setOperand(1, addrAccessTempLast);
      }
    }
  context.releaseScope();

  compArrayIndicies.mergeEnd(compResult);
  return compArrayIndicies;
};