const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_stop_time_tracking",
  description: "Stop time tracking for a task",
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
      const result = await makeClickUpCall("DELETE", `/api/v2/task/${taskId}/time`);
      return {
        success: true,
        message: "Time tracking stopped",
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