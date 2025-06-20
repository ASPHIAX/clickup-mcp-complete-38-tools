const { makeClickUpCall } = require("../../utils/clickup_api.cjs");

module.exports = {
  name: "clickup_set_task_priority",
  description: "Set priority for a task",
  inputSchema: {
    type: "object",
    properties: {
      taskId: { type: "string", description: "Task ID" },
      priority: { 
        type: "number", 
        description: "Priority level: 1=Urgent, 2=High, 3=Normal, 4=Low",
        enum: [1, 2, 3, 4]
      }
    },
    required: ["taskId", "priority"]
  },
  async execute(params) {
    try {
      const { taskId } = params;
      let { priority } = params;
      
      priority = parseInt(priority);
      if (![1, 2, 3, 4].includes(priority)) {
        throw new Error("Invalid priority: " + params.priority + ". Must be 1, 2, 3, or 4");
      }
      
      const body = { priority: priority };
      const result = await makeClickUpCall("PUT", "/api/v2/task/" + taskId, body);
      
      const priorityNames = { 1: "urgent", 2: "high", 3: "normal", 4: "low" };
      return {
        success: true,
        message: "Task priority set to " + priorityNames[priority],
        taskId,
        priority: priority,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        taskId: params.taskId,
        priority: params.priority
      };
    }
  }
};