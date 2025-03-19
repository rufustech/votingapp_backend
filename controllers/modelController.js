const Model = require("../models/Models");
const Pageant = require("../models/PageantModel");

// Create a new model
exports.createModel = async (req, res) => {
  try {
    const { name, bio, images, pageantId } = req.body;
    const pageant = await Pageant.findById(pageantId);
    if (!pageant) {
      return res.status(404).json({ message: "Pageant not found" });
    }
    const model = new Model({ name, bio, images, pageantId });
    await model.save();
    res.status(201).json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all models
exports.getAllModels = async (req, res) => {
  try {
    const models = await Model.find()
      .populate('pageantId')
      .sort({ createdAt: -1 });
    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single model by ID
exports.getModelById = async (req, res) => {
  try {
    const model = await Model.findById(req.params.id).populate('pageantId');
    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }
    res.status(200).json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get models by pageant
exports.getModelsByPageant = async (req, res) => {
  try {
    const { pageantId } = req.params;
    const models = await Model.find({ pageantId })
      .populate('pageantId')
      .sort({ votes: -1 });
    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update model
exports.updateModel = async (req, res) => {
  try {
    const { id } = req.params;
    const model = await Model.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('pageantId');
    
    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }
    res.status(200).json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete model
exports.deleteModel = async (req, res) => {
  try {
    const { id } = req.params;
    const model = await Model.findByIdAndDelete(id);
    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }
    res.status(200).json({ message: "Model deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add vote to model
exports.addVote = async (req, res) => {
  try {
    const { id } = req.params;
    const model = await Model.findByIdAndUpdate(
      id,
      { $inc: { votes: 1 } },
      { new: true }
    ).populate('pageantId');
    
    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }
    res.status(200).json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset model votes
exports.resetVotes = async (req, res) => {
  try {
    const { id } = req.params;
    const model = await Model.findByIdAndUpdate(
      id,
      { votes: 0 },
      { new: true }
    ).populate('pageantId');
    
    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }
    res.status(200).json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get top voted models
exports.getTopModels = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const models = await Model.find()
      .populate('pageantId')
      .sort({ votes: -1 })
      .limit(Number(limit));
    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
