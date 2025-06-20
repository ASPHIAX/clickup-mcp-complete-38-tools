const { makeClickUpCall } = require('../../utils/clickup_api.cjs');

module.exports = {
  name: 'clickup_get_workspaces',
  description: 'Get all workspaces for current user', 
  inputSchema: {
    type: 'object',
    properties: {},
    required: []
  },
  async execute(params) {
    try {
      const result = await makeClickUpCall('GET', '/api/v2/team');
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(result.teams || [], null, 2)
        }]
      };
    } catch (error) {
      throw new Error(`Failed to get workspaces: ${error.message}`);
    }
  }
};