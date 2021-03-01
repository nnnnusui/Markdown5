const Parser = () => {
  function parse(lines: string[]) {
    const section = parseSection(lines);
    return { section };
  }
  function parseSection(lines: string[]) {
    const [head, ...tails] = lines;
    const indent = getIndent(head);
    const header = parseHeader(head.slice(indent.length));
    if (!header) {
      return;
    }
    return { header, content: tails.map((it) => it.slice(indent.length)) };
  }
  function parseHeader(line: string) {
    const prefix = "# ";
    if (!line.startsWith(prefix)) {
      return;
    }
    const content = line.slice(prefix.length);
    return { content };
  }
  function getIndent(line: string) {
    const trimed = line.trimStart();
    const depth = line.length - trimed.length;
    const indent = line.slice(0, depth);
    return indent;
  }
  return { parse };
};
export default Parser;
