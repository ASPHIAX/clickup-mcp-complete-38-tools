const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_get_folders",
  description: "Get folders in a space",
  inputSchema: {
    type: "object",
    properties: {
      spaceId: { type: "string", description: "Space ID" },
      archived: { type: "boolean", description: "Include archived folders" }
    },
    required: ["spaceId"]
  },
  async execute(params) {
    try {
      const { spaceId, archived } = params;
      const queryParams = [];
      if (archived) queryParams.push("archived=true");
      const query = queryParams.length > 0 ? "?" + queryParams.join("&") : "";
      
      const result = await makeClickUpCall("GET", `/api/v2/space/${spaceId}/folder${query}`);
      return {
        success: true,
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