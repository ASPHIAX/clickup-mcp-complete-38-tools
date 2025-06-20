const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_get_folder",
  description: "Get details of a specific folder",
  inputSchema: {
    type: "object",
    properties: {
      folderId: { type: "string", description: "Folder ID to retrieve" }
    },
    required: ["folderId"]
  },
  async execute(params) {
    try {
      const { folderId } = params;
      const result = await makeClickUpCall("GET", `/api/v2/folder/${folderId}`);
      return {
        success: true,
        folderId,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        folderId: params.folderId
      };
    }
  }
};