/**
 * This file contains the built-in functions of ScrapeScript along with
 * some documentation describing each one.
 * 
 * The idea is to use the JavaScript syntax highlighting in Visual Studio
 * Code for ScrapeScript files (.ss) and then import the built-in functions
 * as shown in `template.ss`. This way, VSC code completion will suggest
 * the built-in functions without having to do too much configuration. The
 * import-line will be ignored by the ScrapeScript tokenizer.
 */

/**
 * Prints a message in the console.
 * 
 * @param {Any} message Value containing the message.
 */
export function print(message)

/**
 * Rounds a given number down to the nearest integer and returns it.
 * 
 * @param {Number} number Number to round down.
 * 
 * @returns Number rounded down.
 */
export function floor(number);

/**
 * Rounds a given number up or down to the nearest integer according
 * to the standard rounding rules.
 * 
 * @param {Number} number Number to round.
 * 
 * @returns Rounded number.
 */
export function round(number);

/**
 * Rounds a given number up to the nearest integer and returns it.
 * 
 * @param {Number} number Number to round up.
 * 
 * @returns Number rounded up.
 */
export function ceil(number);

/**
 * Generates and returns a random value between 0 and 1.
 * 
 * @returns Random number.
 */
export function random();

/**
 * Calculates the square root of a number.
 * 
 * @param {Number} number Value whose square root to calculate.
 * 
 * @returns Square root of the number.
 */
export function sqrt(number);

/**
 * Returns the greatest of two values.
 * 
 * @param {Number} number1 First number.
 * @param {Number} number2 Second number.
 * 
 * @returns The greater value.
 */
export function max(number1, number2);

/**
 * Returns the lesser of two values.
 * 
 * @param {Number} number1 First number.
 * @param {Number} number2 Second number.
 * 
 * @returns The lesser value.
 */
export function min(number1, number2);

/**
 * Returns the absolute value of a number with 
 * the leading sign removed.
 * 
 * @param {Number} number Number whose absolute should be returned.
 * 
 * @returns The absolute value.
 */
export function abs(number);

/**
 * Returns the leading sign of a number (1, 0 or -1).
 * 
 * @param {Number} number Number whose sign should be returned.
 * 
 * @returns The sign of the number.
 */
export function sign(number);

/**
 * Clamps a number between a minimum and a maximum value.
 * 
 * @param {Number} value Number that is to be clamped.
 * @param {Number} min Minimum allowed value.
 * @param {Number} max Maximum allowed value.
 * 
 * @returns The value clamped between the minimum and the maximum.
 */
export function clamp(value, min, max);

/**
 * Returns the index of a substring within a given string.
 * The searc will start from a given position and advance
 * until a match is found. If no match is found, -1 will
 * be returned.
 * 
 * @param {String} string String from which to search.
 * @param {String} searchString String whose index to search.
 * @param {Number} start Index from which to start the search.
 * 
 * @returns The index of the substring or -1 if the substring was
 * not found.
 */
export function indexOf(string, searchString, start);

/**
 * Returns the last index of a substring within a given string.
 * The searc will start from a given position and move backwards
 * until a match is found. If no match is found, -1 will
 * be returned.
 * 
 * @param {String} string String from which to search.
 * @param {String} searchString String whose index to search.
 * @param {Number} start Index from which to start the search.
 * 
 * @returns The index of the substring or -1 if the substring was
 * not found.
 */
export function lastIndexOf(string, searchString, start);

/**
 * Returns a copy of a given string starting from a
 * given position and ending at another.
 * 
 * @param {String} string String that is to be copied.
 * @param {Number} start Starting index of the copy.
 * @param {Number} end Ending index of the copy.
 * 
 * @returns A copy of the string.
 */
export function substring(string, start, end);

/**
 * Returns the length of a string or an array.
 * 
 * @param {Any} target String or array whose length is to be returned.
 * 
 * @returns The length of the string or array.
 */
export function length(target);

/**
 * Parses a number from a string. If no number can be parsed, NaN
 * is returned.
 * 
 * @param {String} string String from which to parse.
 * 
 * @returns A number or NaN if no number could be parsed.
 */
export function parseNumber(string);

/**
 * Parses a boolean from a string. If no boolean can be parsed, false
 * is returned.
 * 
 * @param {String} string String from which to parse.
 * 
 * @returns A boolean based on the string.
 */
export function parseBoolean(string);

/**
 * Pushes a given value to the end of an array. The array will be 
 * modified.
 * 
 * @param {Array} array Array to push to value into.
 * @param {Any} value Value to push.
 */
