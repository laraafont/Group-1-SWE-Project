import React from 'react';
import './aboutus.css';

const teamMembers = [
  {
    name: "Aarithi Rajendren",
    role: "Back-end Developer",
    image: "/images/aarithi_headshot.png"
  },
  {
    name: "Lara Afont",
    role: "Back-end & Front-end Developer",
    image: "/images/lara_headshot.png"
  },
  {
    name: "Erriana Thomas",
    role: "Front-end Developer",
    image: "/images/erriana_headshot.png"
  },
  {
    name: "Isabelle Carminati",
    role: "Front-end Developer",
    image: "/images/isabelle_headshot.png"
  }
];

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      <h1>About PinkBox</h1>
      <p>
        PinkBox is an innovative centralized movie marketplace designed to tackle common challenges faced by movie 
        enthusiasts, such as fragmented access to films, scattered subscriptions, and the absence of a unified platform 
        for managing physical or digital movie collections. Created by a passionate team of women in tech who share a 
        deep love for movies, PinkBox incorporates an array of user-focused features, a robust technical foundation, and 
        an intuitive user experience to deliver a scalable and modern solution tailored to both casual viewers and dedicated 
        collectors. PinkBox redefines how movie enthusiasts buy, sell, and curate their favorite films. As a comprehensive 
        one-stop shop, it allows users to access, purchase, and manage movies without the constraints of multiple streaming 
        subscriptions. By connecting users directly to production companies, the platform facilitates straightforward transactions 
        and ensures authenticated access to digital content.
      </p>
      <h2>Meet the Team</h2>
      <div className="team-section">
        {teamMembers.map((member, index) => (
          <div className="team-card" key={index}>
            <img src={member.image} alt={member.name} className="team-photo" />
            <h2 className="team-name">{member.name}</h2>
            <p className="team-role">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
