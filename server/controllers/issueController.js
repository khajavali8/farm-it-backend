import Issue from '../models/Issue.js';

const issueController = {
  async reportIssue(req, res) {
    try {
      const issue = await Issue.create({ ...req.body, user: req.user.id });
      res.status(201).json(issue);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async getAllIssues(req, res) {
    try {
      const issues = await Issue.find();
      res.json(issues);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
};

export default issueController;