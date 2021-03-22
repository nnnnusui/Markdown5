import { expect } from "chai";
import { parse } from "../../format/Parser";

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
      kind: "markdown5",
      value: {
        title: { kind: "sectionHeader", value: "Section1", offset: 1 },
        contents: [
          { kind: "paragraph", value: "p1p1content", offset: 12 },
          { kind: "paragraph", value: "p2  p2content", offset: 26 },
          { kind: "paragraph", value: "p3", offset: 42 },
          { kind: "paragraph", value: "p4p4content", offset: 45 },
        ],
      },
      offset: 0,
    },
    tails: { values: [], offset: 59 },
  });
});
