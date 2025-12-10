const fs = require("fs");
const path = require("path");

// 1. Load the base configuration
const baseConfig = require("./typedoc.base.json");
const docsDir = "docs";

try {
  // 2. Scan the 'docs' folder
  if (fs.existsSync(docsDir)) {
    const files = fs.readdirSync(docsDir);

    // 3. Filter for .md files and create paths
    const mdFiles = files
      .filter((file) => file.endsWith(".md"))
      .map((file) => `${docsDir}/${file}`);

    // Optional: Sort them alphabetically or by a specific logic
    mdFiles.sort();

    // 4. Update the config object
    baseConfig.projectDocuments = mdFiles;

    console.log("Found project documents:", mdFiles);
  } else {
    console.warn("No docs folder found, skipping projectDocuments population.");
  }

  // 5. Write the final typedoc.json
  fs.writeFileSync("typedoc.json", JSON.stringify(baseConfig, null, 2));
  console.log("Successfully generated typedoc.json");
} catch (error) {
  console.error("Error generating TypeDoc config:", error);
  process.exit(1);
}
