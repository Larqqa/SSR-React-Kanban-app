import React, { useState } from 'react';

const Progress = ({
  userWrite,
  progress,
  handleAdvanceTask,
  handleRemoveTask
}) => {

  const ProgressMap = ({ progressArr, progression }) => {
    const [ toggle, setToggle ] = useState(false);

    const handleToggle = () => {
      setToggle(!toggle);
    };

    return (
      progressArr.map(prog => {
        const time = (new Date(prog.completionDate).getTime() - new Date().getTime()) / 1000 / 60 / 60;
        return (
          <div key={prog.id} className="task">
            <p onClick={handleToggle} >{prog.title}</p>
            {toggle &&
              <>
                <p>{prog.description}</p>
                <p>Task was created on {new Date(prog.creationDate).toString()}</p>
                <p>Task should be completed on {new Date(prog.completionDate).toString()}</p>
                {Math.floor(time / 24)}d
                {Math.floor(time % 24)}h
                {Math.floor(((time % 24) * 60) % 60)}m
                {prog.advancedDate &&
                  <p>{progression === 'done' ? 'Task was completed on' : 'Task was advanced on'} {new Date(prog.advancedDate).toString()}</p>
                }
                {userWrite &&
                  <>
                    {progression !== 'done' && <button name={progression} value={prog.id} onClick={handleAdvanceTask}>Advance</button>}
                    <button name={progression} value={prog.id} onClick={handleRemoveTask}>Remove</button>
                  </>
                }
              </>
            }
          </div>
        );
      })
    );
  };

  return (
    <div className="progress">
      <h3>to do</h3>
      <ProgressMap progressArr={progress.todo} progression="todo" />
      <h3>In Progress</h3>
      <ProgressMap progressArr={progress.inProg} progression="inProg" />
      <h3>Done</h3>
      <ProgressMap progressArr={progress.done} progression="done" />
    </div>
  );
};

export default Progress;