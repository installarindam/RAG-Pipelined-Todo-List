// components/TaskList.js

const TaskList = ({ tasks }) => {
    return (
      <div className="task-list">
        <h2>Task List</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
        <style jsx>{`
          .task-list {
            margin-top: 20px;
          }
          ul {
            list-style-type: none;
            padding: 0;
          }
          li {
            margin-bottom: 10px;
          }
        `}</style>
      </div>
    );
  };
  
  export default TaskList;
  