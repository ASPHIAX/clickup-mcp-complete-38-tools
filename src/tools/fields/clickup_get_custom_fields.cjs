const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_get_custom_fields",
  description: "Get custom fields for a list",
  inputSchema: {
    type: "object",
    properties: {
      listId: { type: "string", description: "List ID" }
    },
    required: ["listId"]
  },
  async execute(params) {
    try {
      const { listId } = params;
      const result = await makeClickUpCall("GET", `/api/v2/list/${listId}/field`);
      return {
        success: true,
        listId,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        listId: params.listId
      };
    }
  }
};