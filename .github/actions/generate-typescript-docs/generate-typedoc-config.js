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
  // 2. Check if the final file already exists in the workspace
  if (fs.existsSync(finalConfigPath)) {
    console.log("ℹ️  User provided typedoc.json found.");
    console.log("   Skipping dynamic generation to respect project settings.");
    process.exit(0);
  }

  // 3. Load the base config from the Action folder (This was step 1 in the old logic)
  if (!fs.existsSync(baseConfigPath)) {
    console.error(`Base config not found at: ${baseConfigPath}`);
    process.exit(1);
  }
  const baseConfig = require(baseConfigPath);

  // 4. Scan the 'docs' folder in the Workspace folder
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

  // 5. Write the final typedoc.json to the Workspace root
  fs.writeFileSync(finalConfigPath, JSON.stringify(baseConfig, null, 2));
  console.log(`✅ Generated dynamic typedoc.json at: ${finalConfigPath}`);
} catch (error) {
  // The original error was likely caught here, but the fix is in step 1.
  console.error("❌ Error generating config:", error);
  process.exit(1);
}
