const enum TokenKind {
  Indent,
  Section,
  Header,
  Text,
}
type Indent = {
  kind: TokenKind.Indent;
  value: string;
};
type Text = {
  kind: TokenKind.Text;
  value: string;
};
type Header = {
  kind: TokenKind.Header;
  text: string;
};
type Section = {
  kind: TokenKind.Section;
  header: Header;
  child: Content[];
};
type Content = Section | Text;

type Result<Err, Ok> =
  | {
      ok: true;
      get: Ok;
    }
  | {
      ok: false;
      get: Err;
    };
function ok<T>(it: T) {
  return {
    ok: true,
    get: it,
  } as const;
}
function err<T>(it: T) {
  return {
    ok: false,
    get: it,
  } as const;
}

type Parser<A, Src> = (src: Src) => Result<string, [A, Src]>;
export const symbol = (it: string): Parser<string, string> => (src) => {
  const head = src.slice(0, it.length);
  const tail = src.slice(it.length);
  if (head === it) return ok([head, tail]);
  return err("err");
};
export function chain<A, B, Src>(
  a: Parser<A, Src>,
  b: Parser<B, Src>
): Parser<[A, B], Src> {
  return (src) => {
    const resultA = a(src);
    if (!resultA.ok) return err("");
    const resultB = b(resultA.get[1]);
    if (!resultB.ok) return err("");
    return ok([[resultA.get[0], resultB.get[0]], resultB.get[1]]);
  };
}
export function chainR<L, R, Src>(func: Parser<[L, R], Src>): Parser<R, Src> {
  return (src) => {
    const result = func(src);
    if (!result.ok) return result;
    return ok([result.get[0][1], result.get[1]]);
  };
}
export function choose<A, B, Src>(
  a: Parser<A, Src>,
  b: Parser<B, Src>
): Parser<A | B, Src> {
  return (src) => {
    const resultA = a(src);
    if (resultA.ok) return resultA;
    const resultB = b(src);
    if (resultB.ok) return resultB;
    return err("");
  };
}
const Parser = () => {
  function tokenizer<Token, A, Src>(
    parser: Parser<A, Src>,
    tokenize: (result: A) => Token
  ) {
    return (src: Src) => {
      const result = parser(src);
      if (!result.ok) return result;
      return {
        ...result,
        get: [tokenize(result.get[0]), result.get[1]] as const,
      };
    };
  }
  const newLine = tokenizer(symbol("\n"), () => {});

  function parse(text: string) {
    const section = parseSection(text);
    return choose(symbol("\n"), symbol(" "))(text);
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
  function parseSection(text: string) {
    const lines = text.split("\n");
    const [head, ...tails] = dropEmptyLines(lines);
    const indentRes = parseIndent(head);
    if (!indentRes.ok) {
      return;
    }
    const indent = indentRes.get;
    const indentLength = indent.value.length;
    const headerRes = parseHeader(head.slice(indentLength));
    if (!headerRes.ok) {
      return;
    }
    const header = headerRes.get;

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
    return ok({ kind: TokenKind.Header, text: content });
  }
  function parseIndent(line: string): Result<string, Indent> {
    const trimed = line.trimStart();
    const depth = line.length - trimed.length;
    const indent = line.slice(0, depth);
    return ok({ kind: TokenKind.Indent, value: indent });
  }
  return { parse };
};
export default Parser;
