import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addTask, removeTask, deleteProject, editProjectUsers } from '../reducers/projectReducer';
import crypto from 'crypto';
import userService from '../services/user';

const Project = (props) => {
  const project = props.project;

  if (project === 0) {
    return <h3>loading</h3>;
  } else if (project === 1) {
    return <h3>nothing found</h3>;
  }

  const handleAddTask = (e) => {
    e.preventDefault();

    if (!e.target.title) return;

    if(
      project.progress.todo.find(todo => todo.title === e.target.title.value)
      || project.progress.inProg.find(inProg => inProg.title === e.target.title.value)
      || project.progress.done.find(done => done.title === e.target.title.value)
    ) return console.log('task already exists');

    let days = Number(e.target.completionDays.value);
    let hours = Number(e.target.completionHours.value);

    let completion = new Date();

    if (days || hours) {

      days += Math.floor((completion.getHours() + hours) / 24);
      hours = ((completion.getHours() + hours) % 24);

      completion.setDate(completion.getDate() + days);
      completion.setHours(hours);
    } else {
      completion = null;
    }

    let creation = new Date();

    const obj = {
      title: e.target.title.value,
      description: e.target.description.value,
      id: crypto.randomBytes(20).toString('hex'),
      completionDate: completion,
      creationDate: creation
    };

    e.target.title.value = '';
    e.target.description.value = '';
    e.target.completionDays.value = '';
    e.target.completionHours.value = '';

    project.progress.todo = project.progress.todo.concat(obj);
    props.addTask(project);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const checked = e.target.write.checked;
    const username = e.target.username.value;

    e.target.write.checked = false;
    e.target.username.value = '';

    if (!username) return;

    try {
      const userId = await userService.getUserID(username);

      if (checked) {
        if (project.read.find(user => user.id === userId)) {
          if (confirm('do you want to give user write permissions?')) {
            project.read = project.read.filter(user => user.id !== userId);
            project.readAndWrite = project.readAndWrite.concat(userId);
          }
        } else {
          if (project.readAndWrite.find(user => user.id === userId)) {
            return console.log('user already in list');
          } else {
            project.readAndWrite = project.readAndWrite.concat(userId);
          }
        }
      } else {
        if (project.readAndWrite.find(user => user.id === userId)) {
          if (confirm('do you want to remove users write permissions?')) {
            project.readAndWrite = project.readAndWrite.filter(user => user.id !== userId);
            project.read = project.read.concat(userId);
          }
        } else {
          if (project.read.find(user => user.id === userId)) {
            return console.log('user already in list');
          } else {
            project.read = project.read.concat(userId);
          }
        }
      }

      props.editProjectUsers(project);
    } catch (er) {
      console.log(er);
    }
  };

  const removeUser = async (e) => {
    try {
      project.readAndWrite = project.readAndWrite.filter(user => user.id !== e.target.value);
      project.read = project.read.filter(user => user.id !== e.target.value);

      props.editProjectUsers(project);
    } catch (er) {
      console.log(er);
    }
  };

  const handleAdvanceTask = (e) => {
    const task = project.progress[e.target.name].filter(prog => prog.id === e.target.value)[0];

    project.progress[e.target.name] = project.progress[e.target.name].filter(prog => prog.id !== e.target.value);

    let progress = 'todo';
    if (e.target.name === 'todo') progress = 'inProg';
    if (e.target.name === 'inProg') progress = 'done';
    task.advancedDate = new Date();

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

  const Progress = ({progress, position, admin}) => {
    const [toggle, setToggle] = useState(false);

    const handleToggle = () => {
      setToggle(!toggle);
    };

    const time = (new Date(progress.completionDate).getTime() - new Date().getTime()) / 1000 / 60 / 60;

    return (
      <div>
        <p onClick={handleToggle}><b>{progress.title}</b></p>
        {toggle &&
          <>
            <p>{progress.description}</p>
            <p>Created on:</p>
            <p>{new Date(progress.creationDate).toString()}</p>
            {progress.completionDate &&
              <>
              <p>To be done by:</p>
              <p>{new Date(progress.completionDate).toString()}</p>
              <p>Time to complete:</p>
              <p>
                {Math.floor(time / 24)}
                {' days & '}
                {Math.floor(time % 24)}
                {' hours & '}
                {Math.floor(time % 24 * 60)}
                {' minutes'}
              </p>
              </>
            }
            {position !== 'todo' &&
              <>
                {position === 'done' ? <p>Progress completed on:</p> : <p>Progress updated on:</p>}
                <p>{new Date(progress.advancedDate).toString()}</p>
              </>
            }
            {admin &&
              <>
                {position !== 'done' &&
                  <button name={position} value={progress.id} onClick={handleAdvanceTask}>Advance</button>
                }
                <button name={position} value={progress.id} onClick={handleRemoveTask}>X</button>
              </>
            }
          </>
        }
      </div>
    );
  };

  if (project.readAndWrite.find(user => user.id === props.user.id) || project.user.id === props.user.id) {
    return (
      <div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <button onClick={handleDelete}>Delete project</button>
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
        <h3>todos</h3>
        {project.progress.todo.map(todo => <Progress key={todo.title} progress={todo} position={'todo'} admin={true} />)}
        <h3>in progress</h3>
        {project.progress.inProg.map(inProg => <Progress key={inProg.title} progress={inProg} position={'inProg'} admin={true}  />)}
        <h3>complete</h3>
        {project.progress.done.map(done => <Progress key={done.title} progress={done} position={'done'} admin={true}  />)}

        <h3>users</h3>
        <p><b>read</b></p>
        {project.read.map(user => <p key={user.id}>{user.username}<button onClick={removeUser} value={user.id}>X</button></p>)}
        <p><b>read & write</b></p>
        {project.readAndWrite.map(user => <p key={user.id}>{user.username}<button onClick={removeUser} value={user.id}>X</button></p>)}
      </div>
    );
  } else {
    return (
      <div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <h3>todos</h3>
        {project.progress.todo.map(todo => <Progress key={todo.title} progress={todo} position={'todo'}/>)}
        <h3>in progress</h3>
        {project.progress.inProg.map(inProg => <Progress key={inProg.title} progress={inProg} position={'inProg'} />)}
        <h3>complete</h3>
        {project.progress.done.map(done => <Progress key={done.title} progress={done} position={'done'}/>)}

        <h3>users</h3>
        <p><b>read</b></p>
        {project.read.map(user => <p key={user.id}>{user.username}</p>)}
        <p><b>read & write</b></p>
        {project.readAndWrite.map(user => <p key={user.id}>{user.username}</p>)}
      </div>
    );
  }
};

const filterProjects = (state, props) => {
  if (!state.projects[0] && state.projects.length === 0) return 0;

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
    user: state.user,
    project: filterProjects(state, props),
  };
};

export default connect(
  mapStateToProps,
  { addTask, removeTask, deleteProject, editProjectUsers }
)(Project);