const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_update_goal",
  description: "Update an existing goal",
  inputSchema: {
    type: "object",
    properties: {
      goalId: { type: "string", description: "Goal ID" },
      name: { type: "string", description: "Goal name" },
      description: { type: "string", description: "Goal description" },
      due_date: { type: "number", description: "Due date as Unix timestamp" },
      completed: { type: "boolean", description: "Mark goal as completed" }
    },
    required: ["goalId"]
  },
  async execute(params) {
    try {
      const { goalId, name, description, due_date, completed } = params;
      const body = {};
      if (name) body.name = name;
      if (description) body.description = description;
      if (due_date) body.due_date = due_date;
      if (completed !== undefined) body.completed = completed;
      
      const result = await makeClickUpCall("PUT", `/api/v2/goal/${goalId}`, body);
      return {
        success: true,
        message: "Goal updated successfully",
        goalId,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        goalId: params.goalId
      };
    }
  }
};