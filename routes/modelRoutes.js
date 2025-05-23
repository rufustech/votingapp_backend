const express = require("express");
const router = express.Router();
const modelController = require("../controllers/modelController");

// Create
router.post("/", modelController.createModel);

// Read
router.get("/", modelController.getAllModels);
router.get("/top", modelController.getTopModels);
router.get("/pageant/:slug", modelController.getModelsByPageantSlug);
router.get("/pageant/:pageantId", modelController.getModelsByPageant);
router.get("/:id", modelController.getModelById);

// Update
router.put("/:id", modelController.updateModel);

// Delete
router.delete("/:id", modelController.deleteModel);

// Voting
router.post("/:id/vote", modelController.addVote);
router.post("/:id/add-votes", modelController.addPaidVotes);
router.post("/:id/reset-votes", modelController.resetVotes);

module.exports = router;
