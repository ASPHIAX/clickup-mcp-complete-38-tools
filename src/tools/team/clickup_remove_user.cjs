const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_remove_user",
  description: "Remove a user from workspace",
  inputSchema: {
    type: "object",
    properties: {
      workspaceId: { type: "string", description: "Workspace ID" },
      userId: { type: "string", description: "User ID to remove" }
    },
    required: ["workspaceId", "userId"]
  },
  async execute(params) {
    try {
      const { workspaceId, userId } = params;
      const result = await makeClickUpCall("DELETE", `/api/v2/team/${workspaceId}/user/${userId}`);
      return {
        success: true,
        message: "User removed from workspace",
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