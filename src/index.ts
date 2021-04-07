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
  getHead: (m5: Token<"markdown5">) => {
    const title = m5.value.title.value;
    const firstContent = m5.value.contents[0];
    const description =
      firstContent.kind === "paragraph" ? firstContent.value : "...";
    const result = `
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <title>${title}</title>
    `;
    return result;
  },
};

const cli = cac();
cli.command("compile <path>", "transpile to html").action((path: string) => {
  stat(path, (err, stats) => {
    if (stats.isDirectory()) {
      const template = readFileSync(path + "m5template.html", {
        encoding: "utf8",
      });
      const pathPattern = path + "**/*.m5";
      glob(pathPattern, (err, paths) => {
        const transpiledResults = paths.flatMap((path) => {
          const text = readFileSync(path, { encoding: "utf8" });
          return Markdown5.parse(text).map((it) => ({
            body: Markdown5.transpile(it),
            head: Template.getHead(it),
          }));
        });
        const templateApplyed = transpiledResults.map(({ head, body }) =>
          template.replace("{head}", head).replace("{body}", body)
        );
        console.log(templateApplyed);
      });
    }
  });
});
cli.help();
cli.parse();
