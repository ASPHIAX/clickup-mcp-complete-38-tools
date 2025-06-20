const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_set_custom_field",
  description: "Set value for a custom field on a task",
  inputSchema: {
    type: "object",
    properties: {
      taskId: { type: "string", description: "Task ID" },
      fieldId: { type: "string", description: "Custom field ID" },
      value: { type: "string", description: "Field value" }
    },
    required: ["taskId", "fieldId", "value"]
  },
  async execute(params) {
    try {
      const { taskId, fieldId, value } = params;
      const body = { value };
      
      const result = await makeClickUpCall("POST", `/api/v2/task/${taskId}/field/${fieldId}`, body);
      return {
        success: true,
        message: "Custom field updated successfully",
        taskId,
        fieldId,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        taskId: params.taskId,
        fieldId: params.fieldId
      };
    }
  }
};