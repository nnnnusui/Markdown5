import any from "../parser/combinator/minimum/any";
import chain from "../parser/combinator/chain";
import chainR from "../parser/combinator/chainR";
import convert from "../parser/combinator/convert";
import not from "../parser/combinator/not";
import or from "../parser/combinator/or";
import repeat from "../parser/combinator/repeat";
import same from "../parser/combinator/minimum/same";
import { Parser } from "../parser/Types";
import { Content, Indent, Paragraph, Section, Token } from "./Types";
import option from "../parser/combinator/option";
import chainL from "../parser/combinator/chainL";

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

const t = Token;
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

const indent: Parser<Indent, Src> = convert(repeat(indentChar), (it) =>
  t.indent(it.join(""))
);
const paragraph = (blockIndent: Indent): Parser<Paragraph, Src> => {
  const paragraphIndent = chainR(indentChar, not(indentChar));
  const startOtherBlock = chain(indent, sectionHeaderPrefix);
  const nots = not(or(paragraphIndent, startOtherBlock, emptyLine));
  const oneLine = chainR(nots, line);
  const head = chainR(option(paragraphIndent), oneLine);
  const tails = repeat(chainR(sames(blockIndent.value), oneLine));
  const syntax = chain(head, tails);
  return convert(syntax, ([head, tails]) =>
    t.paragraph([head, ...tails].join(""))
  );
};
const section = (() => {
  const section = (allowIndent: boolean): Parser<Section, Src> => (
    src: Src[]
  ) => {
    const { ok, head: blockIndent, tails } = indent(src);
    if (allowIndent && blockIndent.value === "") return { ok: false } as any;
    const header = (() => {
      const syntax = chain(sectionHeaderPrefix, line);
      return convert(syntax, ([, line]) => t.sectionHeader(line));
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
    const result = convert(syntax, ([header, contents]) =>
      t.section(header, contents ? contents : [])
    )(tails);
    return { ...result, ok: result.ok && ok };
  };
  return {
    top: section(false),
    nested: section(true),
  };
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
const conversion = convert(
  syntax,
  ([head, ...tails]): Section => {
    const { kind, value } = head;
    return {
      kind,
      value: { ...value, contents: [...value.contents, ...tails] },
    };
  }
);
export const parse = (src: string) => conversion(src.chars());
