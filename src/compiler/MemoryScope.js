import Address from "./Address.js";

import { ERRORS, throwFatalError } from "../ERRORS.js";
import { formatAddress } from "./compilerUtils.js";


export default class MemoryScope {
  constructor(compilerContext = null, parentScope = null) {
    this.addressTable = {};
    this.addresses = [];
    this.addressCounter = 0;
    this.tempAddressIndex = 0;

    this.parentScope = parentScope;
    this.compilerContext = compilerContext;

    if( !parentScope )
    this.getNewTempAddress();
    else
    {
      this.addressCounter = parentScope.addressCounter;
      this.tempAddressIndex = parentScope.tempAddressIndex;
    }
  }

  release() {
    this.compilerContext.memory = this.parentScope;
  }

  doesVariableExist(variableName) {
    return (this.findAddress(variableName) !== undefined);
  }

  findAddress(variableName) {
    let reference = this.addressTable[variableName];

    if( reference === undefined && this.parentScope )
    reference = this.parentScope.findAddress(variableName);

    return reference;
  }

  getAddress(variableName) {
    return formatAddress(this.findAddress(variableName));
  }

  createAddress(variableName, isConstant, skipCheck = false) {
    if( !skipCheck && this.doesVariableExist(variableName) )
    throwFatalError(ERRORS.compiler, ERRORS.compiler.variableAlreadyExists, { f: variableName });

    const newVariableIndex = this.addressCounter;
    this.addressTable[variableName] = newVariableIndex;
    this.addresses.push(new Address(isConstant));
    this.addressCounter++;
    
    return formatAddress(newVariableIndex);
  }

  getTempAddress() {
    return this.getAddress((this.tempAddressIndex - 1) + "TEMP");
  }

  getNewTempAddress() {
    const lastIndex = this.tempAddressIndex;
    this.tempAddressIndex++;

    const tempAddress = this.findAddress(lastIndex + "TEMP");
    return (tempAddress === undefined) ? this.createAddress(lastIndex + "TEMP", true) : tempAddress;
  }

  setParentScope(parentScope) {
    this.parentScope = parentScope;
  }
}
