const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_create_time_entry",
  description: "Create a manual time entry",
  inputSchema: {
    type: "object",
    properties: {
      taskId: { type: "string", description: "Task ID" },
      duration: { type: "number", description: "Duration in milliseconds" },
      start: { type: "number", description: "Start time as Unix timestamp" },
      description: { type: "string", description: "Description of work" }
    },
    required: ["taskId", "duration"]
  },
  async execute(params) {
    try {
      const { taskId, duration, start, description } = params;
      const body = { duration };
      if (start) body.start = start;
      if (description) body.description = description;
      
      const result = await makeClickUpCall("POST", `/api/v2/task/${taskId}/time`, body);
      return {
        success: true,
        message: "Time entry created",
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