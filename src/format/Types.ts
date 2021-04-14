/* eslint-disable @typescript-eslint/naming-convention */
export type FindFromUnion<
  Target extends unknown,
  KeyProp extends keyof Target,
  Key extends Target[KeyProp]
> = Extract<Target, Record<KeyProp, Key>>;

const TokenKind = [
  "title",
  "markdown5",
  "section",
  "sectionHeader",
  "list",
  "code",
  "paragraph",
  "text",
  "link",
] as const;
export type TokenKind = typeof TokenKind[number];

export type Link = { kind: "link"; value: { href: string; title: string } };
export type Text = { kind: "text"; value: string };
export type Span = Token<"text"> | Token<"link">;
export type Paragraph = { kind: "paragraph"; value: Span[] };
export type List = {
  kind: "list";
  value: { title: string; contents: Content[][] };
};
export type Code = {
  kind: "code";
  value: { title: string; content: string };
};
export type SectionHeader = { kind: "sectionHeader"; value: string };
export type Section = {
  kind: "section";
  value: { header: Token<"sectionHeader">; contents: Content[] };
};
export type Title = { kind: "title"; value: string };
export type Markdown5 = {
  kind: "markdown5";
  value: { title: Token<"title">; contents: Content[] };
};
export type Content = Token<"section" | "paragraph" | "list" | "code">;

export type TokenValue =
  | Link
  | Text
  | Paragraph
  | List
  | Code
  | SectionHeader
  | Section
  | Title
  | Markdown5;

export type Token<Kind extends TokenKind> = FindFromUnion<
  TokenValue,
  "kind",
  Kind
> & {
  offset: number;
};
export const Token = <Kind extends TokenKind>(
  value: FindFromUnion<TokenValue, "kind", Kind>,
  offset: number
): Token<Kind> => ({
  ...value,
  offset,
});
