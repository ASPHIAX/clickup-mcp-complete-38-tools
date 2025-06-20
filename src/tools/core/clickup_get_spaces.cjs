const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_get_spaces",
  description: "Get spaces in a workspace",
  inputSchema: {
    type: "object",
    properties: {
      workspaceId: {
        type: "string",
        description: "Workspace ID"
      }
    },
    required: ["workspaceId"]
  },
  async execute(params) {
    try {
      const { workspaceId } = params;
      const result = await makeClickUpCall("GET", `/api/v2/team/${workspaceId}/space`);
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      throw new Error(`Failed to get spaces: ${error.message}`);
    }
  }
};