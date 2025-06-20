const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_add_task_assignee",
  description: "Add an assignee to a task",
  inputSchema: {
    type: "object",
    properties: {
      taskId: { type: "string", description: "Task ID" },
      assigneeId: { type: "string", description: "User ID to assign to the task" }
    },
    required: ["taskId", "assigneeId"]
  },
  async execute(params) {
    try {
      const { taskId, assigneeId } = params;
      const body = {
        assignees: {
          add: [assigneeId]
        }
      };
      
      const result = await makeClickUpCall("PUT", `/api/v2/task/${taskId}`, body);
      return {
        success: true,
        message: "Assignee added to task successfully",
        taskId,
        assigneeId,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        taskId: params.taskId,
        assigneeId: params.assigneeId
      };
    }
  }
};