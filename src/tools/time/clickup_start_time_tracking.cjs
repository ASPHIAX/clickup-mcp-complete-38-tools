const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_start_time_tracking",
  description: "Start time tracking for a task",
  inputSchema: {
    type: "object",
    properties: {
      taskId: { type: "string", description: "Task ID" },
      description: { type: "string", description: "Description of work being tracked" }
    },
    required: ["taskId"]
  },
  async execute(params) {
    try {
      const { taskId, description } = params;
      const body = {};
      if (description) body.description = description;
      
      const result = await makeClickUpCall("POST", `/api/v2/task/${taskId}/time`, body);
      return {
        success: true,
        message: "Time tracking started",
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