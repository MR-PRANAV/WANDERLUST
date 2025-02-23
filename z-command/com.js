const { execSync } = require("child_process");

try {
    // Add all modified and new files
    execSync("git add .", { stdio: "inherit" });

    // Check if there are changes to commit
    const statusOutput = execSync("git status --porcelain").toString().trim();

    if (statusOutput) {
        // Commit changes
        const commitMessage = `"Auto commit on ${new Date().toLocaleString()}"`;
        execSync(`git commit -a -m ${commitMessage}`, { stdio: "inherit" });
        console.log("✅ Changes committed successfully!");
    } else {
        console.log("⚠️ No changes to commit, skipping commit step.");
    }

    // Always try to push
    execSync("git push", { stdio: "inherit" });

    console.log("✅ Git operations completed successfully!");
} catch (error) {
    console.error("❌ Error executing Git commands:", error.message);
}
