import Compilation from "../Compilation.js";

import compileAST from "../compiler.js";


export default function compileBlock(nTarget, context) {
  const compResult = new Compilation();
  for( let i = 0; i < nTarget.operations.length; i++ )
  compResult.mergeEnd(compileAST(nTarget.operations[i], context));

  return compResult;
};