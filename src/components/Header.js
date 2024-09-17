import React, { useState, useEffect } from 'react';

const Header = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks from your API or data source here
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:8080/tasks'); // Replace with your API endpoint
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li> // Assuming your tasks have an 'id' and 'title' property
        ))}
      </ul>
    </div>
  );
};

export default Header;
