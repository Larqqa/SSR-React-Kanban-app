import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addTask, removeTask, deleteProject } from '../reducers/projectReducer';
import crypto from 'crypto';

const Project = (props) => {
  const project = props.project;

  if (project === 0) {
    return <h3>loading</h3>;
  } else if (project === 1) {
    return <h3>nothing found</h3>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const obj = {
      title: e.target.title.value,
      description: e.target.description.value,
      id: crypto.randomBytes(20).toString('hex')
    };

    e.target.title.value = '';
    e.target.description.value = '';

    project.progress.todo = project.progress.todo.concat(obj);
    props.addTask(project);
  };

  const handleAdvanceTask = (e) => {
    const task = project.progress[e.target.name].filter(prog => prog.id === e.target.value)[0];

    project.progress[e.target.name] = project.progress[e.target.name].filter(prog => prog.id !== e.target.value);

    let progress = 'todo';
    if (e.target.name === 'todo') progress = 'inProg';
    if (e.target.name === 'inProg') progress = 'done';

    project.progress[progress] = project.progress[progress].concat(task);

    props.addTask(project);
  };

  const handleRemoveTask = (e) => {
    project.progress[e.target.name] = project.progress[e.target.name].filter(prog => prog.id !== e.target.value);
    props.removeTask(project);
  };

  const handleDelete = () => {
    props.deleteProject(project);
    props.history.push('/');
  };

  const Progress = ({progress, position}) => {
    const [toggle, setToggle] = useState(false);

    const handleToggle = () => {
      setToggle(!toggle);
    };

    return (
      <div>
        <p onClick={handleToggle}><b>{progress.title}</b></p>
        {toggle &&
          <>
            <p>{progress.description}</p>
            {
              position !== 'done'
              &&
              <button name={position} value={progress.id} onClick={handleAdvanceTask}>Advance</button>
            }
            <button name={position} value={progress.id} onClick={handleRemoveTask}>X</button>
          </>
        }
      </div>
    );
  };

  return (
    <div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <button onClick={handleDelete}>Delete project</button>
      <form onSubmit={handleSubmit}>
        <input name="title" type="text" />
        <input name="description" type="text" />
        <button>Add task</button>
      </form>
      <h3>todos</h3>
      {project.progress.todo.map(todo => <Progress key={todo.title} progress={todo} position={'todo'}/>)}
      <h3>in progress</h3>
      {project.progress.inProg.map(inProg => <Progress key={inProg.title} progress={inProg} position={'inProg'} />)}
      <h3>complete</h3>
      {project.progress.done.map(done => <Progress key={done.title} progress={done} position={'done'}/>)}
    </div>
  );
};

const filterProjects = (state, props) => {
  if (!state.projects[0] && state.projects.length > 0) return 0;

  // Filter desired project
  let filt = state.projects.filter(
    (project) => project.id === props.match.params.id
  )[0];

  // If nothing was found
  if (filt === undefined) return 1;
  return filt;
};

const mapStateToProps = (state, props) => {
  return {
    project: filterProjects(state, props),
  };
};

export default connect(
  mapStateToProps,
  { addTask, removeTask, deleteProject }
)(Project);