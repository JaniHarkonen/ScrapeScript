import CompilerContext from "./CompilerContext.js";
import Snippet from "./Snippet.js";
import Instruction from "./Instruction.js";

import compileBlock from "./statements/compileBlock.js";
import { TYPES } from "../tokenizer/tokens.js";
import { OP } from "./OP.js";
import { ERRORS, throwFatalError } from "../ERRORS.js";
import { getStatementCompiler } from "./statements/statements.js";
import { OPERATORS } from "../tokenizer/tokenizer.js";


export default function compileAST(nTarget, context = new CompilerContext()) {
  let compiler;

  if( nTarget.type === TYPES.block )
  {
    context.startScope();
      const compilation = compileBlock(nTarget, context);
      compilation.addStartIgnore(new Snippet(new Instruction(OP.BLOCK_START)));
      compilation.addIgnore(new Snippet(new Instruction(OP.BLOCK_END)));
    context.releaseScope();

    return compilation;
  }
  else if( nTarget.type === TYPES.operation )
  {
    let compilerType;

    switch( nTarget.operator )
    { 
        // Operators that form expressions will be compiled with the default compiler
      case OPERATORS.not:
      case OPERATORS.increment:
      case OPERATORS.decrement:
      case OPERATORS.add:
      case OPERATORS.addAssign:
      case OPERATORS.subtract:
      case OPERATORS.subtractAssign:
      case OPERATORS.multiply:
      case OPERATORS.multiplyAssign:
      case OPERATORS.divide:
      case OPERATORS.divideAssign:
      case OPERATORS.greater:
      case OPERATORS.greaterOrEqual:
      case OPERATORS.less:
      case OPERATORS.lessOrEqual:
      case OPERATORS.equals:
      case OPERATORS.notEquals:
      case OPERATORS.and:
      case OPERATORS.ands:
      case OPERATORS.andAssign:
      case OPERATORS.or:
      case OPERATORS.ors:
      case OPERATORS.orAssign:
      case OPERATORS.xor:
      case OPERATORS.xorAssign:
      case OPERATORS.modulo:
      case OPERATORS.moduloAssign:
      case OPERATORS.shiftLeft:
      case OPERATORS.shiftRight:
      case OPERATORS.assign:
        compilerType = "defaultCompiler";
        break;
      
        // Rest are compiled with their respective compilers
      default: compilerType = nTarget.operator; break;
    }

    compiler = getStatementCompiler(compilerType);
  }
  else
  throwFatalError(ERRORS.compiler, ERRORS.compiler.nonOperation);

  return compiler(nTarget, context);
}
