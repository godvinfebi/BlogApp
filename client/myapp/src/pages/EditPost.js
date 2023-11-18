// import React, { useEffect, useState } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { useNavigate, useParams } from 'react-router-dom';

// function EditPost() {
//     const {id} =useParams('');
//   const [title, setTitle] = useState('');
//   const [summary, setSummary] = useState('');
//   const [file, setFile] = useState(null);
//   const [content, setContent] = useState('');
//   const navigate = useNavigate();

//   useEffect(()=>{
//     fetch('http://localhost:4000/post/'+id)
//     .then(response =>{
//         response.json().then(postInfo =>{
//             setTitle(postInfo.title);
//             setContent(postInfo.content);
//             setSummary(postInfo.summary)
//         })
//     })
//   })
//   const handleTitleChange = (e) => {
//     setTitle(e.target.value);
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files;
//     setFile(selectedFile);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
// const data = new FormData();
// data.set('title', title);
// data.set('summary', summary);
// data.set('content', content);
// data.set('id', id);
// if(file?.[0]){
//     data.set('file',file?.[0]);
// }
// const response = await fetch('http://localhost:4000/post',{
//     method:'PUT',
//     body:data,
//     credentials:'include'
// })
// if(response.ok){
//     navigate('/');
// }
//     console.log('Post created successfully');
//  };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="title">Title:</label>
//           <input
//             type="text"
//             className="form-control"
//             id="title"
//             value={title}
//             onChange={handleTitleChange}
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="summary">Summary:</label>
//           <input
//             type="text"
//             className="form-control"
//             id="summary"
//             value={summary}
//             onChange={(e) => setSummary(e.target.value)}
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="file">File Upload:</label>
//           <input
//             type="file"
//             className="form-control-file"
//             id="file"
//             accept=".jpg, .jpeg, .png, .gif"
//             onChange={handleFileChange}
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="content">Content:</label>
//           <ReactQuill
//             value={content}
//             onChange={(newValue) => setContent(newValue)}
//           />
//         </div>

//         <button
//           style={{ width: '100%' }}
//           type="submit"
//           className="btn btn-primary"
//         >
//           Edit Post
//         </button>
//       </form>
//     </div>
//   );
// }

// export default EditPost;
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';

function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [file, setFile] = useState(null);
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:4000/post/' + id)
      .then((response) => {
        response.json().then((postInfo) => {
          setTitle((prevTitle) => postInfo.title || prevTitle);
          setContent((prevContent) => postInfo.content || prevContent);
          setSummary((prevSummary) => postInfo.summary || prevSummary);
        });
      });
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files;
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);

    if (file?.[0]) {
      data.set('file', file?.[0]);
    }

    const response = await fetch('http://localhost:4000/post', {
      method: 'PUT',
      body: data,
      credentials: 'include'
    });

    if (response.ok) {
      navigate('/');
    }

    console.log('Post edited successfully');
  };

  return (
    <div>
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
          />
        </div>

        <button
          style={{ width: '100%' }}
          type="submit"
          className="btn btn-primary"
        >
          Edit Post
        </button>
      </form>
    </div>
  );
}

export default EditPost;
