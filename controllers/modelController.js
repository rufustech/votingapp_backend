const Model = require("../models/Models");
const Pageant = require("../models/PageantModel");
const { cloudinary } = require("../utils/cloudinary");
const { incrementModelVotes } = require('../utils/voting');

const MAX_VOTES_PER_DAY = 4; 
const voteTracker = {}; 

// Get the user's real IP address, considering proxies
function getUserIP(req) {
    const forwarded = req.headers["x-forwarded-for"];
    return forwarded ? forwarded.split(",")[0].trim() : req.socket.remoteAddress;
}

// Reset votes if a new day starts
function resetVotesIfNeeded(ip) {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    if (!voteTracker[ip] || voteTracker[ip].lastReset !== today) {
        voteTracker[ip] = { count: 0, lastReset: today };
    }
}

// Create a new model
exports.addVote = async (req, res) => {
  try {
    const { id } = req.params;
    const ip = getUserIP(req);

    resetVotesIfNeeded(ip);

    if (voteTracker[ip].count >= MAX_VOTES_PER_DAY) {
      return res.status(403).json({ message: "Vote limit reached. Try again tomorrow." });
    }

    const model = await incrementModelVotes(id, 1);
    voteTracker[ip].count += 1;

    res.status(200).json({ model, votesLeft: MAX_VOTES_PER_DAY - voteTracker[ip].count });
  } catch (error) {
    console.error("Error adding vote:", error);
    res.status(500).json({ message: "An error occurred while voting." });
  }
};
// controllers/modelController.js
exports.createModel = async (req, res) => {
    try {
        const { name, bio, images, pageantId } = req.body;

        // Validate required fields
        if (!name || !bio || !images || !pageantId) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields" 
            });
        }

        // Validate images array
        if (!Array.isArray(images) || images.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "At least one image is required" 
            });
        }

        const pageant = await Pageant.findById(pageantId);
        if (!pageant) {
            return res.status(404).json({ 
                success: false, 
                message: "Pageant not found" 
            });
        }

        const model = new Model({
            name,
            bio,
            images,
            pageantId
        });

        await model.save();
        
        // Populate pageant info before sending response
        const populatedModel = await Model.findById(model._id).populate("pageantId");

        res.status(201).json({
            success: true,
            message: "Model created successfully",
            model: populatedModel
        });
    } catch (error) {
        console.error("Error creating model:", error);
        res.status(500).json({ 
            success: false, 
            message: "An error occurred while creating the model",
            error: error.message
        });
    }
};


// Get all models
exports.getAllModels = async (req, res) => {
    try {
        const models = await Model.find()
            .populate("pageantId")
            .sort({ createdAt: -1 });
        res.status(200).json(models);
    } catch (error) {
        console.error("Error fetching models:", error);
        res.status(500).json({ message: "An error occurred while fetching models." });
    }
};

