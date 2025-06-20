const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_create_view",
  description: "Create a new view",
  inputSchema: {
    type: "object",
    properties: {
      spaceId: { type: "string", description: "Space ID" },
      name: { type: "string", description: "View name" },
      type: { type: "string", description: "View type (list, board, calendar, etc.)" }
    },
    required: ["spaceId", "name", "type"]
  },
  async execute(params) {
    try {
      const { spaceId, name, type } = params;
      const body = { name, type };
      
      const result = await makeClickUpCall("POST", `/api/v2/space/${spaceId}/view`, body);
      return {
        success: true,
        message: "View created successfully",
        spaceId,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        spaceId: params.spaceId
      };
    }
  }
};