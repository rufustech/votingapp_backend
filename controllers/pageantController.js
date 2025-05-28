const Pageant = require("../models/PageantModel");
const slugify = require('slugify');


// Create a new pageant
exports.createPageant = async (req, res) => {
  const pageantSlug = slugify(name, { lower: true, strict: true });
  try {
    const { name, pageantId, startDate, endDate } = req.body;
    const pageantSlug = name.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

    const pageant = new Pageant({ name, pageantId, pageantSlug, startDate, endDate });
    await pageant.save();

    res.status(201).json(pageant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getPageantBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const pageant = await Pageant.findOne({ pageantSlug: slug });
    if (!pageant) {
      return res.status(404).json({ message: "Pageant not found" });
    }
    res.status(200).json(pageant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all pageants
exports.getAllPageants = async (req, res) => {
  try {
    const pageants = await Pageant.find().sort({ createdAt: -1 });
    res.status(200).json(pageants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single pageant by ID
exports.getPageantById = async (req, res) => {
  try {
    const pageant = await Pageant.findById(req.params.id);
    if (!pageant) {
      return res.status(404).json({ message: "Pageant not found" });
    }
    res.status(200).json(pageant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get ongoing pageants
exports.getOngoingPageants = async (req, res) => {
  try {
    const pageants = await Pageant.find({ status: "ongoing" });
    res.status(200).json(pageants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get past pageants
exports.getPastPageants = async (req, res) => {
  try {
    const pageants = await Pageant.find({ status: "past" });
    res.status(200).json(pageants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a pageant
exports.updatePageant = async (req, res) => {
  try {
    const { id } = req.params;
    const pageant = await Pageant.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!pageant) {
      return res.status(404).json({ message: "Pageant not found" });
    }
    res.status(200).json(pageant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update pageant status
exports.updatePageantStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const pageant = await Pageant.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!pageant) {
      return res.status(404).json({ message: "Pageant not found" });
    }
    res.status(200).json(pageant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a pageant
exports.deletePageant = async (req, res) => {
  try {
    const { id } = req.params;
    const pageant = await Pageant.findByIdAndDelete(id);
    if (!pageant) {
      return res.status(404).json({ message: "Pageant not found" });
    }
    res.status(200).json({ message: "Pageant deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
