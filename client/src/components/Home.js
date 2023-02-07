import React, { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import "../App.css";
import { Form, Container } from "react-bootstrap";

function Home() {
  return (
    <>
      <section class="page-section" id="services">
        <div class="container">
          <div class="text-center">
            <h2 class="section-heading text-uppercase">🍿Popcorn & Chill🍿</h2>
            <h3 class="section-subheading text-muted">
              {" "}
              Your #1 Movie Database
            </h3>
          </div>
          <div class="input-group rounded">
            <input
              type="search"
              class="form-control rounded"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="search-addon"
            />
            <span class="input-group-text border-0" id="search-addon">
              <i class="fas fa-search"></i>
            </span>
          </div>

          <div class="row text-center">
            <div class="col-md-4">
              <span class="fa-stack fa-4x">
                {/* <i class="fas fa-circle fa-stack-2x text-primary"></i>
                <i class="fas fa-shopping-cart fa-stack-1x fa-inverse"></i> */}
              </span>
              <h4 class="my-3">Search for Endless Movies</h4>
              <p class="text-muted">
                {" "}
                Using the Movie DB api you can search for millions of movies
                shows to find whatver you're looking for.
              </p>
            </div>
            <div class="col-md-4">
              <span class="fa-stack fa-4x">
                {/* <i class="fas fa-circle fa-stack-2x text-primary"></i>
                < class="fa-duotone fa-film fa-stack-1x fa-inverse"></i> */}
              </span>
              <h4 class="my-3">Create a profile to save your favorites</h4>
              <p class="text-muted">
                You can create a profile to add your favorite movies to your
                collection. From their you can like, dislike, and leave comments
                on films and shows.
              </p>
            </div>
            <div class="col-md-4">
              <span class="fa-stack fa-4x">
                {/* <i class="fas fa-circle fa-stack-2x text-primary"></i>
                <i class="fas fa-lock fa-stack-1x fa-inverse"></i> */}
              </span>
              <h4 class="my-3">See what people are watching now</h4>
              <p class="text-muted">
                {" "}
                Not only can you see what's trending, you can create a proflie
                to see what your friends are watching too.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Portfolio Grid--> */}
      <section class="page-section bg-light" id="portfolio">
        <video
          src={require("../assets/VideoTp.mp4")}
          autoPlay
          loop
          muted
        ></video>
      </section>
      {/* <!-- About--> */}
      <section class="page-section" id="about">
        <div class="container">
          <div class="text-center">
            <h2 class="section-heading text-uppercase">Trending Now</h2>
            <h3 class="section-subheading text-muted">
              Here's What People Are Watching
            </h3>
          </div>
          <ul class="timeline">
            <li>
              <div class="timeline-image">
                <img
                  class="rounded-circle img-fluid"
                  src={require("../assets/img/d9nBoowhjiiYc4FBNtQkPY7c11H.jpg")}
                  alt="..."
                />
              </div>
              <div class="timeline-panel">
                <div class="timeline-heading">
                  <h4>2022-12-28</h4>
                  <h4 class="subheading">M3GAN</h4>
                </div>
                <div class="timeline-body">
                  <p class="text-muted">
                    A brilliant toy company roboticist uses artificial
                    intelligence to develop M3GAN, a life-like doll programmed
                    to emotionally bond with her newly orphaned niece. But when
                    the doll's programming works too well, she becomes
                    overprotective of her new friend with terrifying results.
                  </p>
                </div>
              </div>
            </li>
            <li class="timeline-inverted">
              <div class="timeline-image">
                <img
                  class="rounded-circle img-fluid"
                  src={require("../assets/img/kuf6dutpsT0vSVehic3EZIqkOBt.jpg")}
                  alt="..."
                />
              </div>
              <div class="timeline-panel">
                <div class="timeline-heading">
                  <h4>2022-12-07</h4>
                  <h4 class="subheading">Puss in Boots: The Last Wish</h4>
                </div>
                <div class="timeline-body">
                  <p class="text-muted">
                    Puss in Boots discovers that his passion for adventure has
                    taken its toll: He has burned through eight of his nine
                    lives, leaving him with only one life left. Puss sets out on
                    an epic journey to find the mythical Last Wish and restore
                    his nine lives.
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div class="timeline-image">
                <img
                  class="rounded-circle img-fluid"
                  src={require("../assets/img/sv1xJUazXeYqALzczSZ3O6nkH75.jpg")}
                  alt="..."
                />
              </div>
              <div class="timeline-panel">
                <div class="timeline-heading">
                  <h4>2022-11-09</h4>
                  <h5>Black Panther: Wakanda Forever</h5>
                </div>
                <div class="timeline-body">
                  <p class="text-muted">
                    Queen Ramonda, Shuri, M'Baku, Okoye and the Dora Milaje
                    fight to protect their nation from intervening world powers
                    in the wake of King T'Challa's death. As the Wakandans
                    strive to embrace their next chapter, the heroes must band
                    together with the help of War Dog Nakia and Everett Ross and
                    forge a new path for the kingdom of Wakanda.
                  </p>
                </div>
              </div>
            </li>
            <li class="timeline-inverted">
              <div class="timeline-image">
                <img
                  class="rounded-circle img-fluid"
                  src={require("../assets/img/z2nfRxZCGFgAnVhb9pZO87TyTX5.jpg")}
                  alt="..."
                />
              </div>
              <div class="timeline-panel">
                <div class="timeline-heading">
                  <h4>2023-01-20</h4>
                  <h4 class="subheading">JUNG_E</h4>
                </div>
                <div class="timeline-body">
                  <p class="text-muted">
                    On an uninhabitable 22nd-century Earth, the outcome of a
                    civil war hinges on cloning the brain of an elite soldier to
                    create a robot mercenary.
                  </p>
                </div>
              </div>
            </li>
            <li class="timeline-inverted">
              <div class="timeline-image">
                <h4>
                  Be Part
                  <br />
                  Of Our
                  <br />
                  Story!
                </h4>
              </div>
            </li>
          </ul>
        </div>
      </section>
      {/* <!-- Team--> */}
      <section class="page-section bg-light" id="team">
        <div class="container">
          <div class="text-center">
            <h2 class="section-heading text-uppercase">Our Amazing Team</h2>
            <h3 class="section-subheading text-muted">
              Here are the Developers Behind Popcorn & Chill
            </h3>
          </div>

          <div class="row">
            <div class="col-md-3">
              <div class="team-member">
                <h4>Selina Su</h4>
                <p class="text-muted">insert title</p>
                <a
                  class="btn btn-dark btn-social mx-2"
                  href="https://github.com/fuuko08"
                  aria-label="Parveen Anand Twitter Profile"
                >
                  <i class="fab fa-github"></i>
                </a>
                <a
                  class="btn btn-dark btn-social mx-2"
                  href="#!"
                  aria-label="Parveen Anand LinkedIn Profile"
                >
                  <i class="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            <div class="col-md-3">
              <div class="team-member">
                <h4>Ali Radwan</h4>
                <p class="text-muted">insert title</p>
                <a
                  class="btn btn-dark btn-social mx-2"
                  href="https://github.com/alisradwan"
                  aria-label="Diana Petersen Twitter Profile"
                >
                  <i class="fab fa-github"></i>
                </a>
                <a
                  class="btn btn-dark btn-social mx-2"
                  href="#!"
                  aria-label="Diana Petersen LinkedIn Profile"
                >
                  <i class="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            <div class="col-md-3">
              <div class="team-member">
                <h4>D'Artagnan Hickey</h4>
                <p class="text-muted">insert title</p>
                <a
                  class="btn btn-dark btn-social mx-2"
                  href="https://github.com/SaintMartyrn"
                  aria-label="Larry Parker Twitter Profile"
                >
                  <i class="fab fa-github"></i>
                </a>
                <a
                  class="btn btn-dark btn-social mx-2"
                  href="#!"
                  aria-label="Larry Parker LinkedIn Profile"
                >
                  <i class="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            <div class="col-md-3">
              <div class="team-member">
                <h4>Aram Ambartsumyan</h4>
                <p class="text-muted">insert title</p>
                <a
                  class="btn btn-dark btn-social mx-2"
                  href="https://github.com/AramA89"
                  aria-label="Larry Parker Twitter Profile"
                >
                  <i class="fab fa-github"></i>
                </a>
                <a
                  class="btn btn-dark btn-social mx-2"
                  href="#!"
                  aria-label="Larry Parker LinkedIn Profile"
                >
                  <i class="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-8 mx-auto text-center">
              <p class="large text-muted">
                {" "}
                We are a group of fullstack developers from the 2023 UCLA Coding
                Bootcamp. Front end, back end, we can do it all!
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Clients--> */}
      <div class="py-5">
        <div class="container"></div>
      </div>
      {/* <!-- Contact--> */}
      <video src={require("../assets/VideoBg.mp4")} autoPlay loop muted></video>
    </>
  );
}

export default Home;










