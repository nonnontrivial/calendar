// @flow

import React from 'react';
import { dayNames, monthNames } from './util';

function MonthCycler(props: { className?: string }): React$Node {
  const { date, onChange } = React.useContext(DateContext);
  const m = date.getMonth();
  const y = date.getFullYear();
  const onPrev = React.useCallback(() => {
    const month = (m - 1 + monthNames.length) % monthNames.length;
    if (m === 0) {
      y -= 1;
    }
    onChange(new Date(y, month));
  }, [m]);
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
  const dayMatrix = React.useMemo(() => {
    let d = 1;
    const dm = [];
    const buildDate = (d: number) => new Date(date.getFullYear(), date.getMonth(), d);
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
  }, [date.getMonth()]);
  const getDefaultDayStyle = (d: null | boolean): void => {
    return {
      textAlign: 'center',
      userSelect: 'none',
      padding: '0.421rem',
      borderRadius: '0.221rem',
      cursor: d ? 'pointer' : 'default'
    };
  };
  const getDayStyle = (d: null | boolean): void => {
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
