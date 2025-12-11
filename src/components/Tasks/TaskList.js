import React, { useState, useEffect } from 'react';
import taskService from '../../services/taskService';
import TaskItem from './TaskItem';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    }
  };

  const handleTaskUpdate = async (taskId, updatedData) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, updatedData);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
    } catch (err) {
      setError(err.message || 'Failed to update task');
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div>
      <h2>Task List</h2>
      {error && (
        <div role="alert" style={{ color: 'red', marginBottom: '10px' }}>
          Error: {error}
        </div>
      )}
      {tasks.length === 0 ? (
        <p>No tasks available. Create one to get started!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={handleTaskDelete}
              onUpdate={handleTaskUpdate}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
