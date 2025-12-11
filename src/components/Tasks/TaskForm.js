import React, { useState } from 'react';
import taskService from '../../services/taskService';

const TaskForm = ({ onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.title.trim()) {
        throw new Error('Task title is required');
      }

      const newTask = await taskService.createTask({
        title: formData.title.trim(),
        description: formData.description.trim(),
        completed: false,
      });

      // Clear form
      setFormData({ title: '', description: '' });

      if (onTaskCreated) {
        onTaskCreated(newTask);
      }
    } catch (err) {
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div role="alert" style={{ color: 'red', marginBottom: '10px' }}>
            {error}
          </div>
        )}
        
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="title">
            Title: <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
            maxLength="200"
            required
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            maxLength="1000"
            rows="3"
            style={{ width: '100%', padding: '5px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