export function push(array, value);

/**
 * Pops a value out of the end of an array and returns it. The array 
 * will be modified.
 * 
 * @param {Array} array Array from which to pop the value.
 * 
 * @returns The removed element.
 */
export function pop(array);

/**
 * Removes an element at a given index in an array. The array will
 * be modified.
 * 
 * @param {Array} array Array from which to remove.
 * @param {Number} index Index of the element that is to be removed.
 */
export function remove(array, index);

/**
 * Inserts a value into a given index of an array. The preceeding 
 * elements will be shifted forward by one. The array will be 
 * modified.
 * 
 * @param {Array} array Array to insert to.
 * @param {Number} index Index at which to insert.
 * @param {Any} value Value to be inserted.
 */
export function insert(array, index, value);

/**
 * Removes the first element of an array and returns it (a reverse
 * `pop()`). The array will be modified.
 * 
 * @param {Array} array Array to remove from.
 * 
 * @returns The removed element.
 */
export function shift(array);

/**
 * Adds an element to the beginning of an array. The array will 
 * be modified.
 * 
 * @param {Array} array Array to add to.
 * @param {Any} value Value to add.
 */
export function unshift(array, value);

/**
 * Merges the contents of an array with those of another and 
 * creates a new array. Neither array is modified.
 * 
 * @param {Array} array1 Array whose contents to add to.
 * @param {Array} array2 Array whose contents will be added.
 * 
 * @returns A new array with the contents of the two arrays.
 */
export function concat(array1, array2);

/**
 * Replaces the first occurrence of a substring in a string 
 * with a given replace string. A new string will be returned.
 * 
 * @param {String} string String whose contents to replace.
 * @param {String} substring Substring that is to be replaced.
 * @param {String} replaceValue String that will replace the substring.
 * 
 * @returns A copy of the string with the first substring replaced.
 */
export function replace(string, substring, replaceValue);

/**
 * Replaces all the occurrences of a substring in a string 
 * with a given replace string. A new string will be returned.
 * 
 * @param {String} string String whose contents to replace.
 * @param {String} substring Substring that is to be replaced.
 * @param {String} replaceValue String that will replace the substring.
 * 
 * @returns A copy of the string with all the substrings replaced.
 */
export function replaceAll(string, substring, replaceValue);

/**
 * Splits a given string according to a substring and assembles
 * the parts into an array.
 * 
 * @param {String} string String to be split.
 * @param {String} splitString Substring according which to split.
 * 
 * @returns An array of the parts of the string.
 */
export function split(string, splitString);

/**
 * Returns the type of a value as a string. The type can be:
 * - `number`
 * - `string`
 * - `boolean`
 * - `array`
 * - `object`
 * 
 * @param {Any} value Value whose type to return.
 * 
 * @returns A string indicating the type of the value.
 */
export function typeOf(value);

/**
 * Returns whether a value is not a number.
 * 
 * @param {Any} value Value to check.
 * 
 * @returns Whether the value is not a number.
 */
export function isNaN(value);

/**
 * Returns an array of the keys of a JSON.
 * 
 * @param {JSON} object JSON whose keys return.
 * 
 * @returns Array containing the keys in string form.
 */
export function keys(object);

/**
 * Converts a value into a string. If the value is a JSON,
 * it will be padded with double spaces.
 * 
 * @param {Any} value Value to be converted.
 * 
 * @returns A string version of the value.
 */
export function stringify(value);

/**
 * Returns whether an array of a string contains a given 
 * element.
 * 
 * @param {Any} target Array or string whose contents to search.
 * @param {Any} value Value to search.
 * 
 * @returns Boolean indicating whether a given value was found.
 */
export function includes(target, value);

/**
 * Combines the contents of two JSONs and returns a new JSON
 * containing the merge result. Neither JSON is modified.
 * 
 * @param {JSON} object1 JSON in which to merge.
 * @param {JSON} object2 JSON whose contents to merge.
 * 
 * @returns A shallow merge of the two JSONs.
 */
export function combine(object1, object2);

/**
 * Returns a given program argument.
 * 
 * @param {Number} index Index of the program argument
 * in the argument array.
 * 
 * @returns The program argument.
 */
export function getArgument(index);

/**
 * Returns the character at a given index in a string.
 * 
 * @param {String} string String whose character to return.
 * @param {Number} index Index of the character to return.
 * 
 * @returns The character at the index.
 */
export function charAt(string, index);

/**
 * Returns a high resolution timestamp in milliseconds using
 * `performance.now()`.
 * 
 * @returns Current system time.
 */
export function timeNow();
