import React, { useState, useEffect, useRef } from 'react';

function CheckList({ tasks = [], selectedDate, onAddTask, onRemoveTask, onToggleTask }) {
    const [taskInput, setTaskInput] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
      // focus input when selectedDate changes
      if (inputRef.current) inputRef.current.focus();
    }, [selectedDate]);

    function handleAdd() {
        const text = taskInput.trim();
        if (!text) return;
        if (typeof onAddTask === 'function') onAddTask(text);
        setTaskInput('');
    }

    const tasksForDate = tasks.filter(t => t.date === selectedDate);
    const doneTasks = tasksForDate.filter(task => task.done).length;
    const totalTasks = tasksForDate.length;
    const percent = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

    return (
        <div className="checklist">
            <h1>Check List</h1>
            <div>
                <input
                    ref={inputRef}
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
                    placeholder={`Add a new task for ${selectedDate}`}
                />
                <button onClick={handleAdd} aria-label="Add task">ADD</button>
            </div>
            <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label={`Tasks completion ${percent} percent`}>
                <div className="progress-bar" style={{ width: `${percent}%` }} />
            </div>
            <div className="progress-meta">{percent}% ({doneTasks}/{totalTasks})</div>
            <ul>
                {tasksForDate.map((task) => (
                    <li key={task.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                            type="checkbox"
                            checked={task.done}
                            onChange={() => onToggleTask && onToggleTask(task.id)}
                        />
                        <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>{task.text}</span>
                        <button onClick={() => onRemoveTask && onRemoveTask(task.id)} aria-label={`Delete task ${task.text}`}>DELETE</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CheckList;