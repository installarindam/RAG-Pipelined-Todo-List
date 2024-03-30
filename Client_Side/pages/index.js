// pages/index.js
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoginForm from '../components/LoginForm';

const IndexPage = () => {
  const [userEmail, setUserEmail] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskReminderDate, setTaskReminderDate] = useState('');
  const [taskReminderTime, setTaskReminderTime] = useState('');
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const userEmailFromStorage = localStorage.getItem('userEmail');
    if (userEmailFromStorage) {
      setUserEmail(userEmailFromStorage);
      fetchTasks(userEmailFromStorage);
    }
  }, []);

  const fetchTasks = async (email) => {
    setLoadingTasks(true);
    try {
      const response = await fetch(`/api/tasks?userEmail=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        data.forEach((task) => {
          identifyMissingValuesAndNotify({
            taskId: task.id,
            taskName: task.task_name,
            taskDescription: task.task_description,
            taskReminderDate: task.reminder_date,
            taskReminderTime: task.reminder_time,
          });
        });
      } else {
        setError('Failed to fetch tasks. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again.');
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) {
      setError('Task name is required.');
      return;
    }
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userEmail,
          taskName,
          taskDescription,
          taskReminderDate,
          taskReminderTime
        })
      });
      if (response.ok) {
        await fetchTasks(userEmail);
        setTaskName('');
        setTaskDescription('');
        setTaskReminderDate('');
        setTaskReminderTime('');
        setError('');
      } else {
        setError('Failed to submit task. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting task:', error);
      setError('Failed to submit task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchTasks(userEmail);
      } else {
        setError('Failed to delete task. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    }
  };

  const identifyMissingValuesAndNotify = async (task) => {
    const missingValues = [];
    if (!task.taskName) {
      missingValues.push('Task Name');
    }
    if (!task.taskDescription) {
      missingValues.push('Task Description');
    }
    if (!task.taskReminderDate) {
      missingValues.push('Task Reminder Date');
    }
    if (!task.taskReminderTime) {
      missingValues.push('Task Reminder Time');
    }
  
    if (missingValues.length > 0) {
      const missingValuesString = missingValues.join(', ');
      const message = `Task ID: ${task.taskId}\nTask Name: ${task.taskName}\nThe following values are missing for the task: ${missingValuesString}. Please provide them.`;
 
      try {
        const response = await fetch('/api/sendEmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userEmail,
            message
          })
        });
        if (!response.ok) {
          setError('Failed to send email requesting missing values. Please try again.');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        setError('Failed to send email requesting missing values. Please try again.');
      }
    }
  };

  const handleLogin = (email) => {
    setUserEmail(email);
    fetchTasks(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setUserEmail('');
  };

  return (
    <Layout>
      <div className="container">
        {userEmail ? (
          <div>
            <h1>Welcome back, {userEmail}!</h1>

            <div className="grid-container">
              <div className="grid-item">
                <h2>Task List</h2>
                {loadingTasks ? (
                  <p>Loading tasks...</p>
                ) : tasks.length > 0 ? (
                  <div className="task-list">
                    {tasks.map((task) => (
                      <div key={task.id} className="task">
                        <div className="task-info">
                          <strong>{task.task_name}</strong>
                          <p>{task.task_description}</p>
                          {task.reminder_date && <p>Reminder Date: {task.reminder_date}</p>}
                          {task.reminder_time && <p>Reminder Time: {task.reminder_time}</p>}
                        </div>
                        <button className="delete-btn" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No tasks found.</p>
                )}
              </div>
              <div className="grid-item">
                <h2>Add New Task</h2>
                <form onSubmit={handleSubmitTask}>
                  <div className="input-group">
                    <label htmlFor="taskName">Task Name:</label>
                    <input
                      type="text"
                      id="taskName"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="taskDescription">Task Description:</label>
                    <input
                      type="text"
                      id="taskDescription"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="taskReminderDate">Reminder Date:</label>
                    <input
                      type="date"
                      id="taskReminderDate"
                      value={taskReminderDate}
                      onChange={(e) => setTaskReminderDate(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="taskReminderTime">Reminder Time:</label>
                    <input
                      type="time"
                      id="taskReminderTime"
                      value={taskReminderTime}
                      onChange={(e) => setTaskReminderTime(e.target.value)}
                      />
                    </div>
                    <button type="submit">Add Task</button>
                  </form>
                </div>
              </div>
              {error && <p className="error-message">{error}</p>}
            </div>
          ) : (
            <LoginForm onLogin={handleLogin} />
          )}
        </div>


        <style jsx>{`
          .container {
            margin: auto;
            max-width: 800px;
            padding: 20px;
            background-color: #000;
            border-radius: 10px;
            color: #fff;
          }
  
          .grid-container {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
  
          .grid-item {
            padding: 20px;
            background-color: #222;
            border-radius: 10px;
          }
  
          .task-list {
            display: grid;
            grid-gap: 20px;
          }
  
          .task {
            padding: 15px;
            background-color: #222;
            border-radius: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
  
          .task-info {
            flex-grow: 1;
            margin-right: 10px;
          }
  
          strong {
            font-size: 1.2rem;
            color: #00ff00;
          }
  
          .delete-btn {
            padding: 8px 16px;
            background-color: #ff0000;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
  
          .delete-btn:hover {
            background-color: #cc0000;
          }
  
          input[type='text'],
          input[type='date'],
          input[type='time'] {
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            border: none;
            border-radius: 5px;
            background-color: #222;
            color: #fff;
          }
  
          button[type='submit'] {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            background-color: #00ff00;
            color: #000;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
  
          button[type='submit']:hover {
            background-color: #009900;
          }
  
          .error-message {
            color: red;
            margin-top: 10px;
          }
          .input-group input {
            border: 1px solid #fff;
            padding: 8px;
            border-radius: 5px;
            background-color: #222;
            color: #fff;
          }
        `}</style>
      </Layout>
    );
  };
  
  export default IndexPage;
