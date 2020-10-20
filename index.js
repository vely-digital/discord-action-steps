const core = require("@actions/core");
const github = require("@actions/github");
const sendDiscord = require("./src/discord.js");
const generateObject = require("./src/formatter");

const run = async () => {
  try {
    const context = github.context;

    const actionStatus = core.getInput("status", { required: true });
    const actionSteps = JSON.parse(
      core.getInput("steps", { required: false }) || "{}"
    );
    const actionName = process.env.GITHUB_JOB;

    const discordUrl = process.env.DISCORD_WEBHOOK_URL;

    const actionObject = generateObject(
      context,
      actionStatus,
      actionSteps,
      actionName
    );

    await sendDiscord(discordUrl, actionObject);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
