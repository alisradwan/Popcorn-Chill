import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { REMOVE_COMMENT } from '../utils/mutations';

const CommentList = ({ movieId,  comments = [] }) => {
  const [removeComment, { error }] = useMutation(REMOVE_COMMENT);  
  if (!comments.length) {
        comments.forEach(comment => {
            console.log("comment found: "+ comment._id);
        });
        return <h3>No Comments Yet</h3>;
    }

    const handleDeleteComment = async (movieId, commentId) => { 
      try {
        const { data } = await removeComment({
          variables: {
            movieId,
            commentId
          },
        });
      } catch (err) {
        console.error(err);
      }
      window.location.reload();
    };

    return (
        <>
            <h3
              className="p-5 display-inline-block"
              style={{ borderBottom: '1px dotted #1a1a1a' }}
            >
                Comments
            </h3>

            <Card className="flex-row my-4">
              {comments &&
                comments.map((comment) => (
                  <div key={comment._id} className="col-12 mb-3 pb-3">
                    <div className="p-3 bg-dark text-light">
                      <Card.Header className="card-header">
                        {comment.author} commented:
                        <br/>
                        <Button className='btn-block btn-danger' onClick={() => handleDeleteComment(movieId, comment._id)} > X </Button>
                      </Card.Header>
                      <Card.Body className="card-body text-light">{comment.body}</Card.Body>
                    </div>
                  </div>
                ))}
            </Card>
        </>
    );
};

export default CommentList;