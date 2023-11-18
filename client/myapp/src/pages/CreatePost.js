
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
const modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    ['link'],
    ['image'],
  ],
};

const formats = [
  'header',
  'font',
  'list',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'link',
  'image',
];

function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.append('file', file);

    try {
      const response = await fetch('http://localhost:4000/post', {
        method: 'POST',
        body: data,
        credentials:'include'
      });

      if (response.ok) {
        console.log('Post created successfully');
        navigate('/');
      } else {
        console.error('Failed to create the post');
        console.error('Status:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="summary">Summary:</label>
          <input
            type="text"
            className="form-control"
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="file">File Upload:</label>
          <input
            type="file"
            className="form-control-file"
            id="file"
            accept=".jpg, .jpeg, .png, .gif"
            onChange={handleFileChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <ReactQuill
            value={content}
            onChange={(newValue) => setContent(newValue)}
            modules={modules}
            formats={formats}
          />
        </div>

        <button style={{ width: '100%' }} type="submit" className="btn btn-primary">
          Create Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
