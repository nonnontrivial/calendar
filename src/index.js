// @flow

import React from 'react';
import { dayNames, monthNames } from './util';

function MonthCycler(props: { className?: string }): React$Node {
  const { date, onChange } = React.useContext(DateContext);
  const m = date.getMonth();
  const y = date.getFullYear();
  // Handle previous month click
  const onPrev = React.useCallback(() => {
    const month = (m - 1 + monthNames.length) % monthNames.length;
    if (m === 0) {
      y -= 1;
    }
    onChange(new Date(y, month));
  }, [m]);
  // Handle next month click
  const onNext = React.useCallback(() => {
    const month = (m + 1) % monthNames.length;
    if (m === monthNames.length - 1) {
      y += 1;
    }
    onChange(new Date(y, month));
  }, [m]);
  return (
    <div className={props.className}>
      <p>
        {monthNames[m]} {y}
      </p>
      <button onClick={onPrev}>←</button>
      <button onClick={onNext}>→</button>
    </div>
  );
}

function Calendar(props: {
  className?: string,
  selectedDayStyle?: {},
  dayNames?: boolean | string[]
}): React$Node {
  const { date, onChange } = React.useContext(DateContext);
  // Build 2d array representing the days in the month
  const dayMatrix = React.useMemo(() => {
    let d = 1;
    const dm = [];
    const buildDateObj = (d: number) => new Date(date.getFullYear(), date.getMonth(), d);
    while (true) {
      if (buildDateObj(d).getMonth() !== buildDateObj(d + 1).getMonth()) {
        if (dm[dm.length - 1].length === dayNames.length) {
          dm.push([buildDateObj(d)]);
        } else {
          dm[dm.length - 1].push(buildDateObj(d));
        }
        let i = dayNames.indexOf(
          buildDateObj(d)
            .toString()
            .slice(0, 3)
        );
        while (i < dayNames.length - 1) {
          dm[dm.length - 1].push(null);
          i++;
        }
        break;
      }
      if (
        buildDateObj(d)
          .toString()
          .toLowerCase()
          .startsWith(dayNames[0].toLowerCase())
      ) {
        dm.push([buildDateObj(d)]);
      } else if (d === 1) {
        let i = dayNames.indexOf(
          buildDateObj(d)
            .toString()
            .slice(0, 3)
        );
        dm.push([]);
        while (i--) {
          dm[0].push(null);
        }
        dm[0].push(buildDateObj(d));
      } else {
        dm[dm.length - 1].push(buildDateObj(d));
      }
      d++;
    }
    return dm;
  }, [date.getMonth()]);
  const getDefaultDayStyle = (d: null | boolean): any => {
    return {
      textAlign: 'center',
      userSelect: 'none',
      padding: '0.421rem',
      borderRadius: '0.221rem',
      cursor: d ? 'pointer' : 'default'
    };
  };
  const getDayStyle = (d: null | boolean): any => {
    return d ? props.selectedDayStyle || {} : {};
  };
  return (
    <table className={props.className}>
      <tbody>
        {props.dayNames && (
          <tr>
            {(Array.isArray(props.dayNames) ? props.dayNames : dayNames).map((d, i) => (
              <td key={i}>{d}</td>
            ))}
          </tr>
        )}
        {dayMatrix.map((row, i) => (
          <tr key={i}>
            {row.map((day, j) => (
              <td
                key={j}
                style={{
                  ...getDefaultDayStyle(day),
                  ...getDayStyle(day && day.getDate() === date.getDate())
                }}
                onClick={(): void => {
                  if (!Object.is(day, null)) {
                    onChange(day);
                  }
                }}
              >
                {day ? day.getDate() : ''}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// $FlowFixMe
const DateContext = React.createContext({});

export { Calendar, MonthCycler, DateContext };
