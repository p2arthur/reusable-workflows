const fs = require("fs");
const path = require("path");

const actionDir = __dirname;
const workspaceDir = process.cwd();

// --- THE FIX IS HERE ---
// 1. Declare the path variables first (outside the try block)

const baseConfigPath = path.join(actionDir, "typedoc.base.json");
const finalConfigPath = path.join(workspaceDir, "typedoc.json");
// -----------------------

try {
  if (fs.existsSync(finalConfigPath)) {
    console.log("ℹ️  User provided typedoc.json found.");
    console.log("   Skipping dynamic generation to respect project settings.");
    process.exit(0);
  }
  if (!fs.existsSync(baseConfigPath)) {
    console.error(`Base config not found at: ${baseConfigPath}`);
    process.exit(1);
  }
  const baseConfig = require(baseConfigPath);

  const docsDir = path.join(workspaceDir, "docs");

  if (fs.existsSync(docsDir)) {
    const files = fs.readdirSync(docsDir);

    const mdFiles = files
      .filter((file) => file.endsWith(".md"))
      .map((file) => `docs/${file}`);

    baseConfig.projectDocuments = mdFiles;
    console.log("✅ Found project documents:", mdFiles);
  } else {
    console.warn("No docs folder found in workspace.");
  }

  fs.writeFileSync(finalConfigPath, JSON.stringify(baseConfig, null, 2));
  console.log(`✅ Generated dynamic typedoc.json at: ${finalConfigPath}`);
} catch (error) {
  console.error("❌ Error generating config:", error);
  process.exit(1);
}
