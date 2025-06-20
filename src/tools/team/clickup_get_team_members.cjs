const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_get_team_members",
  description: "Get team members in a workspace",
  inputSchema: {
    type: "object",
    properties: {
      workspaceId: { type: "string", description: "Workspace ID" }
    },
    required: ["workspaceId"]
  },
  async execute(params) {
    try {
      const { workspaceId } = params;
      const result = await makeClickUpCall("GET", `/api/v2/team/${workspaceId}`);
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