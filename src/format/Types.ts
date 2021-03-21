export const enum TokenKind {
  markdown5,
  section,
  sectionHeader,
  paragraph,
  indent,
}
export type Indent = { kind: TokenKind.indent; value: string };
export type Paragraph = { kind: TokenKind.paragraph; value: string };
export type SectionHeader = { kind: TokenKind.sectionHeader; value: string };
export type Section = {
  kind: TokenKind.section;
  value: { header: SectionHeader; contents: Content[] };
};
export type Markdown5 = {
  kind: TokenKind.markdown5;
  value: { title: SectionHeader; contents: Content[] };
};
export type Content = Section | Paragraph;

export type Token = Indent | Paragraph | SectionHeader | Section | Markdown5;

export const Token = {
  indent: (v: string): Indent => ({
    kind: TokenKind.indent,
    value: v,
  }),
  paragraph: (v: string): Paragraph => ({
    kind: TokenKind.paragraph,
    value: v,
  }),
  sectionHeader: (v: string): SectionHeader => ({
    kind: TokenKind.sectionHeader,
    value: v,
  }),
  section: (header: SectionHeader, contents: Content[]): Section => ({
    kind: TokenKind.section,
    value: { header, contents },
  }),
  markdown5: (title: SectionHeader, contents: Content[]): Markdown5 => ({
    kind: TokenKind.markdown5,
    value: { title, contents },
  }),
};
