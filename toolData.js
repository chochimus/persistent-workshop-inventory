import fs from 'node:fs/promises';
import path from 'node:path';

let tools = [];
const fullPath = path.join(import.meta.dirname, 'toolsData.json');

async function getInitialToolData() {
  try {
    const data = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(fullPath, JSON.stringify({tools: []}));
      return {tools: []};
    }
    throw error;
  }
}

export async function initializeTools() {
  const data = await getInitialToolData();
  tools = data.tools;
}

export function getTools() {
  return tools;
}

export async function addTool(tool) {
  let id = tools.length === 0 ? 1 : Math.max(...tools.map(tool => tool.id)) + 1;
  
  const newTool = {
    id, 
    name: tool.name, 
    category: tool.category, 
    condition: tool.condition, 
    availability: 
    tool.availability};

  const updatedTools = [...tools, newTool]
  await fs.writeFile(fullPath, JSON.stringify({tools: updatedTools}));
  tools = updatedTools;
  return newTool;
}

export function getTool(id) {
  return tools.find(tool => tool.id === id);
}

export async function updateTool(id, data) {
  let toolIndex = tools.findIndex(tool => tool.id === id);

  if (toolIndex === -1) {
    return null;
  }

  const updatedTool = {...tools[toolIndex], ...data};
  const updatedTools = [...tools];
  
  updatedTools[toolIndex] = updatedTool;
  await fs.writeFile(fullPath, JSON.stringify({tools: updatedTools}));
  tools = updatedTool;

  return updatedTool;
}

export async function deleteTool(id) {
  let toolToDelete = tools.find(tool => tool.id === id);

  if (!toolToDelete) {
    return false;
  }

  const updatedTools = tools.filter(tool => tool !== toolToDelete);
  await fs.writeFile(fullPath, JSON.stringify({tools: updatedTools}));
  tools = updatedTools;

  return true;
}