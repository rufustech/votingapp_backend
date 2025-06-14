const Pageant = require("../models/PageantModel");
const slugify = require("slugify"); // install if not already

exports.createPageant = async (req, res) => {
  try {
    const { name, pageantId, startDate, endDate, status } = req.body;

    if (!name || !pageantId || !startDate || !endDate) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    const pageantSlug = slugify(name, { lower: true, strict: true });

    const newPageant = await Pageant.create({
      name,
      pageantId,
      pageantSlug,
      startDate,
      endDate,
      status
    });

    res.status(201).json(newPageant);
  } catch (error) {
    console.error("Create pageant error:", error);
    res.status(500).json({ message: "Failed to create pageant.", error });
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
