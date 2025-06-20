const WebSocket = require('ws');
const allTools = require('./src/tools/index.cjs');

console.log('🚀 ClickUp MCP Server - Complete Modular Architecture');

// API Configuration (same as original)
const API_TOKEN = 'pk_176576029_TXOWRUE223QUH9Z0DFKOATV1K0HG2PLD';
const TEAM_ID = '90131227116';

// Crash prevention
process.on('uncaughtException', (err) => console.error('Uncaught:', err));
process.on('unhandledRejection', (err) => console.error('Unhandled:', err));

// API Call Function (same as original)
async function makeClickUpCall(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.clickup.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': API_TOKEN,
        'Content-Type': 'application/json'
      }
    };
    const req = require('https').request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } 
        catch (e) { resolve(data); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// WebSocket Server
const server = new WebSocket.Server({ port: 3000, host: '0.0.0.0' });
console.log('✅ Server listening on 0.0.0.0:3000');

server.on('connection', (ws) => {
  console.log('🔗 Client connected');
  
  ws.on('message', async (data) => {
    try {
      const msg = JSON.parse(data.toString());
      console.log('📨 Received:', msg.method || msg.type);
      
      // INITIALIZE
      if (msg.method === 'initialize') {
        ws.send(JSON.stringify({
          jsonrpc: '2.0',
          id: msg.id || 0,
          result: {
            protocolVersion: '2024-11-05',
            serverInfo: { 
              name: 'clickup-mcp-modular', 
              version: '2.0.0',
              description: `ClickUp MCP Server with ${allTools.length} Modular Tools`
            },
            capabilities: { 
              tools: { listChanged: true }
            }
          }
        }));
      }
      
      // TOOLS/LIST
      else if (msg.method === 'tools/list') {
        const toolsList = [
          { name: 'clickup_get_user', description: 'Get current user information', inputSchema: { type: 'object', properties: {}, required: [] } },
          { name: 'clickup_get_workspaces', description: 'Get all workspaces', inputSchema: { type: 'object', properties: {}, required: [] } },
          { name: 'clickup_get_spaces', description: 'Get spaces in workspace', inputSchema: { type: 'object', properties: { workspaceId: { type: 'string' } }, required: ['workspaceId'] } },
          { name: 'clickup_create_space', description: 'Create new space', inputSchema: { type: 'object', properties: { name: { type: 'string' }, workspaceId: { type: 'string' } }, required: ['name', 'workspaceId'] } },
          { name: 'clickup_create_task', description: 'Create new task', inputSchema: { type: 'object', properties: { name: { type: 'string' }, listId: { type: 'string' } }, required: ['name', 'listId'] } }
        ];
        
        // Add modular tools that aren't in the original 5
        allTools.forEach(tool => {
          if (!toolsList.find(t => t.name === tool.name)) {
            toolsList.push({
              name: tool.name,
              description: tool.description,
              inputSchema: tool.inputSchema
            });
          }
        });
        
        ws.send(JSON.stringify({
          jsonrpc: '2.0',
          id: msg.id || 0,
          result: { tools: toolsList }
        }));
      }
      
      // RESOURCES/LIST HANDLER (REQUIRED)
      else if (msg.method === 'resources/list') {
        ws.send(JSON.stringify({ 
          jsonrpc: '2.0', 
          id: msg.id, 
          result: { resources: [] } 
        }));
      }
      
      // PROMPTS/LIST HANDLER (REQUIRED)
      else if (msg.method === 'prompts/list') {
        ws.send(JSON.stringify({ 
          jsonrpc: '2.0', 
          id: msg.id, 
          result: { prompts: [] } 
        }));
      }
      
      // TOOLS/CALL HANDLER
      else if (msg.type === 'tools/call' || msg.method === 'tools/call') {
        const toolName = msg.params?.name;
        const params = msg.params?.arguments || {};
        console.log('🔧 Calling tool:', toolName);
        
        let result;
        try {
          // Try modular tools first
          const tool = allTools.find(t => t.name === toolName);
          if (tool) {
            console.log('🔧 Using modular tool:', toolName);
            result = await tool.execute(params);
          } else {
            // Fallback to original implementation
            switch(toolName) {
              case 'clickup_get_user':
                result = await makeClickUpCall('GET', '/api/v2/user');
                break;
              case 'clickup_get_workspaces':
                result = await makeClickUpCall('GET', '/api/v2/team');
                break;
              case 'clickup_get_spaces':
                result = await makeClickUpCall('GET', `/api/v2/team/${params.workspaceId}/space`);
                break;
              case 'clickup_create_space':
                result = await makeClickUpCall('POST', `/api/v2/team/${params.workspaceId}/space`, {
                  name: params.name,
                  multiple_assignees: true,
                  features: { due_dates: { enabled: true } }
                });
                break;
              case 'clickup_create_task':
                result = await makeClickUpCall('POST', `/api/v2/list/${params.listId}/task`, {
                  name: params.name,
                  description: params.description || '',
                  assignees: params.assignees || [],
                  status: params.status || 'to do'
                });
                break;
              default:
                throw new Error(`Unknown tool: ${toolName}`);
            }
          }
          
          // Format result for MCP if needed
          if (result && !result.content) {
            result = {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
            }
          }
          
          ws.send(JSON.stringify({
            jsonrpc: '2.0',
            id: msg.id,
            result: result
          }));
          
        } catch (error) {
          console.error('Tool error:', error.message);
          ws.send(JSON.stringify({
            jsonrpc: '2.0',
            id: msg.id,
            error: { code: -32603, message: error.message }
          }));
        }
      }
    } catch (e) {
      console.error('Message error:', e);
    }
  });
  
  ws.on('close', () => console.log('❌ Client disconnected'));
});

// Keep alive  
setInterval(() => {
  console.log('💓 Heartbeat -', new Date().toISOString());
}, 30000);

console.log(`🎯 Complete Modular ClickUp MCP Server Ready with ${allTools.length} tools!`);
