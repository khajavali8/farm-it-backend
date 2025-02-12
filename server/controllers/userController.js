import User from "../models/User.js";
import Farm from "../models/Farm.js";
import Loan from "../models/Loan.js";

const userController = {
    async getProfile(req, res) {
      try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    },
  
    async updateProfile(req, res) {
      try {
        const { firstName, lastName } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { firstName, lastName }, { new: true }).select('-password');
        res.json(user);
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    },
  
    async changePassword(req, res) {
      try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!(await bcrypt.compare(currentPassword, user.password))) {
          return res.status(400).json({ message: "Incorrect current password" });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: "Password updated successfully" });
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    },
  

  async getAllUsers(req, res) {
    try {
      const users = await User.find().select('-password');
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async verifyUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.isVerified = true;
      await user.save();

      res.status(200).json({ message: "User verified successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },


  async getAllLoans(req, res) {
    try {
      const loans = await Loan.find()
        .populate('farm', 'name location')
        .populate('investors.investor', 'name email');

      res.status(200).json(loans);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  async getAllFarms(req, res) {
    try {
      const farms = await Farm.find().populate('farmer', 'name email');
      res.status(200).json(farms);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};
  
  export default userController;