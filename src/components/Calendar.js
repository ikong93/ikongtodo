import React, { useState } from 'react';

function Calendar({ tasks = [], selectedDate, onSelectDate }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); 

  function startOfMonth(y, m) {
    return new Date(y, m, 1);
  }

  function daysInMonth(y, m) {
    return new Date(y, m + 1, 0).getDate();
  }

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  const firstDay = startOfMonth(year, month).getDay(); 
  const totalDays = daysInMonth(year, month);

  const weeks = [];
  let current = 1 - firstDay; 

  while (current <= totalDays) {
    const week = [];
    for (let i = 0; i < 7; i++, current++) {
      if (current < 1 || current > totalDays) {
        week.push(null);
      } else {
        week.push(current);
      }
    }
    weeks.push(week);
  }

  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

 
  const taskMap = {};
  tasks.forEach(t => {
    if (!t.date) return;
    if (!taskMap[t.date]) taskMap[t.date] = { total: 0, unchecked: 0 };
    taskMap[t.date].total += 1;
    if (!t.done) taskMap[t.date].unchecked += 1;
  });

  function formatDateStr(y, m0, d) {
    const mm = String(m0 + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevMonth} aria-label="Previous month">‹</button>
        <div className="calendar-title">{monthNames[month]} {year}</div>
        <button onClick={nextMonth} aria-label="Next month">›</button>
      </div>

      <table className="calendar-table">
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((day, di) => {
                if (!day) return <td key={di} className="calendar-empty" />;
                const dateStr = formatDateStr(year, month, day);
                const meta = taskMap[dateStr];
                const hasUnchecked = meta && meta.unchecked > 0;
                const hasTasks = meta && meta.total > 0;
                const isSelected = selectedDate === dateStr;
                return (
                  <td key={di} className={`calendar-day ${isSelected ? 'selected' : ''}`} onClick={() => onSelectDate && onSelectDate(dateStr)}>
                    <div style={{ position: 'relative' }}>
                      <span>{day}</span>
                      {hasTasks && (
                        <span className={`calendar-indicator ${hasUnchecked ? 'calendar-unchecked' : 'calendar-all-done'}`} />
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Calendar;
