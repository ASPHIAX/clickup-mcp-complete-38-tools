const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_get_goals",
  description: "Get goals in workspace",
  inputSchema: {
    type: "object",
    properties: {
      workspaceId: { type: "string", description: "Workspace ID" },
      include_completed: { type: "boolean", description: "Include completed goals" }
    },
    required: ["workspaceId"]
  },
  async execute(params) {
    try {
      const { workspaceId, include_completed } = params;
      const queryParams = [];
      if (include_completed) queryParams.push("include_completed=true");
      const query = queryParams.length > 0 ? "?" + queryParams.join("&") : "";
      
      const result = await makeClickUpCall("GET", `/api/v2/team/${workspaceId}/goal${query}`);
      return {
        success: true,
        workspaceId,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        workspaceId: params.workspaceId
      };
    }
  }
};