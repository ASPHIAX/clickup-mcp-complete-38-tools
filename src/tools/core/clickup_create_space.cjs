const { makeClickUpCall } = require('../../utils/clickup_api.cjs');

module.exports = {
  name: 'clickup_create_space',
  description: 'Create new space',
  inputSchema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Space name' },
      workspaceId: { type: 'string', description: 'Workspace ID' }
    },
    required: ['name', 'workspaceId']
  },
  async execute(params) {
    try {
      const { name, workspaceId } = params;
      const body = { name };
      
      const result = await makeClickUpCall('POST', `/api/v2/team/${workspaceId}/space`, body);
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      throw new Error(`Failed to create space: ${error.message}`);
    }
  }
};