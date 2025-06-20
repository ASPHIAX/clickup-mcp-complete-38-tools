const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_create_goal",
  description: "Create a new goal in workspace",
  inputSchema: {
    type: "object",
    properties: {
      workspaceId: { type: "string", description: "Workspace ID" },
      name: { type: "string", description: "Goal name" },
      description: { type: "string", description: "Goal description" },
      due_date: { type: "number", description: "Due date as Unix timestamp" }
    },
    required: ["workspaceId", "name"]
  },
  async execute(params) {
    try {
      const { workspaceId, name, description, due_date } = params;
      const body = { name };
      if (description) body.description = description;
      if (due_date) body.due_date = due_date;
      
      const result = await makeClickUpCall("POST", `/api/v2/team/${workspaceId}/goal`, body);
      return {
        success: true,
        message: "Goal created successfully",
        workspaceId,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        workspaceId: params.workspaceId
      };
    }
  }
};