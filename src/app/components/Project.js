import React from 'react';
import crypto from 'crypto';
import { connect } from 'react-redux';
import { updateTasks, deleteProject } from '../reducers/projectReducer';
import userService from '../services/user';
import Progress from './sub-components/Progress';

const Project = ( props ) => {
  const project = props.project;

  // Checking if projects are not initialized, and if project id from match.params.id was not found
  if (project === 0) {
    return <h3>loading</h3>;
  } else if (project === 1) {
    return <h3>nothing found</h3>;
  }

  const handleAddTask = (e) => {
    e.preventDefault();

    if (!e.target.title) return;

    // If title is in tasks
    if(
      project.progress.todo.find(todo => todo.title === e.target.title.value) ||
      project.progress.inProg.find(inProg => inProg.title === e.target.title.value) ||
      project.progress.done.find(done => done.title === e.target.title.value)
    ) return console.log('task already exists');

    // Set vars for dates & times
    let days = Number(e.target.completionDays.value);
    let hours = Number(e.target.completionHours.value);
    let completion = new Date();
    let creation = new Date();

    if (days || hours) {
      
      // Calculate days
      days += Math.floor((completion.getHours() + hours) / 24);

      // Calculate hours
      hours = ((completion.getHours() + hours) % 24);

      completion.setDate(completion.getDate() + days);
      completion.setHours(hours);
    } else {
      completion = null;
    }

    // Task object
    const obj = {
      title: e.target.title.value,
      description: e.target.description.value,
      
      // id is a random hash of 20 bytes
      id: crypto.randomBytes(20).toString('hex'),
      completionDate: completion,
      creationDate: creation
    };

    // Clear form
    e.target.title.value = '';
    e.target.description.value = '';
    e.target.completionDays.value = '';
    e.target.completionHours.value = '';

    project.progress.todo = project.progress.todo.concat(obj);
    props.updateTasks(project);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    const username = e.target.username.value;
    e.target.username.value = '';

    const checked = e.target.write.checked;
    e.target.write.checked = false;

    if (!username) return;

    try {
      const userId = await userService.getUserID(username);

      if (checked) {

        // Check if user already has read permit
        if (project.read.find(user => user.id === userId)) {
          if (confirm('Do you want to give user write permissions?')) {
            project.read = project.read.filter(
              user => user.id !== userId
            );
            project.readAndWrite = project.readAndWrite.concat(userId);
          }
        } else {

          // Check if user already has read & write permits
          if (project.readAndWrite.find(
            user => user.id === userId
          )) {
            return console.log('User already has read & write permits');
          } else {
            project.readAndWrite = project.readAndWrite.concat(userId);
          }
        }
      } else {

        // Check if user already has read & write permits
        if (project.readAndWrite.find(
          user => user.id === userId
        )) {
          if (confirm('Do you want to remove users write permissions?')) {
            project.readAndWrite = project.readAndWrite.filter(
              user => user.id !== userId
            );
            project.read = project.read.concat(userId);
          }
        } else {

          // Check if user already has read permit
          if (project.read.find(
            user => user.id === userId
          )) {
            return console.log('User already has read permit');
          } else {
            project.read = project.read.concat(userId);
          }
        }
      }

      props.updateTasks(project);
    } catch (er) {
      console.log(er);
    }
  };

  const removeUser = (e) => {
    try {
      project.readAndWrite = project.readAndWrite.filter(
        user => user.id !== e.target.value
      );

      project.read = project.read.filter(
        user => user.id !== e.target.value
      );

      props.updateTasks(project);
    } catch (er) {
      console.log(er);
    }
  };

  const handleAdvanceTask = (e) => {

    // Save task
    const task = project.progress[e.target.name].filter(
      prog => prog.id === e.target.value
    )[0];

    console.log(task);

    // Remove task
    project.progress[e.target.name] = project.progress[e.target.name].filter(
      prog => prog.id !== e.target.value
    );

    // Set stage
    let progress = 'todo';
    if (e.target.name === 'todo') progress = 'inProg';
    if (e.target.name === 'inProg') progress = 'done';
    task.advancedDate = new Date();

    // Set saved task in to next stage
    project.progress[progress] = project.progress[progress].concat(task);

    props.updateTasks(project);
  };

  const handleRemoveTask = (e) => {
    project.progress[e.target.name] = project.progress[e.target.name].filter(
      prog => prog.id !== e.target.value
    );

    props.updateTasks(project);
  };

  const handleDeleteProject = () => {
    if (!window.confirm('Do you really want to remove this project?')) return;

    props.deleteProject(project);
    props.history.push('/');
  };

  let userWrite = null;
  if (
    project.readAndWrite.find(user => user.id === props.user.id) ||
    project.user.id === props.user.id
  ) userWrite = true;

  return (
    <div className="main">
      <h3>{project.title}</h3>
      <p>{project.description}</p>

      {userWrite &&
        <>
          <button onClick={handleDeleteProject}>Delete project</button>
          <form onSubmit={handleAddTask}>
            <input name="title" type="text" />
            <input name="description" type="text" />
            <input name="completionDays" type="number" />
            <input name="completionHours" type="number" />
            <button>Add task</button>
          </form>
          <form onSubmit={handleAddUser}>
            <p>Username</p>
            <input name="username" type="text" />
            <input name="write" type="checkbox" /> Give user write permissions
            <button>Add user</button>
          </form>
        </>
      }

      <Progress
        userWrite={userWrite}
        progress={project.progress}
        handleAdvanceTask={handleAdvanceTask}
        handleRemoveTask={handleRemoveTask}
      />

      <h3>users</h3>
      <p><b>read</b></p>
      {project.read.map(
        user =>
          <p key={user.id}>
            {user.username}
            {userWrite && <button onClick={removeUser} value={user.id}>X</button>}
          </p>
      )}
      <p><b>read & write</b></p>
      {project.readAndWrite.map(
        user =>
          <p key={user.id}>
            {user.username}
            {userWrite && <button onClick={removeUser} value={user.id}>X</button>}
          </p>
      )}
    </div>
  );
};

const filterProjects = ( state, props ) => {

  // If projects are not initialized
  if (!state.projects[0] && state.projects.length === 0) return 0;

  // Get project based on url
  let filt = state.projects.filter(
    (project) => project.id === props.match.params.id
  )[0];

  // If nothing was found
  if (filt === undefined) return 1;
  return filt;
};

const mapStateToProps = ( state, props ) => {
  return {
    user: state.user,
    project: filterProjects(state, props),
  };
};

export default connect(
  mapStateToProps,
  {
    updateTasks,
    deleteProject
  }
)( Project );