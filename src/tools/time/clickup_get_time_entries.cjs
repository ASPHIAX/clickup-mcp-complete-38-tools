const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_get_time_entries",
  description: "Get time tracking entries for a task",
  inputSchema: {
    type: "object",
    properties: {
      taskId: { type: "string", description: "Task ID" }
    },
    required: ["taskId"]
  },
  async execute(params) {
    try {
      const { taskId } = params;
      const result = await makeClickUpCall("GET", `/api/v2/task/${taskId}/time`);
      return {
        success: true,
        taskId,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        taskId: params.taskId
      };
    }
  }
};