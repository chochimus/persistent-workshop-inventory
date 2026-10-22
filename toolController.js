import { 
  addTool, 
  getTools, 
  getTool,
  updateTool,
} from './toolData.js';



function getAllTools(category, availability) {
  let tools = getTools();

  if (availability!== undefined && !['true', 'false'].includes(availability)) {
    throw new Error('BAD_AVAILABILITY_QUERY');
  }

  if (typeof category === 'string') {
    tools = tools.filter(tool => tool.category === category);
  }
  if (availability === 'true' || availability === 'false') {
    tools = tools.filter(tool => tool.availability === (availability === 'true'));
  }

  return tools;
} 

async function createTool(tool) {
  if (!isValidToolPost(tool)) {
    throw new Error('INVALID_TOOL');
  }

  return await addTool(tool);
}

function getToolById(id) {
  if (!isValidId(id)) {
    throw new Error('MALFORMED_ID');
  }
  const tool = getTool(Number(id));

  if (!tool) {
    throw new Error('TOOL_NOT_FOUND');
  }

  return tool;
}

async function updateToolById(id, updateData) {
  if (!isValidId(id)) {
    throw new Error('MALFORMED_ID');
  }

  if (!isValidToolUpdate(updateData)) {
    throw new Error('INVALID_TOOL');
  }

  let result = await updateTool(Number(id), updateData);

  if (!result) {
    throw new Error('TOOL_NOT_FOUND');
  }

  return result;
}

async function deleteToolById(id) {
  if (!isValidId(id)) {
    throw new Error('MALFORMED_ID');
  }

  let deleted = await deleteTool(Number(id));

  if (!deleted) {
    throw new Error('TOOL_NOT_FOUND');
  }
}

function isValidId(id) {
  return /^\d+$/.test(id) && Number(id) > 0;
}

function isValidObject(data) {
  return data !== null && typeof data === 'object' && !Array.isArray(data);
}

function isValidToolPost(data) {
  return isValidObject(data) && Object.entries(data).length === 4 && isValidTool(data);
}

function isValidToolUpdate(data) {
  return isValidObject(data) && Object.entries(data).length >= 1 && isValidTool(data);
}

function isValidTool(data) {
  const validToolProperties = ['name', 'category', 'condition', 'availability'];

  const entries = Object.entries(data);

  for (let [property, value] of entries) {
    if (!validToolProperties.includes(property)) {
      return false;
    } 
    switch (property) {
      case 'name':
        if (typeof value !== 'string' || value.trim().length === 0 || value.trim().length > 50) {
          return false;
        }
        break;
      case 'category':
        if (typeof value !== 'string' || value.trim().length === 0 || value.trim().length > 50) {
          return false;
        }
        break;
      case 'condition':
        if (!['new', 'good', 'fair', 'poor'].includes(value)) {
          return false;
        }
        break;
      case 'availability':
        if (typeof value !== 'boolean') {
          return false;
        }
        break;
    }
  }
  return true;
}

export {
  getAllTools,
  createTool,
  getToolById,
  updateToolById
}