import { Modal, show, Button } from "react-bootstrap";
import React, { useState } from "react";
const API_IMG = "https://image.tmdb.org/t/p/w500/";

const PeopleBox = ({ name, profile_path }) => {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <div className="card text-center bg-secondary mb-3">
      <div className="card-body">
        <img className="card-img-top img" src={API_IMG + profile_path} />
        <h3>{name}</h3>
      </div>
    </div>
  );
};

export default PeopleBox;
