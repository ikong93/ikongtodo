import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import CheckList from './components/CheckList';
import Calendar from './components/Calendar';

function App() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // load saved state
  useLocalStorageLoad(setTasks, setSelectedDate, todayStr);
  // save on changes
  useLocalStorageSave(tasks, selectedDate);

  function handleAddTask(text) {
    if (!text) return;
    const newTask = { id: Date.now(), text, done: false, date: selectedDate };
    setTasks(prev => [...prev, newTask]);
  }

  function handleRemoveTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  function handleToggleTask(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  return (
    <div className="App">
      <Header />

      <div className="main-content">
        <CheckList
          tasks={tasks}
          selectedDate={selectedDate}
          onAddTask={handleAddTask}
          onRemoveTask={handleRemoveTask}
          onToggleTask={handleToggleTask}
        />

        <Calendar
          tasks={tasks}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
      </div>
    </div>
  );
}

// Load tasks and selectedDate from localStorage on mount
function useLocalStorageLoad(setTasks, setSelectedDate, todayStr) {
  useEffect(() => {
    // Attempt to load saved tasks and selectedDate from localStorage.
    try {
      const saved = localStorage.getItem('todo-app-tasks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
          console.debug('[localStorage] loaded tasks', parsed.length);
        } else {
          console.warn('[localStorage] tasks value is not an array, ignoring');
        }
      } else {
        console.debug('[localStorage] no saved tasks found');
      }
    } catch (e) {
      console.error('[localStorage] failed to parse saved tasks', e);
    }

    try {
      const sd = localStorage.getItem('todo-app-selectedDate');
      if (sd) {
        setSelectedDate(sd);
        console.debug('[localStorage] loaded selectedDate', sd);
      } else {
        console.debug('[localStorage] no saved selectedDate, using default', todayStr);
      }
    } catch (e) {
      console.error('[localStorage] failed to read selectedDate', e);
    }
    // run once on mount
  }, [setTasks, setSelectedDate, todayStr]);
}

// Persist tasks and selectedDate
function useLocalStorageSave(tasks, selectedDate) {
  useEffect(() => {
    try {
      localStorage.setItem('todo-app-tasks', JSON.stringify(tasks));
      console.debug('[localStorage] saved tasks', tasks.length);
    } catch (e) {
      console.error('[localStorage] failed to save tasks', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('todo-app-selectedDate', selectedDate);
      console.debug('[localStorage] saved selectedDate', selectedDate);
    } catch (e) {
      console.error('[localStorage] failed to save selectedDate', e);
    }
  }, [selectedDate]);
}

export default App;
