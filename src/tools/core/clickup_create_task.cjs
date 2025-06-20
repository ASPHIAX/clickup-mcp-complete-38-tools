const { makeClickUpCall } = require('../../utils/clickup_api.cjs');

module.exports = {
  name: 'clickup_create_task',
  description: 'Create new task in a list',
  inputSchema: {
    type: 'object',
    properties: {
      listId: { type: 'string', description: 'List ID' },
      name: { type: 'string', description: 'Task name' },
      description: { type: 'string', description: 'Task description' }
    },
    required: ['listId', 'name']
  },
  async execute(params) {
    try {
      const { listId, name, description } = params;
      const body = { name };
      if (description) body.description = description;
      
      const result = await makeClickUpCall('POST', `/api/v2/list/${listId}/task`, body);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }
};