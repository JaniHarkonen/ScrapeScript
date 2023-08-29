import compileAST from "./compiler.js";
import { KEYWORDS } from "../tokenizer/tokenizer.js";
import { TYPES } from "../tokenizer/tokens.js";
import { TYPE_SIGNIFIERS } from "./TYPE_SIGNIFIERS.js";


export const formatAddress = (address) => TYPE_SIGNIFIERS.address + address;
export const formatLine = (line) => TYPE_SIGNIFIERS.line + line;
export const formatNumber = (number) => TYPE_SIGNIFIERS.number + number;
export const formatString = (string) => TYPE_SIGNIFIERS.string + string;

export const Instruction = (op, ...operands) => {
  let instruction = op;
  for( const operand of operands )
  instruction += " " + operand;
  
  return instruction;
};

export const compileOrReturn = (nTarget, context, compilation, defaultValue = null) => {
  if( !nTarget )
  return TYPE_SIGNIFIERS.number + 0;

  const type = nTarget.type;
  const value = nTarget.value;

  if( !type )
  return nTarget;

  switch( type )
  {
    case TYPES.operation:
      compilation.mergeEnd(compileAST(nTarget, context));
      return defaultValue;
    
    case TYPES.string: return TYPE_SIGNIFIERS.string + value;
    case TYPES.number: return TYPE_SIGNIFIERS.number + value;
    case TYPES.boolean: return TYPE_SIGNIFIERS.boolean + value;

    case TYPES.keyword:
      if( value === KEYWORDS.null )
      return TYPE_SIGNIFIERS.null;
      else if( value === KEYWORDS.NaN )
      return TYPE_SIGNIFIERS.NaN;
    
    default:
      return nTarget.value;
  }
};
