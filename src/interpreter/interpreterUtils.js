import { OP } from "../compiler/OP.js";
import { ATYPES } from "./ATYPES.js";

export const TYPE = 0;
export const VALUE = 1;
export const FIELD_INDEX = 2;

/**
 * Mapping of the OP-codes of binary operations to their equivalent 
 * functions that will be triggered upon interpretation.
 */
export const BINARY_OPERATIONS = {
  [OP.add] : (o1, o2) => o1 + o2,
  [OP.adds] : (o1, o2) => o1 + o2,
  [OP.subt]: (o1, o2) => o1 - o2,
  [OP.subs]: (o1, o2) => o1 - o2,
  [OP.mul] : (o1, o2) => o1 * o2,
  [OP.muls] : (o1, o2) => o1 * o2,
  [OP.div] : (o1, o2) => o1 / o2,
  [OP.divs] : (o1, o2) => o1 / o2,
  [OP.equ] : (o1, o2) => o1 == o2,
  [OP.nequ]: (o1, o2) => o1 != o2,
  [OP.gre] : (o1, o2) => o1 > o2,
  [OP.less]: (o1, o2) => o1 < o2,
  [OP.gree]: (o1, o2) => o1 >= o2,
  [OP.lsse]: (o1, o2) => o1 <= o2,
  [OP.and] : (o1, o2) => o1 & o2,
  [OP.ands] : (o1, o2) => o1 & o2,
  [OP.land]: (o1, o2) => o1 && o2,
  [OP.or]  : (o1, o2) => o1 | o2,
  [OP.ors]  : (o1, o2) => o1 | o2,
  [OP.lor] : (o1, o2) => o1 || o2,
  [OP.xor] : (o1, o2) => o1 ^ o2,
  [OP.xors] : (o1, o2) => o1 ^ o2,
  [OP.mod] : (o1, o2) => o1 % o2,
  [OP.mods] : (o1, o2) => o1 % o2,
  [OP.left]: (o1, o2) => o1 << o2,
  [OP.righ]: (o1, o2) => o1 >> o2
};

/**
 * Mapping of the OP-codes of unary operations to their equivalent 
 * functions that will be triggered upon interpretation.
 * 
 * Notice that the functions take in two operands despite the 
 * operation being unary. This is because some of the unary operations 
 * utilize the first operand while others utilize the second one. This
 * ensures that the appropriate function can be called using the same
 * snippet of code.
 */
export const UNARY_OPERATIONS = {
  [OP.incr]: (o1, o2) => o1 + 1,
  [OP.decr]: (o1, o2) => o1 - 1,
  [OP.not] : (o1, o2) => !o2
};

export const createValue = (actualValue) => [ATYPES.value, actualValue];
export const createFieldReference = (address, fieldName) => [ATYPES.field, address, fieldName];

export const destructureValue = (valueStorage) => {
  const target = valueStorage;

  if( target === null || target === undefined )
  return null;

  if( Array.isArray(target) )
  {
    if( target[0] === ATYPES.value )
    return destructureValue(target[VALUE]);
    
    for( let i in target )
    target[i] = destructureValue(target[i]);
  }
  else if( typeof target === "object" )
  {
    for( const key of Object.keys(target) )
    target[key] = destructureValue(target[key]);
  }
  
  return target;
};
