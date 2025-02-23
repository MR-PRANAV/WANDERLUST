const { execSync } = require("child_process");

try {
    // Add all files
    execSync("git add .", { stdio: "inherit" });

    // Commit with a message (you can modify this to accept user input)
    const commitMessage = `"Auto commit on ${new Date().toLocaleString()}"`;
    execSync(`git commit -m ${commitMessage}`, { stdio: "inherit" });

    // Push to the current branch
    execSync("git push", { stdio: "inherit" });

    console.log("✅ Git operations completed successfully!");
} catch (error) {
    console.error("❌ Error executing Git commands:", error.message);
}

