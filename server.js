import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from public (ads, icons, etc)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGODB_URI not found. Please set it in your environment variables for production.');
}

// Schemas
const postSchema = new mongoose.Schema({
  title: String,
  category: String,
  date: String,
  content: String,
  published: Boolean,
  image: String,
  slug: { type: String, unique: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  readTime: { type: Number, default: 0 },
  reviews: [{
    id: String,
    author: String,
    comment: String,
    date: String
  }]
}, { timestamps: true });

const adSchema = new mongoose.Schema({
  image: String,
  link: String
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
const Ad = mongoose.model('Ad', adSchema);

// Set up image upload using Multer
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'public', 'uploads');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (err) {
      cb(err, uploadPath);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// GET all ads
app.get('/api/ads', async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

// POST new ad
app.post('/api/ads', async (req, res) => {
  try {
    const newAd = new Ad(req.body);
    await newAd.save();
    res.status(201).json(newAd);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

// DELETE ad
app.delete('/api/ads/:id', async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

// GET all posts
app.get('/api/posts', async (req, res) => {
  try {
    const isAdmin = req.query.admin === 'true';
    const query = isAdmin ? {} : { published: true };
    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read posts' });
  }
});

// GET single post
app.get('/api/posts/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

// POST new post
app.post('/api/posts', async (req, res) => {
  try {
    const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newPost = new Post({
      ...req.body,
      slug,
      image: req.body.image || "https://images.unsplash.com/photo-1596434444211-38290263625f?auto=format&fit=crop&q=80&w=800"
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// PUT update post
app.put('/api/posts/:id', async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Engagement Endpoints
app.post('/api/posts/:id/view', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    res.json({ views: post.views });
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.post('/api/posts/:id/like', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.post('/api/posts/:id/unlike', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { $inc: { likes: -1 } }, { new: true });
    res.json({ likes: post.likes });
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.post('/api/posts/:id/review', async (req, res) => {
  try {
    const { author, comment } = req.body;
    const review = {
      id: uuidv4(),
      author: author || 'Anonymous',
      comment,
      date: new Date().toISOString()
    };
    await Post.findByIdAndUpdate(
      req.params.id, 
      { $push: { reviews: review } }, 
      { new: true }
    );
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: 'Failed' });
  }
});

// PROD: Serve built frontend
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// For any route that isn't an API route, serve index.html (SPA support)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
