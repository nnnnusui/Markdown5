export const enum TokenKind {
  indent,
  paragraph,
  sectionHeader,
  section,
}
export type Indent = { kind: TokenKind.indent; value: string };
export type Paragraph = { kind: TokenKind.paragraph; value: string };
export type SectionHeader = { kind: TokenKind.sectionHeader; value: string };
export type Section = {
  kind: TokenKind.section;
  value: { header: SectionHeader; contents: Content[] };
};
export type Content = Section | Paragraph;

export type Token = Indent | Paragraph | SectionHeader | Section;

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
};
