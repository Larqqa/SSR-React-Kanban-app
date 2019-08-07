import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Projects = (props) => {
  const [toggle, setToggle] = useState(true);

  const handleToggle = (e) => {
    if (e.target.name === 'all') {
      setToggle(true);
      document.getElementById('all').classList.add('active');
      document.getElementById('my').classList.remove('active');
    } else {
      setToggle(false);
      document.getElementById('my').classList.add('active');
      document.getElementById('all').classList.remove('active');
    }
  };

  const ProjectsList = ({ projects }) => {
    return (
      projects.map(
        (project, i) =>
          <div key={i}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <Link to={`/projects/${project.id}`}>Open</Link>
          </div>
      )
    );
  };

  return (
    <div>
      <button className="active" name="all" id="all" onClick={handleToggle}>All projects</button>
      <button className="" name="my" id="my" onClick={handleToggle}>My projects</button>
      {toggle ?
        <div>
          <h3>All projects</h3>
          <ProjectsList projects={props.projects}/>
        </div>
        :
        <div>
          <h3>My projects</h3>
          <ProjectsList projects={props.projects.filter(project => project.user.id === props.user.id)}/>
        </div>
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    projects: state.projects,
  };
};

export default connect(
  mapStateToProps
)(Projects);