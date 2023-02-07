import React from "react"; 

const Contact = () => {
    return (
        <>
            <section className="page-section bg-light" id="team">
                <div className="container">
                <div className="text-center">
                    <h2 className="section-heading text-uppercase">Our Amazing Team</h2>
                    <h3 className="section-subheading text-muted">
                    Here are the Developers Behind Popcorn & Chill
                    </h3>
                </div>

                <div className="row">
                    <div className="col-md-3">
                    <div className="team-member">
                        <h4>Selina Su</h4>
                        <p class="text-muted">Full Stack Web Developer</p>
                        <a
                        className="btn btn-dark btn-social mx-2"
                        href="https://github.com/fuuko08"
                        aria-label="Parveen Anand Twitter Profile"
                        >
                        <i className="fab fa-github"></i>
                        </a>
                        <a
                        className="btn btn-dark btn-social mx-2"
                        href="https://www.linkedin.com/in/selina-su-437501144/"
                        aria-label="Parveen Anand LinkedIn Profile"
                        >
                        <i className="fab fa-linkedin-in"></i>
                        </a>
                    </div>
                    </div>
                    <div className="col-md-3">
                    <div className="team-member">
                        <h4>Ali Radwan</h4>
                        <p className="text-muted">insert title</p>
                        <a
                        className="btn btn-dark btn-social mx-2"
                        href="https://github.com/alisradwan"
                        aria-label="Diana Petersen Twitter Profile"
                        >
                        <i className="fab fa-github"></i>
                        </a>
                        <a
                        className="btn btn-dark btn-social mx-2"
                        href="#!"
                        aria-label="Diana Petersen LinkedIn Profile"
                        >
                        <i className="fab fa-linkedin-in"></i>
                        </a>
                    </div>
                    </div>
                    <div className="col-md-3">
                    <div className="team-member">
                        <h4>D'Artagnan Hickey</h4>
                        <p className="text-muted">insert title</p>
                        <a
                        className="btn btn-dark btn-social mx-2"
                        href="https://github.com/SaintMartyrn"
                        aria-label="Larry Parker Twitter Profile"
                        >
                        <i className="fab fa-github"></i>
                        </a>
                        <a
                        className="btn btn-dark btn-social mx-2"
                        href="#!"
                        aria-label="Larry Parker LinkedIn Profile"
                        >
                        <i className="fab fa-linkedin-in"></i>
                        </a>
                    </div>
                    </div>
                    <div className="col-md-3">
                    <div className="team-member">
                        <h4>Aram Ambartsumyan</h4>
                        <p className="text-muted">insert title</p>
                        <a
                        className="btn btn-dark btn-social mx-2"
                        href="https://github.com/AramA89"
                        aria-label="Larry Parker Twitter Profile"
                        >
                        <i className="fab fa-github"></i>
                        </a>
                        <a
                        className="btn btn-dark btn-social mx-2"
                        href="#!"
                        aria-label="Larry Parker LinkedIn Profile"
                        >
                        <i className="fab fa-linkedin-in"></i>
                        </a>
                    </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-8 mx-auto text-center">
                    <p className="large text-muted">
                        {" "}
                        We are a group of fullstack developers from the 2023 UCLA Coding
                        Bootcamp. Front end, back end, we can do it all!
                    </p>
                    </div>
                </div>
            </div>
        </section>
      
        <div className="py-5">
            <div className="container"></div>
        </div>
      </>
    )
};

export default Contact;