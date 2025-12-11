import React from 'react';

const TaskItem = ({ task, onDelete, onUpdate }) => {
  const handleToggleComplete = () => {
    if (onUpdate) {
      onUpdate(task.id, { ...task, completed: !task.completed });
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  return (
    <li style={{ 
      marginBottom: '10px', 
      padding: '10px', 
      border: '1px solid #ddd',
      borderRadius: '4px' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="checkbox"
          checked={task.completed || false}
          onChange={handleToggleComplete}
          aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <span style={{ 
          flex: 1, 
          textDecoration: task.completed ? 'line-through' : 'none' 
        }}>
          {task.title}
        </span>
        <button 
          onClick={handleDelete}
          style={{ 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none', 
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          aria-label={`Delete task: ${task.title}`}
        >
          Delete
        </button>
      </div>
      {task.description && (
        <p style={{ marginTop: '5px', fontSize: '0.9em', color: '#666' }}>
          {task.description}
        </p>
      )}
    </li>
  );
};

export default TaskItem;
