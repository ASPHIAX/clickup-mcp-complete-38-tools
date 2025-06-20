const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_get_user_tasks",
  description: "Get tasks assigned to a specific user",
  inputSchema: {
    type: "object",
    properties: {
      workspaceId: { type: "string", description: "Workspace ID" },
      userId: { type: "string", description: "User ID to get tasks for" },
      include_closed: { type: "boolean", description: "Include closed tasks" }
    },
    required: ["workspaceId", "userId"]
  },
  async execute(params) {
    try {
      const { workspaceId, userId, include_closed } = params;
      const queryParams = [];
      if (include_closed) queryParams.push("include_closed=true");
      const query = queryParams.length > 0 ? "?" + queryParams.join("&") : "";
      
      const result = await makeClickUpCall("GET", `/api/v2/team/${workspaceId}/user/${userId}/task${query}`);
      return {
        success: true,
        workspaceId,
        userId,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        workspaceId: params.workspaceId,
        userId: params.userId
      };
    }
  }
};