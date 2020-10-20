const getActionColor = (status) => {
  switch (status) {
    case "success":
      return "good";
    case "failure":
      return "failure";
    case "cancelled":
      return "warning";
    // code block
    default:
      return "warning";
    // code block
  }
};

const getActionStepIcon = (status) => {
  switch (status) {
    case "success":
      return ":green_circle:";
    case "failure":
      return ":red_circle:";
    case "cancelled":
      return ":yellow_circle: ";
    // code block
    default:
      return ":interrobang:";
    // code block
  }
};

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

const generateActionSteps = (stepsObject) => {
  const stepsArray = [];
  Object.entries(stepsObject).forEach(([step, status]) => {
    stepsArray.push({ status: getActionStepIcon(status.outcome), text: step });
  });
  return stepsArray;
};

const actionStatusFormatter = (actionStatus, actionSteps) => {
  if (fieldGenerator(actionSteps).length > 0) {
    return actionStatus.toUpperCase();
  } else {
    return "BUILD STARTED " + actionStatus.toUpperCase();
  }
};

const generateObject = (context, actionStatus, actionSteps, actionName) => {
  const actionObject = {
    senderName: "GitHub Action",
    actionStatus: getActionColor(actionStatus),
    avatar_url: "https://octodex.github.com/images/inflatocat.png",
    title:
      context.workflow.toUpperCase() +
      " - Action Status *" +
      actionStatusFormatter(actionStatus, generateActionSteps(actionSteps)) +
      "*",
    fieldRows: [
      {
        name: "Triggered by",
        linkName: context.eventName,
        linkUrl: null,
      },
      {
        name: "Link",
        linkName: actionName,
        linkUrl: context.payload.head_commit.url + "/checks",
      },
      {
        name: "Changes",
        linkName: context.payload.head_commit.id.slice(0, 8),
        linkUrl: context.payload.head_commit.url,
      },
      {
        name: "Message",
        linkName: context.payload.head_commit.message,
        linkUrl: null,
      },
    ],
    actionSteps: generateActionSteps(actionSteps),
    time: context.payload.head_commit.timestamp,
    repoName: context.payload.repository.name,
  };

  return actionObject;
};

module.exports = generateObject;
