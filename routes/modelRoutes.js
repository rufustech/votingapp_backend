const express = require("express");
const router = express.Router();
const modelController = require("../controllers/modelController");
const { verifyInternalRequest } = require("../middleware/auth");

// Create
router.post("/", modelController.createModel);

// Read
router.get("/", modelController.getAllModels);
router.get("/top", modelController.getTopModels);
router.get(
  "/pageant/id/:pageantId",

  modelController.getModelsByPageant
);
router.get(
  "/pageant/slug/:slug",

  modelController.getModelsByPageantSlug
);
router.get("/:id", modelController.getModelById);

// Update
router.put("/:id", modelController.updateModel);

// Delete
router.delete("/:id", modelController.deleteModel);

// Voting
router.post("/:id/vote", modelController.addVote);
router.post(
  "/:id/add-votes",

  modelController.addPaidVotes
);
router.post(
  "/:id/reset-votes",

  modelController.resetVotes
);

module.exports = router;
