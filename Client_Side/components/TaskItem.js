// components/TaskItem.js

const TaskItem = ({ task }) => {
    return (
      <div className="task-item">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <style jsx>{`
          .task-item {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            padding: 10px;
            margin-bottom: 10px;
          }
          h3 {
            margin-bottom: 5px;
          }
        `}</style>
      </div>
    );
  };
  
  export default TaskItem;
  