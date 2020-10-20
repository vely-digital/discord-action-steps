const core = require("@actions/core");
const webhook = require("webhook-discord");

const fieldGenerator = (fieldRows) => {
  let field = "";
  fieldRows.map((c) => {
    if (c.linkUrl) {
      field += c.name + " - [`" + c.linkName + "`](" + c.linkUrl + ") \n";
    } else {
      field += c.name + " - " + c.linkName + "\n";
    }
  });
  return field;
};

const sendDiscord = async (url, actionObject) => {
  const Hook = new webhook.Webhook(url);

  const msg = new webhook.MessageBuilder()
    .setAvatar(actionObject.avatar_url)
    .setName(actionObject.senderName)
    .setColor(actionObject.actionStatus)
    .addField(actionObject.title, fieldGenerator(actionObject.fieldRows))

    .setFooter(
      actionObject.repoName,
      "https://octodex.github.com/images/inflatocat.png"
    )
    .setTime();

  if (fieldGenerator(actionObject.actionSteps).length > 0) {
    msg.addField("Job Steps", "");
    actionObject.actionSteps.map((c) => {
      msg.addField(`${c.status} ${c.text}`, "");
    });
  }

  try {
    return await Hook.send(msg);
  } catch (err) {
    core.setFailed(err.message);
  }
};

module.exports = sendDiscord;
