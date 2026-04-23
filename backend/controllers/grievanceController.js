const mongoose = require("mongoose");

const Grievance = require("../models/Grievance");
const asyncHandler = require("../middleware/asyncHandler");

const createGrievance = asyncHandler(async (req, res) => {
  const { title, description, category, status } = req.body;

  if (!title || !description || !category) {
    res.status(400);
    throw new Error("title, description and category are required");
  }

  const grievance = await Grievance.create({
    title,
    description,
    category,
    status,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: grievance,
  });
});

const getMyGrievances = asyncHandler(async (req, res) => {
  const grievances = await Grievance.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    data: grievances,
  });
});

const getGrievanceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid grievance id");
  }

  const grievance = await Grievance.findById(id);

  if (!grievance) {
    res.status(404);
    throw new Error("Grievance not found");
  }

  if (grievance.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Forbidden: grievance does not belong to this user");
  }

  res.status(200).json({
    success: true,
    data: grievance,
  });
});

const updateGrievance = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid grievance id");
  }

  const grievance = await Grievance.findById(id);

  if (!grievance) {
    res.status(404);
    throw new Error("Grievance not found");
  }

  if (grievance.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Forbidden: grievance does not belong to this user");
  }

  const updatedGrievance = await Grievance.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: updatedGrievance,
  });
});

const deleteGrievance = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid grievance id");
  }

  const grievance = await Grievance.findById(id);

  if (!grievance) {
    res.status(404);
    throw new Error("Grievance not found");
  }

  if (grievance.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Forbidden: grievance does not belong to this user");
  }

  await grievance.deleteOne();

  res.status(200).json({
    success: true,
    message: "Grievance deleted successfully",
  });
});

const searchMyGrievances = asyncHandler(async (req, res) => {
  const { title = "" } = req.query;

  const grievances = await Grievance.find({
    user: req.user._id,
    title: { $regex: title, $options: "i" },
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: grievances,
  });
});

module.exports = {
  createGrievance,
  getMyGrievances,
  getGrievanceById,
  updateGrievance,
  deleteGrievance,
  searchMyGrievances,
};
