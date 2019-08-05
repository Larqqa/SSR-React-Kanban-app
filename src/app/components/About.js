import React from 'react';

const About = (props) => {
  return (
    <div>
      <p>About is here {props.route.data} {props.match.params.id}</p>
    </div>
  );
};

export default About;