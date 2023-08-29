import Address from "../compiler/Address.js";
import { ATYPES } from "./ATYPES.js";
import { FIELD_INDEX, TYPE, VALUE, createValue } from "./interpreterUtils.js";

export default class Memory {
  constructor() {
    this.memory = {};
    this.memoryStack = [this.memory];
    this.callStack = [];
  }

  resolveFieldReference(fieldReference) {
    if( fieldReference[TYPE] !== ATYPES.field )
    return fieldReference;
    else
    return this.getValue(this.memory[fieldReference[VALUE]][fieldReference[FIELD_INDEX]]);
  }

  /**
   * Returns the value found in a given storage. If the 
   * storage points to another storage, recursion is used
   * to get the innermost value.
   * 
   * The value is returned as is. If you wish to return 
   * the value in its stored form ([ADDRESS_TYPE, storedValue]),
   * see getValueStorage.
   * 
   * @param {Array} storage Address storage that the 
   * value is to be returned from.
   * 
   * @returns Value of the storage as is.
   */
  getValue(storage) {
    const storageValue = storage[VALUE];
    const storageValueType = storage[TYPE];

    if( storageValueType === ATYPES.address )
    return this.getValue(this.memory[storageValue]);
    else if( storageValueType === ATYPES.field )
    {
      const referencedIndex = storage[FIELD_INDEX];
      return this.getValue(this.getValue(this.memory[storageValue])[referencedIndex]);
    }
    else
    return storageValue;
  }

  getStoredValue(storage) {
    return createValue(this.getValue(storage));
  }

  getAddress(address) {
    const storageValue = address[VALUE];
    const referencedStorage = this.memory[storageValue];

    if( referencedStorage )
    {
      if( referencedStorage[TYPE] === ATYPES.address )
      return this.getAddress(referencedStorage);
      else if( referencedStorage[TYPE] === ATYPES.field )
      return referencedStorage;
    }

    return address;
  }

  setAddress(addressStorage, storage) {
    if( addressStorage[TYPE] === ATYPES.field )
    {
      const index = addressStorage[FIELD_INDEX];
      this.memory[addressStorage[VALUE]][VALUE][index] = storage;
    }
    else
    this.memory[addressStorage[VALUE]] = storage;
  }

  callStackPush(storage) {
    this.callStack.push(storage);
  }

  callStackPop() {
    if( this.callStack.length <= 0 )
    return null;

    return this.callStack.pop();
  }

  createMemoryContext() {
    this.memory = { ...this.memory };
    this.memoryStack.push(this.memory);
  }

  releaseMemoryContext() {
    this.memoryStack.pop();
    this.memory = this.memoryStack[this.memoryStack.length - 1];
  }
}
