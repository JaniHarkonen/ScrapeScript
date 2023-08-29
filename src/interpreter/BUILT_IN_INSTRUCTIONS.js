import { ERRORS, throwFatalError } from "../ERRORS.js";
import { VALUE, createValue, destructureValue } from "./interpreterUtils.js";

/**
 * Mapping of built-in functions to the OP-codes of the instructions
 * that trigger them.
 */
export const BUILT_IN_INSTRUCTIONS = {
    // Print message into console
  prnt: (getArgument) => {
    console.log(destructureValue(getArgument()));
    return null;
  },
    // Rounds a value down to the nearest integer
  flr: (getArgument) => Math.floor(getArgument()),
    // Rounds a value up to the nearest integer
  ceil: (getArgument) => Math.ceil(getArgument()),
    // Rounds a value according to normal rounding rules
  roun: (getArgument) => Math.round(getArgument()),
    // Generates a random number
  rand: () => Math.random(),
    // Returns the length of a string or an array
  len: (getArgument) => {
    const target = getArgument();

    if( typeof target !== "string" && !Array.isArray(target) )
    throwFatalError(ERRORS.runtime, ERRORS.runtime.operations.length.typeMismatch);

    return target.length;
  },
    // Parses a number from string and returns it
  pnum: (getArgument) => {
    const string = getArgument();

    if( typeof string !== "string" )
    throwFatalError(ERRORS.runtime, ERRORS.runtime.operations.parseNumber.typeMismatch);

    return string * 1;
  },
    // Parses a boolean from string and returns it
  pboo: (getArgument) => {
    const string = getArgument();

    if( typeof string !== "string" )
    throwFatalError(ERRORS.runtime, ERRORS.runtime.operations.parseBoolean.typeMismatch);

    return string === "true";
  },
    // Push value to array (array is modified)
  push: (getArgument) => {
    const pushedValue = getArgument();
    const array = getArgument();
    array.push(createValue(pushedValue));

    return null;
  },
    // Pop value out of array (array is modified)
  pop: (getArgument) => {
    const array = getArgument();
    const poppedValue = array.pop();

    return poppedValue;
  },
    // Removes first element of array and returns the element
  sft: (getArgument) => {
    const array = getArgument();
    const shiftedValue = array.shift();

    return shiftedValue;
  },
    // Adds an element to beginning of array (array is modified)
  usft: (getArgument) => {
    const value = getArgument();
    const array = getArgument();
    array.unshift(createValue(value));

    return null;
  },
    // Returns whether value is not a number
  nan: (getArgument) => {
    const value = getArgument();

    return isNaN(value);
  },
    // Returns the type of value
  type: (getArgument) => {
    const value = getArgument();
    let type;

    if( Array.isArray(value) )
    type = "array";
    else type = typeof value;

    return type;
  },
    // Replaces substring within a string with another
  rpl: (getArgument) => {
    const replacementString = getArgument();
    const subString = getArgument();
    const string = getArgument();
    return string.replace(subString, replacementString);
  },
    // Replaces all occurrences of substring within a string with another
  rpla: (getArgument) => {
    const replacementString = getArgument();
    const subString = getArgument();
    const string = getArgument();
    return string.replaceAll(subString, replacementString);
  },
    // Returns keys of a JSON (Object.keys)
  keys: (getArgument) => {
    const json = getArgument();
    return Object.keys(json);
  },
    // Splits string according to a substring and forms an array of the components
  splt: (getArgument) => {
    const subString = getArgument();
    const string = getArgument();
    return string.split(subString);
  },
    // Converts value to string
  tost: (getArgument) => {
    const value = getArgument();
    let string;

    if( typeof value === "object" && !Array.isArray(value) )
    string = JSON.stringify(destructureValue(value), null, 2);
    else
    string = destructureValue(value).toString();

    return string;
  },
    // Returns square root of a value
  sqrt: (getArgument) => Math.sqrt(getArgument()),
    // Returns the smaller of two values
  min: (getArgument) => {
    const number1 = getArgument();
    const number2 = getArgument();
    return Math.min(number1, number2);
  },
    // Returns the largest of two values
  max: (getArgument) => {
    const number1 = getArgument();
    const number2 = getArgument();
    return Math.max(number1, number2);
  },
    // Strips the sign of a value and returns it
  abs: (getArgument) => Math.abs(getArgument()),
    // Returns sign of a value
  sign: (getArgument) => Math.sign(getArgument()),
    // Clamps a value between a minimum and a maximum value
  clamp: (getArgument) => {
    const max = getArgument();
    const min = getArgument();
    const number = getArgument();

    return Math.min(Math.max(number, min), max);
  },
    // Returns the index of substring within string starting from a position
  inof: (getArgument) => {
    const start = getArgument();
    const searchString = getArgument();
    const string = getArgument();

    return string.indexOf(searchString, start);
  },
    // Returns the last index of substring within string starting from a position
  liof: (getArgument) => {
    const start = getArgument();
    const searchString = getArgument();
    const string = getArgument();

    return string.lastIndexOf(searchString, start);
  },
    // Returns substring of string starting at a position and ending at another
  sstr: (getArgument) => {
    const end = getArgument();
    const start = getArgument();
    const string = getArgument();

    return string.substring(start, end);
  },
    // Returns whether an array of a string includes a given substring or entry
  incl: (getArgument) => {
    const value = getArgument();
    const target = getArgument();

    if( Array.isArray(target) )
    {
      for( const el of target )
      {
        if( el[VALUE] === value )
        return true;
      }

      return false;
    }

    return target.includes(value);
  },
    // Concatenates two arrays together (new array is formed and returned)
  cnct: (getArgument) => {
    const array2 = getArgument();
    const array1 = getArgument();

    return array1.concat(array2);
  },
    // Combines two JSONs together (new JSON is formed and returned)
  comb: (getArgument) => {
    const json2 = getArgument();
    const json1 = getArgument();

    return {
      ...json1,
      ...json2
    };
  },
    // Returns character at a position in a string
  chat: (getArgument) => {
    const index = getArgument();
    const string = getArgument();

    return string.charAt(index);
  },
    // Returns a high resolution timestamp in milliseconds (performance.now)
  now: (getArgument) => performance.now()
};
