import Farm from '../models/Farm.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = './uploads/farms';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File Filter
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, and PNG images are allowed!'));
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB Limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// Farm Controller
const farmController = {
  async createFarm(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { name, description, location, farmType, size } = req.body;
      if (!name || !description || !location || !farmType || !size) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if files are uploaded
      const imagePaths = req.files ? req.files.map(file => file.path) : [];

      const farm = await Farm.create({
        farmer: req.user.id,
        name,
        description,
        location,
        farmType,
        size,
        images: imagePaths
      });

      res.status(201).json(farm);
    } catch (error) {
      console.error("Error in createFarm:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async getMyFarms(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const farms = await Farm.find({ farmer: req.user.id });
      res.json(farms);
    } catch (error) {
      console.error("Error in getMyFarms:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async updateFarm(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const farm = await Farm.findById(req.params.id);
      if (!farm) {
        return res.status(404).json({ message: "Farm not found" });
      }
      if (farm.farmer.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to update this farm" });
      }

      const updatedFarm = await Farm.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json(updatedFarm);
    } catch (error) {
      console.error("Error in updateFarm:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};

export { upload };
export default farmController;
