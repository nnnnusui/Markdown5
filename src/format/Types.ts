export const enum TokenKind {
  indent,
  paragraph,
  sectionHeader,
  section,
}
export type Indent = readonly [TokenKind.indent, string];
export type Paragraph = readonly [TokenKind.paragraph, string];
export type SectionHeader = readonly [TokenKind.sectionHeader, string];
export type Section = readonly [
  TokenKind.section,
  { header: SectionHeader; contents: Content[] }
];
export type Content = Section | Paragraph;

export const Token = {
  indent: (v: string) => [TokenKind.indent, v] as const,
  paragraph: (v: string) => [TokenKind.paragraph, v] as const,
  sectionHeader: (v: string) => [TokenKind.sectionHeader, v] as const,
  section: (header: SectionHeader, contents: Content[]) =>
    [TokenKind.section, { header, contents }] as const,
};
