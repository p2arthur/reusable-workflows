const fs = require("fs");
const path = require("path");

// 1. Load the base configuration
const baseConfig = require("./typedoc.base.json");
const docsDir = "docs";

try {
  if (fs.existsSync(targetConfigPath)) {
    console.log("ℹ️  User provided typedoc.json found.");
    console.log("   Skipping dynamic generation to respect project settings.");
    process.exit(0);
  }

  if (fs.existsSync(docsDir)) {
    const files = fs.readdirSync(docsDir);

    const mdFiles = files
      .filter((file) => file.endsWith(".md"))
      .map((file) => `${docsDir}/${file}`);

    mdFiles.sort();

    baseConfig.projectDocuments = mdFiles;

    console.log("Found project documents:", mdFiles);
  } else {
    console.warn("No docs folder found, skipping projectDocuments population.");
  }

  fs.writeFileSync("typedoc.json", JSON.stringify(baseConfig, null, 2));
  console.log("Successfully generated typedoc.json");
} catch (error) {
  console.error("Error generating TypeDoc config:", error);
  process.exit(1);
}