exports.getModelsByPageantSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log("🔍 Received slug:", slug); // ← Debug log

    const pageant = await Pageant.findOne({ pageantSlug: slug });
    if (!pageant) {
      console.warn("⚠️ Pageant not found for slug:", slug);
      return res.status(404).json({ message: "Pageant not found" });
    }

    const models = await Model.find({ pageantId: pageant._id });
    console.log("✅ Found models:", models.length); // ← Log number of models

    res.status(200).json(models);
  } catch (error) {
    console.error("❌ Error in getModelsByPageantSlug:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get a single model by ID
exports.getModelById = async (req, res) => {
    try {
        const model = await Model.findById(req.params.id).populate("pageantId");
        if (!model) return res.status(404).json({ message: "Model not found" });

        res.status(200).json(model);
    } catch (error) {
        console.error("Error fetching model:", error);
        res.status(500).json({ message: "An error occurred while fetching the model." });
    }
};

// Get models by pageant ID
exports.getModelsByPageant = async (req, res) => {
  try {
    const { pageantId } = req.params;
    const models = await Model.find({ pageantId }).sort({ votes: -1 });
    res.status(200).json(models);
  } catch (error) {
    console.error("Error fetching models by pageant:", error);
    res.status(500).json({ message: "An error occurred while fetching models." });
  }
};


// Secure update model (prevents unwanted field updates)
exports.updateModel = async (req, res) => {
    try {
        const { id } = req.params;
        const allowedUpdates = ["name", "bio", "images", "pageantId"];
        const updates = Object.keys(req.body).filter(key => allowedUpdates.includes(key));

        if (updates.length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update." });
        }

        const updateData = {};
        updates.forEach(key => updateData[key] = req.body[key]);

        const model = await Model.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).populate("pageantId");

        if (!model) return res.status(404).json({ message: "Model not found" });

        res.status(200).json(model);
    } catch (error) {
        console.error("Error updating model:", error);
        res.status(500).json({ message: "An error occurred while updating the model." });
    }
};

// Delete model
// controllers/modelController.js
exports.deleteModel = async (req, res) => {
    try {
        const { id } = req.params;
        const model = await Model.findById(id);

        if (!model) {
            return res.status(404).json({ message: "Model not found" });
        }

        // Delete images from Cloudinary
        if (model.images && model.images.length > 0) {
            for (const imageUrl of model.images) {
                const publicId = imageUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`models/${publicId}`);
            }
        }

        await Model.findByIdAndDelete(id);

        res.status(200).json({ 
            success: true,
            message: "Model and associated images deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting model:", error);
        res.status(500).json({ 
            success: false,
            message: "An error occurred while deleting the model",
            error: error.message
        });
    }
};

// Add paid votes to a model
// controllers/modelController.js
exports.addPaidVotes = async (req, res) => {
  const { id } = req.params;
  const { votes } = req.body;

  if (!votes || isNaN(votes)) {
    return res.status(400).json({ message: "Invalid number of votes" });
  }

  try {
    const model = await Model.findByIdAndUpdate(
      id,
      { $inc: { votes: parseInt(votes, 10) } },
      { new: true }
    );

    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }

    res.status(200).json({ message: "Votes updated", model });
  } catch (error) {
    console.error("❌ Error updating votes:", error.message);
    res.status(500).json({ message: "Failed to update votes" });
  }
};




// Add vote to model with IP tracking
// exports.addVote = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const ip = getUserIP(req);

//         resetVotesIfNeeded(ip);

//         if (voteTracker[ip].count >= MAX_VOTES_PER_DAY) {
//             return res.status(403).json({ message: "Vote limit reached. Try again tomorrow." });
//         }

//         const model = await Model.findByIdAndUpdate(
//             id,
//             { $inc: { votes: 1 } },
//             { new: true }
//         ).populate("pageantId");

//         if (!model) return res.status(404).json({ message: "Model not found" });

//         voteTracker[ip].count += 1;

//         res.status(200).json({ model, votesLeft: MAX_VOTES_PER_DAY - voteTracker[ip].count });
//     } catch (error) {
//         console.error("Error adding vote:", error);
//         res.status(500).json({ message: "An error occurred while voting." });
//     }
// };

// Reset model votes
exports.resetVotes = async (req, res) => {
    try {
        const { id } = req.params;
        const model = await Model.findByIdAndUpdate(id, { votes: 0 }, { new: true }).populate("pageantId");

        if (!model) return res.status(404).json({ message: "Model not found" });

        res.status(200).json(model);
    } catch (error) {
        console.error("Error resetting votes:", error);
        res.status(500).json({ message: "An error occurred while resetting votes." });
    }
};

// Get top voted models
exports.getTopModels = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const models = await Model.find()
            .populate("pageantId")
            .sort({ votes: -1 })
            .limit(Number(limit));

        res.status(200).json(models);
    } catch (error) {
        console.error("Error fetching top models:", error);
        res.status(500).json({ message: "An error occurred while fetching top models." });
    }
};

exports.getVotesData = (req, res) => {
    const votesData = JSON.parse(localStorage.getItem("voteData")) || { votes: 0 };
    res.status(200).json(votesData);
}