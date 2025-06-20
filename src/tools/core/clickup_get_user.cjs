const { makeClickUpCall } = require('../../utils/clickup_api.cjs');

module.exports = {
  name: 'clickup_get_user',
  description: 'Get current user info',
  inputSchema: {
    type: 'object',
    properties: {},
    required: []
  },
  async execute(params) {
    try {
      const result = await makeClickUpCall('GET', '/api/v2/user');
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
      };
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }
};