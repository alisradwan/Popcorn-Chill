import React from 'react';

const CommentList = ({ comments = [] }) => {
    if (!comments.length) {
        comments.forEach(comment => {
            console.log("comment found: "+ comment._id);
        });
        return <h3>No Comments Yet</h3>;
    }

    return (
        <>
            <h3
        className="p-5 display-inline-block"
        style={{ borderBottom: '1px dotted #1a1a1a' }}
      >
        Comments
      </h3>
      <div className="flex-row my-4">
        {comments &&
          comments.map((comment) => (
            <div key={comment._id} className="col-12 mb-3 pb-3">
              <div className="p-3 bg-dark text-light">
                <h5 className="card-header">
                  {comment.author} commented:
                  <br/>
                </h5>
                <p className="card-body text-light">{comment.body}</p>
              </div>
            </div>
          ))}
      </div>
        </>
    );
};

export default CommentList;