import Farm from '../models/Farm.js';

const farmController = {
  async createFarm(req, res) {
    try {
      const farm = await Farm.create({ ...req.body, farmer: req.user.id });
      res.status(201).json(farm);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async getMyFarms(req, res) {
    try {
      const farms = await Farm.find({ farmer: req.user.id });
      res.json(farms);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async updateFarm(req, res) {
    try {
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
      res.status(500).json({ message: "Server error" });
    }
  }
};

export default farmController;