/* eslint-disable @typescript-eslint/naming-convention */
export type FindFromUnion<
  Target extends unknown,
  KeyProp extends keyof Target,
  Key extends Target[KeyProp]
> = Extract<Target, Record<KeyProp, Key>>;
// function toEnum<T extends {[index: string]: U}, U extends string>(x: T) { return x; }

const TokenKind = [
  "markdown5",
  "section",
  "sectionHeader",
  "paragraph",
  "indent",
] as const;
export type TokenKind = typeof TokenKind[number];

export type Indent = { kind: "indent"; value: string };
export type Paragraph = { kind: "paragraph"; value: string };
export type SectionHeader = { kind: "sectionHeader"; value: string };
export type Section = {
  kind: "section";
  value: { header: Token<"sectionHeader">; contents: Content[] };
};
export type Markdown5 = {
  kind: "markdown5";
  value: { title: Token<"sectionHeader">; contents: Content[] };
};
export type Content = Token<"section"> | Token<"paragraph">;

export type TokenValue =
  | Indent
  | Paragraph
  | SectionHeader
  | Section
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
