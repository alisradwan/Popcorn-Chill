import React from "react";
import { Nav, NavDropdown } from "react-bootstrap";

function Genres() {
  return (
    <Nav variant="pills" defaultActiveKey="/home">
      <NavDropdown title="Movies">
        <NavDropdown.Item href="/PopularMovies">Popular</NavDropdown.Item>
        <NavDropdown.Item href="/UpComingMovies">Upcoming</NavDropdown.Item>
        <NavDropdown.Item href="/NowPlayingMovies">
          Now Playing
        </NavDropdown.Item>
        <NavDropdown.Item href="/TopRelatedMovies">Top Reated</NavDropdown.Item>
      </NavDropdown>
      <NavDropdown title="TV Shows">
        <NavDropdown.Item href="/TvShows">Popular</NavDropdown.Item>
        <NavDropdown.Item href="/OnTV">On TV</NavDropdown.Item>
        <NavDropdown.Item href="/AiringToday">Airing Today</NavDropdown.Item>
        <NavDropdown.Item href="/TopRelatedShow">Top Reated</NavDropdown.Item>
      </NavDropdown>
      <NavDropdown title="People">
        <NavDropdown.Item href="/PopularPeople">Popular</NavDropdown.Item>
      </NavDropdown>
      <NavDropdown title="More">
        <NavDropdown.Item href="/PopularPeople">Contact Us</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
}

export default Genres;
