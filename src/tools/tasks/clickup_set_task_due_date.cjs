const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_set_task_due_date",
  description: "Set due date for a task",
  inputSchema: {
    type: "object",
    properties: {
      taskId: { type: "string", description: "Task ID" },
      dueDate: { type: "string", description: "Due date in ISO format (YYYY-MM-DD) or Unix timestamp" },
      dueDateTime: { type: "string", description: "Due date with time in ISO format (YYYY-MM-DDTHH:mm:ssZ)" },
      clearDueDate: { type: "boolean", description: "Set to true to clear the due date" }
    },
    required: ["taskId"]
  },
  async execute(params) {
    try {
      const { taskId, dueDate, dueDateTime, clearDueDate } = params;
      let body = {};
      
      if (clearDueDate) {
        body.due_date = null;
      } else if (dueDateTime) {
        const timestamp = new Date(dueDateTime).getTime();
        body.due_date = timestamp;
        body.due_date_time = true;
      } else if (dueDate) {
        const timestamp = new Date(dueDate + "T23:59:59Z").getTime();
        body.due_date = timestamp;
        body.due_date_time = false;
      } else {
        return {
          success: false,
          error: "Must provide dueDate, dueDateTime, or set clearDueDate to true",
          taskId
        };
      }
      
      const result = await makeClickUpCall("PUT", `/api/v2/task/${taskId}`, body);
      
      return {
        success: true,
        message: clearDueDate ? "Due date cleared" : "Due date set successfully",
        taskId,
        dueDate: clearDueDate ? null : (dueDateTime || dueDate),
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