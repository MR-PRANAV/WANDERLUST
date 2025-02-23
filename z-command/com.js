const { execSync } = require("child_process");

try {
    // Add all modified and new files
    execSync("git add .", { stdio: "inherit" });

    // Commit changes (using `-a` to include modified files)
    const commitMessage = `"Auto commit on ${new Date().toLocaleString()}"`;
    execSync(`git commit -a -m ${commitMessage}`, { stdio: "inherit" });

    // Push to the current branch
    execSync("git push", { stdio: "inherit" });

    console.log("✅ Git operations completed successfully!");
} catch (error) {
    console.error("❌ Error executing Git commands:", error.message);
}
