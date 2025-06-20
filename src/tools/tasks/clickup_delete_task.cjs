const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_delete_task",
  description: "Delete a task from your Workspace",
  inputSchema: {
    type: "object",
    properties: {
      taskId: { type: "string", description: "Task ID to delete" }
    },
    required: ["taskId"]
  },
  async execute(params) {
    try {
      const { taskId } = params;
      const result = await makeClickUpCall("DELETE", `/api/v2/task/${taskId}`);
      return {
        success: true,
        message: "Task deleted successfully",
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