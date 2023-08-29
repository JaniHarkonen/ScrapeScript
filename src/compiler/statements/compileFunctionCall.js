import Snippet from "../Snippet.js";
import Instruction from "../Instruction.js";
import Compilation from "../Compilation.js";

import compileAST from "../compiler.js";
import { OP, getOpCode } from "../OP.js";
import { compileOrReturn } from "../compilerUtils.js";
import { TYPES } from "../../tokenizer/tokens.js";


export default function compileFunctionCall(nTarget, context) {
  const addrFunction = context.memory.getTempAddress();
  const compAccessedArguments = new Compilation();  // Arguments are accessed here before they are pushed to call stack
  const compCallStackPushes = new Compilation();    // Arguments are pushed to call stack here one-by-one after being accessed

  context.startScope();
    for( let i = 1; i < nTarget.arguments.length; i++ )
    {
      const addrArgumentTemp = context.memory.getNewTempAddress();
      const callArgument = nTarget.arguments[i];

      if( !callArgument )
      continue;

      const pushedArgument = compileOrReturn(callArgument, context, compAccessedArguments, addrArgumentTemp);
      compCallStackPushes.add(new Snippet(new Instruction(OP.cpsh, pushedArgument)));
    }
  context.releaseScope();

  let compResult = compAccessedArguments;
  compResult.mergeEnd(compCallStackPushes);

  const functionAccess = nTarget.arguments[0];

    // Built-in functions will compile to instructions as they aren't declared
  if( functionAccess.type === TYPES.builtIn )
  {
    const opCode = getOpCode(functionAccess.value);
    compResult.add(new Snippet(new Instruction(opCode)))
  }
  else
  {
      // Declared functions must be accessed and jumped to
    const compFunctionAccess = compileAST(functionAccess, context);
    compResult.mergeEnd(compFunctionAccess);
    compResult.add(new Snippet(new Instruction(OP.cppc))); // Store program counter
    compResult.add(new Snippet(new Instruction(OP.jmp, addrFunction))); // Jump to function
    compResult.add(new Snippet(new Instruction(OP.mpop, addrFunction))); // Pop memory context (created in compileFunctionDeclaration to allow recursion)
  }

  compResult.add(new Snippet(new Instruction(OP.cpop, addrFunction))); // Pop returned value from call stack

  return compResult;
};