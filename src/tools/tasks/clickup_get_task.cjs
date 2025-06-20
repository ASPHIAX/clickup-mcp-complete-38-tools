const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_get_task",
  description: "Get detailed information about a specific task",
  inputSchema: {
    type: "object",
    properties: {
      taskId: { type: "string", description: "Task ID to retrieve" },
      includeSubtasks: { type: "boolean", description: "Include subtasks in response" },
      includeMarkdownDescription: { type: "boolean", description: "Include markdown description" }
    },
    required: ["taskId"]
  },
  async execute(params) {
    try {
      const { taskId, includeSubtasks, includeMarkdownDescription } = params;
      const queryParams = [];
      if (includeSubtasks) queryParams.push("include_subtasks=true");
      if (includeMarkdownDescription) queryParams.push("include_markdown_description=true");
      const query = queryParams.length > 0 ? "?" + queryParams.join("&") : "";
      
      const result = await makeClickUpCall("GET", `/api/v2/task/${taskId}${query}`);
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