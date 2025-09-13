const requiredMajor = 22;
const [major] = process.versions.node.split(".").map(Number);
if (major < requiredMajor) {
  console.error(
    `\n✖ Node ${requiredMajor}.x required. You are on ${process.versions.node}.\n` +
    `→ Fix: install & use Node ${requiredMajor} with nvm.\n`
  );
  process.exit(1);
} else {
  console.log(`✔ Node ${process.versions.node} OK`);
}
