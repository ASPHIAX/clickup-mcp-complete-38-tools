const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_invite_user",
  description: "Invite a user to workspace",
  inputSchema: {
    type: "object",
    properties: {
      workspaceId: { type: "string", description: "Workspace ID" },
      email: { type: "string", description: "Email address to invite" },
      admin: { type: "boolean", description: "Grant admin permissions" }
    },
    required: ["workspaceId", "email"]
  },
  async execute(params) {
    try {
      const { workspaceId, email, admin } = params;
      const body = { email };
      if (admin !== undefined) body.admin = admin;
      
      const result = await makeClickUpCall("POST", `/api/v2/team/${workspaceId}/user`, body);
      return {
        success: true,
        message: "User invited successfully",
        workspaceId,
        email,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        workspaceId: params.workspaceId,
        email: params.email
      };
    }
  }
};