#!/usr/bin/env node

/* eslint-disable @typescript-eslint/naming-convention */
import cac from "cac";
import { glob } from "glob";
import { existsSync, mkdirSync, readFileSync, stat, writeFile } from "fs";
import { dirname } from "path";
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
    const template = readFileSync(path, {
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
cli
  .command("compile <path>", "transpile to html")
  .option("--template <path>", "template html file path")
  .action((path: string, options) => {
    stat(path, (err, stats) => {
      const root = stats.isDirectory() ? path : dirname(path);
      const pattern = stats.isDirectory() ? `${path}**/*.m5` : path;
      const out = stats.isDirectory() ? root + "out/" : root;
      const templatePath = options["template"]
        ? options["template"]
        : root + "m5template.html";
      const template = Template.from(templatePath);
      glob(pattern, (err, paths) => {
        const parseResults = paths.flatMap((path) => {
          const text = readFileSync(path, { encoding: "utf8" });
          const relative = path.replace(root, "");
          const [, ...tails] = relative.split(".").reverse();
          const relativePathWithoutExtension = tails.reverse().join("");
          return Markdown5.parse(text).map((parsed) => ({
            src: relativePathWithoutExtension,
            parsed,
          }));
        });

        parseResults.map(({ src, parsed }) => {
          const output = `${out}${src}.html`;
          const parent = dirname(output);
          if (!existsSync(parent)) mkdirSync(parent, { recursive: true });
          writeFile(
            `${out}${src}.html`,
            template.generateHtmlFromM5Token(parsed),
            () => {}
          );
        });

        const list = parseResults.map(({ src, parsed }) => {
          const title = parsed.value.title.value;
          return `<li><a href="${src}.html">${title}</a></li>`;
        });
        const title = "Articles";
        const description = "めも書き一覧";
        const body = `
            <h1>${title}</h1>
            <ul>${list.join("")}</ul>
          `;
        writeFile(
          out + "list.html",
          template.generateList(body, title, description),
          () => {}
        );
      });
    });
  });
cli.help();
cli.parse();
