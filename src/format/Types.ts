export const enum TokenKind {
  indent,
  line,
  section,
  sectionHeader,
}
export type Indent = readonly [TokenKind.indent, string];
export type Line = readonly [TokenKind.line, string];
export type SectionHeader = readonly [TokenKind.sectionHeader, string];
export type Section = readonly [
  TokenKind.section,
  { header: SectionHeader; contents: Content[] }
];
export type Content = Section | Line;

export const Token = {
  indent: (v: string) => [TokenKind.indent, v] as const,
  line: (v: string) => [TokenKind.line, v] as const,
  sectionHeader: (v: string) => [TokenKind.sectionHeader, v] as const,
  section: (header: SectionHeader, contents: Content[]) =>
    [TokenKind.section, { header, contents }] as const,
};
