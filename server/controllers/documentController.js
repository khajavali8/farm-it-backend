import Document from '../models/Document.js';

const documentController = {
  async uploadDocument(req, res) {
    try {
      const document = await Document.create({ ...req.body, owner: req.user.id });
      res.status(201).json(document);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async getMyDocuments(req, res) {
    try {
      const documents = await Document.find({ owner: req.user.id });
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async deleteDocument(req, res) {
    try {
      const document = await Document.findByIdAndDelete(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
}; 

export default documentController;