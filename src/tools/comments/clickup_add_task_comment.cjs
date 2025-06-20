const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_add_task_comment",
  description: "Add a comment to a task",
  inputSchema: {
    type: "object",
    properties: {
      taskId: { type: "string", description: "Task ID" },
      commentText: { type: "string", description: "Comment text" },
      assignee: { type: "string", description: "User ID to assign" }
    },
    required: ["taskId", "commentText"]
  },
  async execute(params) {
    try {
      const { taskId, commentText, assignee } = params;
      const body = { comment_text: commentText };
      if (assignee) body.assignee = assignee;
      
      const result = await makeClickUpCall("POST", `/api/v2/task/${taskId}/comment`, body);
      return {
        success: true,
        message: "Comment added successfully",
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