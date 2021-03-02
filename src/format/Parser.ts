
const enum TokenKind {
  Indent,
  Section,
  Header,
  Text,
}
type Indent = {
  kind: TokenKind.Indent,
  value: String,
}
type Text = {
  kind: TokenKind.Text,
  value: String,
}
type Header = {
  kind: TokenKind.Header,
  text: String,
}
type Section = {
  kind: TokenKind.Section,
  header: Header,
  child: Content[],
}
type Content = Section | Text

type Result<Err, Ok> = {
  ok: true,
  get: Ok,
} | {
  ok: false,
  get: Err,
}

const Parser = () => {
  function ok<T>(it: T) {
    return {
      ok: true,
      get: it,
    } as const
  }
  function err<T>(it: T) {
    return {
      ok: false,
      get: it,
    } as const
  }
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
    const indentRes = parseIndent(head);
    if (!indentRes.ok) {
      return;
    }
    const indent = indentRes.get
    const indentLength = indent.value.length
    const headerRes = parseHeader(head.slice(indentLength));
    if (!headerRes.ok) {
      return;
    }
    const header = headerRes.get

    function getContentLines(
      lines: string[],
      result: string[] = []
    ): [string[], string[]] {
      const [head, ...tails] = lines;
      const isNotEmptyLine = head.trim() !== "";
      const dedented = head.slice(0, indentLength) !== indent.value;
      if (isNotEmptyLine && dedented) {
        return [result, lines];
      }
      return getContentLines(tails, [...result, head]);
    }
    const [contentLines, afters] = getContentLines(tails);
    return {
      header,
      content: contentLines.map((it) => it.slice(indentLength)),
    };
  }
  function parseHeader(line: string): Result<string, Header> {
    const prefix = "# ";
    if (!line.startsWith(prefix)) {
      return err("failure on parseHeader()");
    }
    const content = line.slice(prefix.length);
    return ok({kind: TokenKind.Header, text: content});
  }
  function parseIndent(line: string): Result<string, Indent> {
    const trimed = line.trimStart();
    const depth = line.length - trimed.length;
    const indent = line.slice(0, depth);
    return ok({kind: TokenKind.Indent, value: indent});
  }
  return { parse };
};
export default Parser;
