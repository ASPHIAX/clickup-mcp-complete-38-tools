const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_create_list",
  description: "Create a new list in a folder or space",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Name of the list" },
      folderId: { type: "string", description: "Folder ID (required if spaceId not provided)" },
      spaceId: { type: "string", description: "Space ID (required if folderId not provided - creates folderless list)" },
      content: { type: "string", description: "Description of the list" },
      dueDate: { type: "string", description: "Due date for the list in Unix timestamp" },
      priority: { type: "number", description: "Priority: 1=Urgent, 2=High, 3=Normal, 4=Low" },
      assigneeId: { type: "string", description: "User ID to assign to the list" },
      status: { type: "string", description: "Status of the list" }
    },
    required: ["name"]
  },
  async execute(params) {
    try {
      const { name, folderId, spaceId, content, dueDate, priority, assigneeId, status } = params;
      
      if (!folderId && !spaceId) {
        throw new Error("Either folderId or spaceId must be provided");
      }
      
      const body = { name };
      if (content) body.content = content;
      if (dueDate) body.due_date = dueDate;
      if (priority) body.priority = priority;
      if (assigneeId) body.assignee = assigneeId;
      if (status) body.status = status;
      
      const endpoint = folderId 
        ? `/api/v2/folder/${folderId}/list`
        : `/api/v2/space/${spaceId}/list`;
      
      const result = await makeClickUpCall("POST", endpoint, body);
      return {
        success: true,
        message: "List created successfully",
        folderId,
        spaceId,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        folderId: params.folderId,
        spaceId: params.spaceId
      };
    }
  }
};