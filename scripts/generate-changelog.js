#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * Generate changelog from git commits
 */
function generateChangelog() {
  try {
    // Get git log
    const log = execSync('git log --pretty=format:"%h|%s|%an|%ad" --date=short', {
      encoding: "utf-8",
      cwd: path.join(__dirname, ".."),
    });

    const lines = log.split("\n");
    const changelog = {
      version: getCurrentVersion(),
      date: new Date().toISOString().split("T")[0],
      changes: {
        added: [],
        changed: [],
        fixed: [],
        removed: [],
      },
    };

    lines.forEach((line) => {
      const [hash, message, author, date] = line.split("|");
      const change = categorizeChange(message);
      if (change) {
        changelog.changes[change.type].push({
          message: change.message,
          hash,
          author,
          date,
        });
      }
    });

    // Generate markdown
    const markdown = generateMarkdown(changelog);

    // Write to file
    const changelogPath = path.join(__dirname, "..", "CHANGELOG.md");
    fs.writeFileSync(changelogPath, markdown, "utf-8");
    console.log("✅ Changelog generated: CHANGELOG.md");
  } catch (error) {
    console.error("Error generating changelog:", error.message);
    process.exit(1);
  }
}

/**
 * Get current version from package.json
 */
function getCurrentVersion() {
  const packagePath = path.join(__dirname, "..", "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
  return packageJson.version;
}

/**
 * Categorize a commit message
 */
function categorizeChange(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.startsWith("feat:") || lowerMessage.includes("add")) {
    return { type: "added", message };
  } else if (lowerMessage.startsWith("fix:") || lowerMessage.includes("fix")) {
    return { type: "fixed", message };
  } else if (lowerMessage.startsWith("refactor:") || lowerMessage.includes("change")) {
    return { type: "changed", message };
  } else if (lowerMessage.startsWith("remove:") || lowerMessage.includes("remove")) {
    return { type: "removed", message };
  }

  return null;
}

/**
 * Generate markdown from changelog
 */
function generateMarkdown(changelog) {
  let md = `# Changelog\n\n`;
  md += `## [${changelog.version}] - ${changelog.date}\n\n`;

  if (changelog.changes.added.length > 0) {
    md += `### Added\n\n`;
    changelog.changes.added.forEach((change) => {
      md += `- ${change.message} (${change.hash})\n`;
    });
    md += "\n";
  }

  if (changelog.changes.changed.length > 0) {
    md += `### Changed\n\n`;
    changelog.changes.changed.forEach((change) => {
      md += `- ${change.message} (${change.hash})\n`;
    });
    md += "\n";
  }

  if (changelog.changes.fixed.length > 0) {
    md += `### Fixed\n\n`;
    changelog.changes.fixed.forEach((change) => {
      md += `- ${change.message} (${change.hash})\n`;
    });
    md += "\n";
  }

  if (changelog.changes.removed.length > 0) {
    md += `### Removed\n\n`;
    changelog.changes.removed.forEach((change) => {
      md += `- ${change.message} (${change.hash})\n`;
    });
    md += "\n";
  }

  return md;
}

// Run generation
if (require.main === module) {
  generateChangelog();
}

module.exports = { generateChangelog };
