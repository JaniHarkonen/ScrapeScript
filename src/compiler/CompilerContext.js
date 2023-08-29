import MemoryScope from "./MemoryScope.js";


export default class CompilerContext {
  constructor() {
    this.memory = new MemoryScope(this);
  }

  startScope() {
    this.memory = new MemoryScope(this, this.memory);
  }

  releaseScope() {
    this.memory.release();
  }
}
