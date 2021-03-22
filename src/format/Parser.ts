import any from "../parser/combinator/minimum/any";
import chain from "../parser/combinator/chain";
import chainR from "../parser/combinator/chainR";
import convert from "../parser/combinator/convert";
import not from "../parser/combinator/not";
import or from "../parser/combinator/or";
import repeat from "../parser/combinator/repeat";
import same from "../parser/combinator/minimum/same";
import { Parser } from "../parser/Types";
import option from "../parser/combinator/option";
import chainL from "../parser/combinator/chainL";
import { tokenize } from "./combinator/tokenize";
import { Indent, Token, Content } from "./Types";
import { init } from "../parser/combinator/util/init";

type Char = string & { length: 1 };
declare global {
  interface String {
    char(): Char;
    chars(): Char[];
  }
}
String.prototype[`char`] = function () {
  return this.charAt(0) as Char;
};
String.prototype[`chars`] = function () {
  return this.split("") as Char[];
};

type Src = Char;
const to = <T, Src>(parser: Parser<T, Src>): Parser<Src[], Src> => {
  const content = repeat(chainR(not(parser), any<Src>()));
  return convert(chain(content, option(parser)), ([content]) => content);
};
const sames = (it: string) => {
  const sames = it
    .chars()
    .reduce((sum, it) => [...sum, same(it)], [] as Parser<Char, Char>[]);
  return convert(chain(...sames), (it) => it.join(""));
};

const eol = sames("\n");
const indentChar = or(sames(" "), sames("\t"));
const emptyLine = chainL(repeat(indentChar), eol);
const emptyLines = repeat(emptyLine);
const line = convert(to(eol), (it) => it.join(""));
const sectionHeaderPrefix = sames("# ");

const indent = tokenize(repeat(indentChar), (it) => ({
  kind: "indent",
  value: it.join(""),
}));
const paragraph = (blockIndent: Indent) => {
  const paragraphIndent = chainR(indentChar, not(indentChar));
  const startOtherBlock = chain(indent, sectionHeaderPrefix);
  const nots = not(or(paragraphIndent, startOtherBlock, emptyLine));
  const oneLine = chainR(nots, line);
  const head = chainR(option(paragraphIndent), oneLine);
  const tails = repeat(chainR(sames(blockIndent.value), oneLine));
  const syntax = chain(head, tails);
  return tokenize(syntax, ([head, tails]) => ({
    kind: "paragraph",
    value: [head, ...tails].join(""),
  }));
};
const section = (() => {
  const section = (allowIndent: boolean): Parser<Token<"section">, Src> => (
    src
  ) => {
    const { ok, head: blockIndent, tails } = indent(src);
    if (allowIndent && blockIndent.value === "") return { ok: false } as any;
    const header = (() => {
      const syntax = chain(sectionHeaderPrefix, line);
      return tokenize(syntax, ([, line]) => ({
        kind: "sectionHeader",
        value: line,
      }));
    })();
    const syntax = chain(
      header,
      option(
        chainR(
          not(chain(sames(blockIndent.value), sectionHeaderPrefix)),
          contents(blockIndent)
        )
      )
    );
    const result = tokenize(syntax, ([header, contents]) => ({
      kind: "section",
      value: { header, contents: contents ? contents : [] },
    }))(tails);
    return { ...result, ok: result.ok && ok };
  };
  return {
    top: section(false),
    nested: section(true),
  } as const;
})();

const content = (indent: Indent): Parser<Content, Src> => {
  const syntax = chain(
    sames(indent.value),
    or(section.nested, paragraph(indent))
  );
  return convert(syntax, ([, content]) => content);
};
const contents = (indent: Indent) =>
  repeat(chainR(emptyLines, content(indent)));

const syntax = repeat(chainR(emptyLines, section.top));
const conversion = tokenize(syntax, ([head, ...tails]) => {
  const { header, contents } = head.value;
  return {
    kind: "markdown5",
    value: { title: header, contents: [...contents, ...tails] },
  };
});
export const parse = (
  src: string
): ReturnType<Parser<Token<"markdown5">, Char>> =>
  init(conversion)(src.chars());
