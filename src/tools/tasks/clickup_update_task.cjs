const { makeClickUpCall } = require('../../utils/clickup_api.cjs');

module.exports = {
  name: 'clickup_update_task',
  description: 'Update an existing task',
  inputSchema: {
    type: 'object',
    properties: {
      taskId: { type: 'string', description: 'Task ID' },
      name: { type: 'string', description: 'New task name' },
      description: { type: 'string', description: 'New task description' },
      status: { type: 'string', description: 'Task status' }
    },
    required: ['taskId']
  },
  async execute(params) {
    try {
      const { taskId, name, description, status } = params;
      const body = {};
      if (name) body.name = name;
      if (description) body.description = description;
      if (status) body.status = status;
      
      const result = await makeClickUpCall('PUT', `/api/v2/task/${taskId}`, body);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }
  }
};