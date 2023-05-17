const { randomUUID } = require("crypto");
const fs = require("fs");
const path = require("path");
const OUT = "../articles";
const MARKDOWN_DIR = "../../articles";

function makeArticle(id, title, content) {
  return {
    id,
    date: new Date().toISOString(),
    title,
    content,
  };
}

function stringifyMarkdown(content) {
  return JSON.stringify(content, null, 2);
}

function promptFor(prompt) {
  const { stdin, stdout } = process;
  stdin.resume();
  stdout.write(prompt);
  return new Promise((resolve) => {
    stdin.once("data", (data) => {
      resolve(data.toString().trim());
    });
  });
}

(async function main() {
  const args = process.argv.slice(2);
  const title = args[0] != null ? args[0] : await promptFor("Article Title: ");
  const id = args[1] != null ? args[1] : await promptFor("Article ID: ");

  console.log(`Creating article ${id} with title ${title}`);
  const content = fs.readFileSync(path.join(MARKDOWN_DIR, `${id}.md`), "utf8");
  const article = makeArticle(id, title, content);
  const json = stringifyMarkdown(article);
  fs.writeFileSync(path.join(OUT, `${id}.json`), json);
})();
