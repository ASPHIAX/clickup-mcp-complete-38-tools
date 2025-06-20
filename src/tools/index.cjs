const fs = require('fs');
const path = require('path');

function loadToolsFromDirectory(dirPath) {
  const tools = [];
  
  function loadFromDir(currentPath) {
    if (!fs.existsSync(currentPath)) return;
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const itemPath = path.join(currentPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        loadFromDir(itemPath);
      } else if (item.endsWith('.cjs') && item !== 'index.cjs') {
        try {
          const tool = require(itemPath);
          if (tool.name && tool.description && tool.execute) {
            tools.push(tool);
            console.log(`✅ Loaded tool: ${tool.name}`);
          }
        } catch (error) {
          console.error(`❌ Failed to load tool ${itemPath}:`, error.message);
        }
      }
    }
  }
  
  loadFromDir(dirPath);
  return tools;
}

const allTools = loadToolsFromDirectory(__dirname);
console.log(`🛠️ Loaded ${allTools.length} ClickUp tools total!`);

module.exports = allTools;