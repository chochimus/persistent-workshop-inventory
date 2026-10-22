import { 
  getAllTools, 
  createTool,
  getToolById 
} from "./toolController.js";

function handleGetAllTools(req, res) {
  const category = req.query.category;
  const availability = req.query.availability;

  try {
    let result = getAllTools(category, availability);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === 'BAD_AVAILABILITY_QUERY') {
      return res.status(400).json({error: 'Unknown availability parameter'}); 
    }
    return res.status(500).json({error: 'Server error'});
  }
}

async function handlePostTool(req, res) {
  const tool = req.body;

  try {
    const newTool = await createTool(tool);
    return res.status(201).json(newTool);
  } catch (error) {
    if (error.message === 'INVALID_TOOL') {
      return res.status(422).json({error: 'Malformed tool data'});
    }
    return res.status(500).json({error: 'Server error'})
  }
}

function handleGetToolById(req, res) {
  const id = req.params.id;
  try {
    const tool = getToolById(id);
    return res.status(200).json(tool);
  } catch (error) {
    if (error.message === 'TOOL_NOT_FOUND') {
      return res.status(404).json({error: 'Tool not found'});
    } else if (error.message === 'MALFORMED_ID') {
      return res.status(400).json({error: 'Malformed id'});
    }
    return res.status(500).json({error: 'Server error'});
  }
}

async function handleUpdateToolById(req, res) {
  const id = req.params.id;
  const tool = req.body;

  try {
    const updatedTool = await updateToolById(id, tool);
    return res.status(200).json(updatedTool);
  } catch (error) {
    if (error.message === 'MALFORMED_ID') {
      return res.status(400).json({error: 'Malformed id'});
    } else if (error.message === 'TOOL_NOT_FOUND') {
      return res.status(404).json({error: 'Tool not found'});
    } else if (error.message === 'INVALID_TOOL') {
      return res.status(422).json({error: 'Malformed tool data'});
    }
    return res.status(500).json({error: 'Server error'});
  }
}

async function handleDeleteToolById(req, res) {
  const id = req.params.id;

  try {
    await deleteTodoById(id);
    return res.status(204).end();
  } catch (error) {
    if (error.message === 'MALFORMED_ID') {
      return res.status(400).json({error: 'Malformed id'});
    } else if (error.message === 'TOOL_NOT_FOUND') {
      return res.status(404).json({error: 'Tool not found'});
    }
    return res.status(500).json({error: 'Server error'});
  }
}

export { 
  handleGetAllTools,
  handlePostTool,
  handleGetToolById,
  handleUpdateToolById,
  handleDeleteToolById
}