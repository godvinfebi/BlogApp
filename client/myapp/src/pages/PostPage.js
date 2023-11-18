 import {  formatISO9075 } from 'date-fns';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {UserContext} from '../UserContext'
import './pp.css';
function PostPage() {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState(null);
const {userInfo} = useContext(UserContext)
  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`)
      .then(response => response.json())
      .then(postData => {
        setPostInfo(postData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [id]);

  if (!postInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4 text-center">
      <div className="text-center">
        <h1>{postInfo.title}</h1>
        <div className="text-muted mb-3">
          <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
        </div>
        <div className="text-muted mb-4">
          by {postInfo.author.username}
        </div>
        {userInfo.id === postInfo.author._id && (
          <div className='edit-row'> 
          <Link className='edit-btn' to={`/edit/${postInfo._id}`}>Edit this post</Link>
          </div>
        )}
      </div>
      <div className="row">
        <div className="col-md-8">
          <div className="post-page">
            <div className="image">
              <img
                src={`http://localhost:4000/${postInfo.cover}`}
                alt=""
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="content">
              <div
                dangerouslySetInnerHTML={{ __html: postInfo.content }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostPage;
