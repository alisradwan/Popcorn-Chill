import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";

function SearchMovie({ setSearchTerm }) {
  const [query, setQuery] = useState("");

  const changeHandler = (e) => {
    console.log("event.target.value", e.target.value);
    setQuery(e.target.value);
    console.log("query", query);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    console.log("query in submitSearch", query);
    setSearchTerm(query);
    setQuery("");
  };

  return (
    <Form onSubmit={submitSearch}>
      <input
        type="search"
        placeholder="Movie Search"
        className="me-3"
        aria-label="search"
        name="query"
        value={query}
        onChange={changeHandler}
      ></input>
      <Button variant="secondary" type="submit">
        Search
      </Button>
    </Form>
  );
}

export default SearchMovie;
