import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const outDir = resolve(root, "docs");
const files = [
  "404.html",
  "CNAME",
  "favicon.svg",
  "robots.txt",
  "share-card.png",
  "share-card-v2.png",
  "share-card-v3.png",
  "site.webmanifest",
];

await mkdir(outDir, { recursive: true });

await Promise.all(
  files.map((file) => copyFile(resolve(root, file), resolve(outDir, file))),
);

await writeFile(resolve(outDir, ".nojekyll"), "");
