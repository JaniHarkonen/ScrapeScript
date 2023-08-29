import { OPERATIONS } from "../parser/parser.js";
import { BUILT_IN, OPERATORS } from "../tokenizer/tokenizer.js";
import { TYPE_SIGNIFIERS } from "./TYPE_SIGNIFIERS.js";


const META = TYPE_SIGNIFIERS.meta;

/**
 * Interpreter instruction set.
 */
export const OP = {
  prnt: "prnt",   // print (any)
  flr: "flr",     // floor (number)
  roun: "roun",   // round (number)
  ceil: "ceil",   // ceil (number)
  rand: "rand",   // random (number)
  inof: "inof",   // index of (string)
  liof: "liof",   // last index of (string)
  sstr: "sstr",   // substring (string)
  len: "len",     // length (string/array)
  pnum: "pnum",   // parse number (string)
  pboo: "pboo",   // parse boolean (string)
  push: "push",   // push (array)
  pop: "pop",     // pop (array)
  rmv: "rmv",     // remove element (array)
  sft: "sft",     // shift (array)
  usft: "usft",   // unshift (array)
  isrt: "isrt",   // insert (array)
  cnct: "cnct",   // concat (array)
  rpl: "rpl",     // replace (string)
  rpla: "rpla",   // replace all (string)
  type: "type",   // type of (any)
  nan: "nan",     // is number nan (number)
  keys: "keys",   // keys (json)
  incl: "incl",   // includes (string/array)
  comb: "comb",   // combine (json)
  splt: "splt",   // split (string)
  tost: "tost",   // stringify (any)
  sqrt: "sqrt",   // square root (number)
  yld: "yld",     // exits program with value
  min: "min",     // minimum of two (number)
  max: "max",     // maximum of two (number)
  abs: "abs",     // removes sign of number (number)
  clmp: "clmp",   // clamp between two values (number)
  sign: "sign",   // sign of a number (number)
  arg: "arg",     // returns a program argument (any)
  chat: "chat",   // character at (string)
  now: "now",     // current system time (number)

  setp: "setp",   // set pointer (ACCESS)
  aiof: "aiof",   // array index of (ACCESS)
  json: "json",   // creates a JSON (CREATE)
  arra: "arra",   // creates an array (CREATE)

  jmp:  "jmp",    // jump to line (CONTROL)
  jmpr: "jmpr",   // jump to relative line (CONTROL)
  cmpr: "cmpr",   // compare and jump to relative line (CONTROL)
  noop: "noop",   // no operation (CONTROL)
  cpsh: "cpsh",   // push a value into the call stack (CONTROL)
  cpop: "cpop",   // pop a value from the call stack (CONTROL)
  cppc: "cppc",   // push the current program counter to the call stack (CONTROL)
  mpsh: "mpsh",   // push a new memory context to the memory stack (CONTROL)
  mpop: "mpop",   // pop a memory context from the memory stack (CONTROL)

  AS_FUNCTION:   META + "AS_FUNCTION",   // treat a memory address as a function from this point on (META)
  END_FUNCTION:  META + "END_FUNCTION",  // marks the ending of a function (META)
  LINE_BREAK:    META + "LINE_BREAK",    // marks the current line as the one that the previous break leads to (META)
  LINE_CONTINUE: META + "LINE_CONTINUE", // marks the current line as the one that the next continue leads to (META)
  BLOCK_START:   META + "BLOCK_START",   // marks the beginning of a block and starts a new scope for meta settings (META)
  BLOCK_END:     META + "BLOCK_END",     // marks an ending of a block and resets the other meta settings (META)
  GOTO_BREAK:    META + "GOTO_BREAK",    // marks a jump that is to lead to the LINE_BREAK; ends a breakable structure (META)
  GOTO_CONTINUE: META + "GOTO_CONTINUE", // marks a jump that is to lead to the LINE_CONTINUE (META)
  BREAKABLE:     META + "BREAKABLE",     // marks the beginning of a structure that can be escaped via "break" (META)
  RETURN:        META + "RETURN",        // marks a function return

  add: "add",     // +
  subt: "subt",   // -
  mul: "mul",     // *
  div: "div",     // /
  incr: "incr",   // ++
  decr: "decr",   // --
  set: "set",     // =
  seti: "seti",   // initial setting of an address (overrides previous value residing in the address)
  adds: "adds",   // +=
  subs: "subs",   // -=
  muls: "muls",   // *=
  divs: "divs",   // /=
  equ: "equ",     // ==
  nequ: "nequ",   // !=
  gre: "gre",     // >
  less: "less",   // <
  gree: "gree",   // >=
  lsse: "lsse",   // <=
  not: "not",     // !
  and: "and",     // &
  land: "land",   // &&
  ands: "ands",   // &=
  or: "or",       // |
  lor: "lor",     // ||
  ors: "ors",     // |=
  xor: "xor",     // ^
  xors: "xors",   // ^=
  mod: "mod",     // %
  mods: "mods",   // %=
  left: "left",   // <<
  righ: "righ"    // >>
};

