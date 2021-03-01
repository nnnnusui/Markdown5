declare global {
  interface String {
    to<T extends String>(that: T): string;
  }
}
Object.defineProperty(String.prototype, "test", {
  value: function<T> (this: string, that: T) {
    return `${this}[^${that}]*` as const;
  },
});
type Parser<Key, Prefix, Suffix = undefined> = {
  key: Key,
  prefix: Prefix,
  suffix: Suffix,
}
type Parsers =
  | Parser<"header", "# ">
  | Parser<"tag", "> ">

namespace Header {
  type Prefix = "# "

}
type IndentType = "tab" | "space"
const Indent = (src: String) => ({ src })
type Indent = ReturnType<typeof Indent>
const Dedent = () => ({})
type Dedent = ReturnType<typeof Dedent>

function tokenizeDedent(line: String, indentStack: Indent[]) {
  function recursion(indents: Indent[], dedents: Dedent[]): [Indent[], Dedent[]] {
    const indent = indents.map(it => it.src).join()
    if (line.startsWith(indent))
      return [indents, dedents]
    const nextIndents = indents.slice(1)
    return recursion(nextIndents, [...dedents, Dedent()])
  }
  return recursion(indentStack, [])
}
function tokenizeIndent(lines: String[]) {
  function recursion(head: String, tails: String[], indentStack: Indent[], nodes: (Indent | Dedent | String)[]) {
    const prevIndentSize = indentStack.map(it => it.src).join().length
    const currentIndentSize = head.
    const [indents, dedents] = tokenizeDedent(head, indentStack)
    
    const [nextHead, ...nextTails] = tails
  }
  const [head, ...tails] = lines
  return recursion(head, tails, [Indent("")], [])
}
const Lexer = () => {
  function parse() {}
  
  function header<T extends String>(it: T): T extends `# ${infer It}\n` ? It : never {
    return it
  }
  // const header: Head = "# ".to("\n");
  return {
    header,
  } as const;
};
export default Lexer;
