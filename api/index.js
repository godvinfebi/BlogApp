
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user');
const Post = require('./models/post');
const port = 4000;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = 'your-secret-key'; // Change this to your actual secret key
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

const fs = require('fs');
const { json } = require('body-parser');
const url =
  'mongodb+srv://godvinfebi2002:godvin123@cluster0.uvm3oyv.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(url);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(req.body);

    const hashedPassword = bcrypt.hashSync(password, 10);
    const userDoc = await User.create({
      username,
      password: hashedPassword,
    });

    res.json({ message: 'Registration successful', user: userDoc });
  } catch (error) {
    console.error('Error during registration:', error);
    res
      .status(500)
      .json({ message: 'Registration failed', error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const userDoc = await User.findOne({ username });

    if (!userDoc) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (passOk) {
      jwt.sign({ username, id: userDoc._id }, secret, (err, token) => {
        if (err) {
          console.error('Error signing JWT:', err);
          res.status(500).json({ message: 'Login failed' });
        } else {
          res.cookie('token', token).json({
            id: userDoc._id,
            username,
          });
        }
      });
    } else {
      res.status(401).json({ message: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: 'JWT token must be provided' });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      console.error('Error verifying JWT:', err);
      return res.status(401).json({ message: 'JWT verification failed' });
    }
    res.json(info);
    console.log(info);
  });
});

app.post('/logout', (req, res) => {
  res.clearCookie('token').json('Logged out');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { originalname } = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = `uploads/${req.file.filename}.${ext}`;
  fs.renameSync(req.file.path, newPath);
  // res.json({ file: req.file });
  const { token } = req.cookies
  jwt.verify(token, secret, {},async (err, info) => {
    if (err) {
      console.error('Error verifying JWT:', err);
      return res.status(401).json({ message: 'JWT verification failed' });
    }
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author:info.id
    });
  res.json(postDoc);
  })
  
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = `uploads/${req.file.filename}.${ext}`;
    fs.renameSync(req.file.path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      console.error('Error verifying JWT:', err);
      return res.status(401).json({ message: 'JWT verification failed' });
    }

    const { id, title, summary, content } = req.body;

    try {
      const existingPost = await Post.findById(id);

      if (!existingPost) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const isAuthor = existingPost.author.equals(info.id);

      if (!isAuthor) {
        return res.status(400).json('You are not the author');
      }

      const updatedFields = {
        title,
        summary,
        content,
      };

      if (newPath) {
        updatedFields.cover = newPath;
      }

      await existingPost.updateOne(updatedFields);

      const updatedPost = await Post.findById(id);
      res.json(updatedPost);
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ message: 'Failed to update post', error: error.message });
    }
  });
});

app.get('/post', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(20)
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
});
app.get('/post/:id',async (req,res)=>{
  const {id}= req.params
  const postDoc = await Post.findById(id).populate('author',['username'])
  res.json(postDoc)
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
