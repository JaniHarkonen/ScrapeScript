export default class Compilation {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  
  addStart(snippet, ignore = false) {
    if( this.head )
    snippet.attachNext(this.head);

    this.head = snippet;

    if( !ignore )
    this.length++;

    return snippet;
  }

  add(snippet, ignore = false) {
    if( this.tail )
    this.tail.attachNext(snippet);
    else
    this.head = snippet;

    this.tail = snippet;

    if( !ignore )
    this.length++;

    return snippet;
  }

  addIgnore(snippet) {
    return this.add(snippet, true);
  }

  addStartIgnore(snippet) {
    return this.addStart(snippet, true);
  }

  mergeEnd(compilation) {
    this.add(compilation.head);
    this.tail = compilation.tail;
    this.length += compilation.length - 1;
  }

  print() {
    this.head.printLines();
  }
}
