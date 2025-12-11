import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const Header = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch tasks from your API or data source here
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_URL}/tasks`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate data is an array
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from server');
        }
        
        setTasks(data);
        setError(null);
      } catch (error) {
        setError(error.message);
        setTasks([]);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Task List</h1>
      {error && <div role="alert" style={{ color: 'red' }}>Error: {error}</div>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Header;
