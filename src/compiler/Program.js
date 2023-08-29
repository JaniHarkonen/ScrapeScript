export default class Program {
  constructor(main = []) {
    this.main = main;
  }

  enterInstruction(instruction) {
    this.main.push(instruction.create());
  }

  setLine(lineNumber, instruction) {
    this.main[lineNumber] = instruction.create();
  }
}
