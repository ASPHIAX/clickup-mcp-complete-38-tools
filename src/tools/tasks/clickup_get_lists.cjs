const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_get_lists",
  description: "Get lists in a space",
  inputSchema: {
    type: "object",
    properties: {
      spaceId: {
        type: "string",
        description: "Space ID"
      }
    },
    required: ["spaceId"]
  },
  async execute(params) {
    try {
      const { spaceId } = params;
      const result = await makeClickUpCall("GET", `/api/v2/space/${spaceId}/list`);
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2)
        }]
      };
    } catch (error) {
      throw new Error(`Failed to get lists: ${error.message}`);
    }
  }
};