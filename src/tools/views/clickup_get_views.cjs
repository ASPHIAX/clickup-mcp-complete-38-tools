const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_get_views",
  description: "Get views for a space/folder/list",
  inputSchema: {
    type: "object",
    properties: {
      spaceId: { type: "string", description: "Space ID" },
      folderId: { type: "string", description: "Folder ID" },
      listId: { type: "string", description: "List ID" }
    },
    required: []
  },
  async execute(params) {
    try {
      const { spaceId, folderId, listId } = params;
      
      let endpoint;
      if (listId) {
        endpoint = `/api/v2/list/${listId}/view`;
      } else if (folderId) {
        endpoint = `/api/v2/folder/${folderId}/view`;
      } else if (spaceId) {
        endpoint = `/api/v2/space/${spaceId}/view`;
      } else {
        throw new Error("Either spaceId, folderId, or listId must be provided");
      }
      
      const result = await makeClickUpCall("GET", endpoint);
      return {
        success: true,
        spaceId,
        folderId,
        listId,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        spaceId: params.spaceId,
        folderId: params.folderId,
        listId: params.listId
      };
    }
  }
};