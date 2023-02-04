import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { ADD_COMMENT } from '../utils/mutations';
import Auth from '../utils/auth';

const CommentForm = ({ movieId }) => {
    const [body, setBody] = useState('');
    const [characterCount, setCharacterCount] = useState(0);
    const [addComment, { error }] = useMutation(ADD_COMMENT);
    
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const { data } = await addComment({
                variables: {
                  movieId,
                  body,
                  author: Auth.getProfile().data.username,
                },
              });
            setBody('');
        } catch (err) {
        console.error(err);    
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'body' && value.length <= 280) {
            setBody(value);
            setCharacterCount(value.length);
          }
    };

    return (
        <>
          {Auth.loggedIn() ? (
            <>
            <p
              className={`m-0 ${
                characterCount === 280 || error ? 'text-danger' : ''
              }`}
            >
              Character Count: {characterCount}/280
              {error && <span className="ml-2">{error.message}</span>}
            </p>
            <form
              className="flex-row justify-center justify-space-between-md align-center"
              onSubmit={handleFormSubmit}
            >
              <div className="col-12 col-lg-9">
                <textarea
                  name="body"
                  placeholder="Add your comment..."
                  value={body}
                  className="form-input w-100"
                  style={{ lineHeight: '1.5', resize: 'vertical' }}
                  onChange={handleChange}
                ></textarea>
              </div>
  
              <div className="col-12 col-lg-3">
                <button className="btn btn-primary btn-block py-3" type="submit">
                  Add Comment
                </button>
              </div>
            </form>
          </>
          ) : (
            <p>
                You need to be logged in to share your thoughts. Please{' '}
                <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
            </p>
          )}
        </>
    );
};

export default CommentForm;