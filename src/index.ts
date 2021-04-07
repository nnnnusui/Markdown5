/* eslint-disable @typescript-eslint/naming-convention */
import cac from "cac";
import { glob } from "glob";
import { readFileSync, stat } from "fs";
import { parse } from "./format/Parser";
import { transpile } from "./format/Transpiler";
import { Token } from "./format/Types";

const Markdown5 = {
  parse: (source: string) => {
    const { ok, head, tails } = parse(source);
    const result = ok ? [head] : [];
    return result;
  },
  transpile: transpile,
};
export default Markdown5;
export * from "./format/Types";

const Template = {
  from: (path: string) => {
    const template = readFileSync(path + "m5template.html", {
      encoding: "utf8",
    });
    return {
      generateHtmlFromM5Token: (m5: Token<"markdown5">) => {
        const title = m5.value.title.value;
        const firstContent = m5.value.contents[0];
        const description =
          firstContent.kind === "paragraph" ? firstContent.value : "...";
        const head = Template.getHead(title, description);
        const body = Template.getBody(m5);
        return template.replace("{head}", head).replace("{body}", body);
      },
      generateList: (body: string, title: string, description: string) => {
        const head = Template.getHead(title, description);
        return template.replace("{head}", head).replace("{body}", body);
      },
    };
  },
  getHead: (title: string, description: string) => {
    const result = `
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <title>${title}</title>
    `;
    return result;
  },
  getBody: (m5: Token<"markdown5">) => Markdown5.transpile(m5),
};

const cli = cac();
cli.command("compile <path>", "transpile to html").action((path: string) => {
  stat(path, (err, stats) => {
    if (stats.isDirectory()) {
      const template = Template.from(path);
      const pathPattern = path + "**/*.m5";
      glob(pathPattern, (err, paths) => {
        const parseResults = paths.flatMap((path) => {
          const text = readFileSync(path, { encoding: "utf8" });
          return Markdown5.parse(text).map((parsed) => ({ src: path, parsed }));
        });
        const htmls = parseResults.map(({ parsed }) =>
          template.generateHtmlFromM5Token(parsed)
        );
        const list = parseResults.map(({ src, parsed }) => {
          const relative = src.replace(path, "");
          const [, ...tails] = relative.split(".").reverse();
          const relativePathWithoutExtension = tails.reverse().join("");
          const title = parsed.value.title.value;
          return `<li><a href="${relativePathWithoutExtension}.html">${title}</a></li>`;
        });
        console.log(htmls);
        console.log(
          template.generateList(
            `
              <h1>Articles</h1>
              <ul>${list.join("")}</ul>
            `,
            "Articles",
            "めも書き一覧"
          )
        );
      });
    }
  });
});
cli.help();
cli.parse();
