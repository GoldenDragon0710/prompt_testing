const db = require("../models");
const Prompt = db.prompt;

// Get all prompts
exports.get = async (req, res) => {
  try {
    const rows = await Prompt.findAll({
      order: [["name", "ASC"]],
    });
    return res.status(200).json({ data: rows });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Create and Save a new Prompt
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.prompt) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Prompt
  const prompt = {
    name: req.body.name,
    prompt: req.body.prompt,
  };

  try {
    const new_row = await Prompt.create(prompt);
    if (new_row) {
      const rows = await Prompt.findAll({
        order: [["name", "ASC"]],
      });
      return res.status(200).json({ data: rows });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update a Prompt by the id in the request
exports.update = async (req, res) => {
  const { id, prompt } = req.body;

  try {
    const updated_result = await Prompt.update(
      { prompt: prompt },
      {
        where: { id: id },
      }
    );
    if (updated_result == 1) {
      const rows = await Prompt.findAll({
        order: [["name", "ASC"]],
      });
      return res.status(200).json({ data: rows });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
