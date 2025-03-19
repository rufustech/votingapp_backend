const express = require("express");
const router = express.Router();
const modelController = require("../controllers/modelController");

// Create a new model
router.post("/", modelController.createModel);

// Get all models
router.get("/", modelController.getAllModels);

// Get a single model by ID
router.get("/:id", modelController.getModelById);

// Get models by pageant
router.get("/pageant/:pageantId", modelController.getModelsByPageant);

// Update model
router.put("/:id", modelController.updateModel);

// Delete model
router.delete("/:id", modelController.deleteModel);

// Add vote to model
router.post("/:id/vote", modelController.addVote);

// Reset model votes
router.post("/:id/reset-votes", modelController.resetVotes);

// Get top voted models
router.get("/top", modelController.getTopModels);

module.exports = router;