/**
 * Mapping of operations to "OP-codes" which are the interpreter
 * equivalents of the more verbose "operations" output by the 
 * parser.
 * 
 * Notice that not all "operations" have their counterparts in
 * the instruction set.
 */
const OPERATION_TO_OP_CODE = {
  [OPERATIONS.access]: OP.setp,

  [BUILT_IN.print]: OP.prnt,
  [BUILT_IN.floor]: OP.flr,
  [BUILT_IN.ceil]: OP.ceil,
  [BUILT_IN.round]: OP.roun,
  [BUILT_IN.random]: OP.rand,
  [BUILT_IN.sqrt]: OP.sqrt,
  [BUILT_IN.indexOf]: OP.inof,
  [BUILT_IN.lastIndexOf]: OP.liof,
  [BUILT_IN.parseNumber]: OP.pnum,
  [BUILT_IN.parseBoolean]: OP.pboo,
  [BUILT_IN.length]: OP.len,
  [BUILT_IN.substring]: OP.sstr,
  [BUILT_IN.push]: OP.push,
  [BUILT_IN.pop]: OP.pop,
  [BUILT_IN.remove]: OP.rmv,
  [BUILT_IN.shift]: OP.sft,
  [BUILT_IN.unshift]: OP.usft,
  [BUILT_IN.insert]: OP.isrt,
  [BUILT_IN.concat]: OP.cnct,
  [BUILT_IN.replace]: OP.rpl,
  [BUILT_IN.replaceAll]: OP.rpla,
  [BUILT_IN.typeOf]: OP.type,
  [BUILT_IN.isNaN]: OP.nan,
  [BUILT_IN.keys]: OP.keys,
  [BUILT_IN.includes]: OP.incl,
  [BUILT_IN.combine]: OP.comb,
  [BUILT_IN.split]: OP.splt,
  [BUILT_IN.stringify]: OP.tost,
  [BUILT_IN.abs]: OP.abs,
  [BUILT_IN.min]: OP.min,
  [BUILT_IN.max]: OP.max,
  [BUILT_IN.clamp]: OP.clmp,
  [BUILT_IN.sign]: OP.sign,
  [BUILT_IN.getArgument]: OP.arg,
  [BUILT_IN.charAt]: OP.chat,
  [BUILT_IN.timeNow]: OP.now,

  [OPERATORS.add]: OP.add,
  [OPERATORS.subtract]: OP.subt,
  [OPERATORS.multiply]: OP.mul,
  [OPERATORS.divide]: OP.div,
  [OPERATORS.increment]: OP.incr,
  [OPERATORS.decrement]: OP.decr,
  [OPERATORS.assign]: OP.set,
  [OPERATORS.addAssign]: OP.adds,
  [OPERATORS.subtractAssign]: OP.subs,
  [OPERATORS.multiplyAssign]: OP.muls,
  [OPERATORS.divideAssign]: OP.divs,
  [OPERATORS.equals]: OP.equ,
  [OPERATORS.notEquals]: OP.nequ,
  [OPERATORS.greater]: OP.gre,
  [OPERATORS.less]: OP.less,
  [OPERATORS.greaterOrEqual]: OP.gree,
  [OPERATORS.lessOrEqual]: OP.lsse,
  [OPERATORS.not]: OP.not,
  [OPERATORS.and]: OP.and,
  [OPERATORS.ands]: OP.land,
  [OPERATORS.andAssign]: OP.ands,
  [OPERATORS.or]: OP.or,
  [OPERATORS.ors]: OP.lor,
  [OPERATORS.orAssign]: OP.ors,
  [OPERATORS.xor]: OP.xor,
  [OPERATORS.xorAssign]: OP.xors,
  [OPERATORS.modulo]: OP.mod,
  [OPERATORS.moduloAssign]: OP.mods,
  [OPERATORS.shiftLeft]: OP.left,
  [OPERATORS.shiftRight]: OP.righ,
};

export const getOpCode = (operation) => {
  return OPERATION_TO_OP_CODE[operation];
};
