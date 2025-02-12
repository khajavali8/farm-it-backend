import Document from '../models/Document.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: './uploads/documents', 
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|pdf|doc|docx/; 
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, PDF, DOC, and DOCX are allowed.'));
  }
}


const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('document'); // Ensure the form field name is 'document'

const documentController = {
  async uploadDocument(req, res) {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        const { title, type, relatedToModel, relatedToId } = req.body;

        if (!title || !type) {
          return res.status(400).json({ message: "Title and Type are required" });
        }

        const document = await Document.create({
          title,
          type,
          filePath: req.file.path,
          owner: req.user.id,
          relatedTo: relatedToModel && relatedToId ? { model: relatedToModel, id: relatedToId } : undefined,
        });

        res.status(201).json({ message: "File uploaded successfully", document });

      } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
      }
    });
  },

  async getMyDocuments(req, res) {
    try {
      const documents = await Document.find({ owner: req.user.id });
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
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
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};

export default documentController;
