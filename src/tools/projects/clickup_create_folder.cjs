const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_create_folder",
  description: "Create a new folder in a space",
  inputSchema: {
    type: "object",
    properties: {
      spaceId: { type: "string", description: "Space ID where the folder will be created" },
      name: { type: "string", description: "Name of the folder" },
      hidden: { type: "boolean", description: "Whether the folder should be hidden" }
    },
    required: ["spaceId", "name"]
  },
  async execute(params) {
    try {
      const { spaceId, name, hidden } = params;
      const body = { name };
      if (hidden !== undefined) body.hidden = hidden;
      
      const result = await makeClickUpCall("POST", `/api/v2/space/${spaceId}/folder`, body);
      return {
        success: true,
        message: "Folder created successfully",
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