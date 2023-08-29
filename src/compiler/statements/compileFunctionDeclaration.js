import Compilation from "../Compilation.js";
import Snippet from "../Snippet.js";
import Instruction from "../Instruction.js";

import compileAST from "../compiler.js";
import { OP } from "../OP.js";
import { formatNumber } from "../compilerUtils.js";


export default function compileFunctionDeclaration(nTarget, context) {
  const functionName = nTarget.arguments[0].value;
  const addrFunction = context.memory.createAddress(functionName, true);  // Function address
  const compResult = new Compilation(); // Result of the compilation

    // Further function address references will be converted to line numbers
  compResult.add(new Snippet(new Instruction(OP.AS_FUNCTION, addrFunction)));

    // Function body
  const compBody = new Compilation();
  context.startScope();
    const addrReturn = context.memory.getNewTempAddress();  // Temporary address holding the return line number
    compBody.add(new Snippet(new Instruction(OP.mpsh)));  // Create a new memory context to allow recursion (will be popped in compileFunctionCall)
    compBody.add(new Snippet(new Instruction(OP.cpop, addrReturn)));  // Pop and store return line

      // Pop and store arguments in reverse order
    let i;
    for( i = nTarget.arguments.length - 2; i >= 1; i-- )
    {
      const arg = nTarget.arguments[i];
      const addrParameter = context.memory.createAddress(arg.value, false); // Create new address for each parameter
      compBody.add(new Snippet(new Instruction(OP.cpop, addrParameter)));
    }

    context.memory.getNewTempAddress();

      // Compile body
    compBody.mergeEnd(compileAST(nTarget.arguments[nTarget.arguments.length - 1], context));
    compBody.addIgnore(new Snippet(new Instruction(OP.END_FUNCTION)));
    compBody.add(new Snippet(new Instruction(OP.jmp, addrReturn))); // Jump to return line
  context.releaseScope();

    // Add relative jump to the beginning to skip when not called
  compResult.addStart(new Snippet(new Instruction(OP.jmpr, formatNumber(compBody.length))));
  compResult.mergeEnd(compBody);
  return compResult;
};