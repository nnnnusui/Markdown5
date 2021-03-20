import { expect } from "chai";
import { parse } from "../../format/Parser";
import { TokenKind } from "../../format/Types";

it("paragraph test", () => {
  const text = `
# Section1
p1
p1content

p2
  p2content

p3
 p4
p4content
`;
  expect(parse(text)).to.deep.equal({
    ok: true,
    head: {
      kind: TokenKind.section,
      value: {
        header: { kind: TokenKind.sectionHeader, value: "Section1" },
        contents: [
          { kind: TokenKind.paragraph, value: "p1p1content" },
          { kind: TokenKind.paragraph, value: "p2  p2content" },
          { kind: TokenKind.paragraph, value: "p3" },
          { kind: TokenKind.paragraph, value: "p4p4content" },
        ],
      },
    },
    tails: [],
  });
});
