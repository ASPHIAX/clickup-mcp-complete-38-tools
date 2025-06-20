const { makeClickUpCall } = require('../../utils/clickup_api.cjs');

module.exports = {
  name: 'clickup_get_tasks',
  description: 'Get tasks from a list',
  inputSchema: {
    type: 'object',
    properties: {
      listId: { type: 'string', description: 'List ID' },
      archived: { type: 'boolean', description: 'Include archived tasks' },
      include_closed: { type: 'boolean', description: 'Include closed tasks' }
    },
    required: ['listId']
  },
  async execute(params) {
    try {
      const { listId, archived = false, include_closed = false } = params;
      let query = `?archived=${archived}&include_closed=${include_closed}`;
      
      const result = await makeClickUpCall('GET', `/api/v2/list/${listId}/task${query}`);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      throw new Error(`Failed to get tasks: ${error.message}`);
    }
  }
};