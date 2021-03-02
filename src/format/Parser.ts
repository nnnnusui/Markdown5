const Parser = () => {
  function parse(lines: string[]) {
    const section = parseSection(lines);
    return { section };
  }
  function dropEmptyLines(lines: string[]) {
    function recursion(lines: string[]): string[] {
      const [head, ...tails] = lines;
      if (head.trim() === "") {
        return recursion(tails);
      }
      return lines;
    }
    return recursion(lines);
  }
  function parseSection(lines: string[]) {
    const [head, ...tails] = dropEmptyLines(lines);
    const indent = parseIndent(head);
    const header = parseHeader(head.slice(indent.length));
    if (!header) {
      return;
    }

    function getContentLines(
      lines: string[],
      result: string[] = []
    ): [string[], string[]] {
      const [head, ...tails] = lines;
      const isNotEmptyLine = head.trim() !== "";
      const dedented = head.slice(0, indent.length) !== indent;
      if (isNotEmptyLine && dedented) {
        return [result, lines];
      }
      return getContentLines(tails, [...result, head]);
    }
    const [contentLines, afters] = getContentLines(tails);
    return {
      header,
      content: contentLines.map((it) => it.slice(indent.length)),
    };
  }
  function parseHeader(line: string) {
    const prefix = "# ";
    if (!line.startsWith(prefix)) {
      return;
    }
    const content = line.slice(prefix.length);
    return { content };
  }
  function parseIndent(line: string) {
    const trimed = line.trimStart();
    const depth = line.length - trimed.length;
    const indent = line.slice(0, depth);
    return indent;
  }
  return { parse };
};
export default Parser;
