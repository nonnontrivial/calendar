// @flow

import React from 'react';
import { dayNames, monthNames } from './util';

function MonthCycler(props: { className?: string }): React$Node {
  let { date, onChange } = React.useContext(DateContext);
  let m = date.getMonth();
  let y = date.getFullYear();
  let onPrev = React.useCallback(
    () => {
      let month = (m - 1 + monthNames.length) % monthNames.length;
      if (m === 0) {
        y -= 1;
      }
      onChange(new Date(y, month));
    },
    [m]
  );
  let onNext = React.useCallback(
    () => {
      let month = (m + 1) % monthNames.length;
      if (m === monthNames.length - 1) {
        y += 1;
      }
      onChange(new Date(y, month));
    },
    [m]
  );
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
  weekdays?: boolean | string[]
}): React$Node {
  let { date, onChange } = React.useContext(DateContext);
  let dayMatrix = React.useMemo(
    () => {
      let d = 1;
      let dm = [];
      let buildDate = (d: number) => new Date(date.getFullYear(), date.getMonth(), d);
      while (true) {
        if (buildDate(d).getMonth() !== buildDate(d + 1).getMonth()) {
          if (dm[dm.length - 1].length === dayNames.length) {
            dm.push([buildDate(d)]);
          } else {
            dm[dm.length - 1].push(buildDate(d));
          }
          let i = dayNames.indexOf(
            buildDate(d)
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
          buildDate(d)
            .toString()
            .toLowerCase()
            .startsWith(dayNames[0].toLowerCase())
        ) {
          dm.push([buildDate(d)]);
        } else if (d === 1) {
          let i = dayNames.indexOf(
            buildDate(d)
              .toString()
              .slice(0, 3)
          );
          dm.push([]);
          while (i--) {
            dm[0].push(null);
          }
          dm[0].push(buildDate(d));
        } else {
          dm[dm.length - 1].push(buildDate(d));
        }
        d++;
      }
      return dm;
    },
    [date.getMonth()]
  );
  let getDayStyle = (d: null | boolean): void => {
    return d ? props.selectedDayStyle || {} : {};
  };
  return (
    <table className={props.className}>
      <tbody>
        {props.weekdays && (
          <tr>
            {(Array.isArray(props.weekdays) ? props.weekdays : dayNames).map((d, i) => (
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
                  textAlign: 'center',
                  userSelect: 'none',
                  padding: '0.421rem',
                  borderRadius: '0.221rem',
                  cursor: day ? 'pointer' : 'default',
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
let DateContext = React.createContext({});

export { Calendar, MonthCycler, DateContext };
