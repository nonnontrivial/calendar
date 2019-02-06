# calendar

> simple, selectable dates for React

requires the following:

```
react@latest react-dom@latest
```

## Installation

```
npm i -S @nonnontrivial/calendar
```

## An Example

```js
import { DateContext, MonthCycler, Calendar } from '@nonnontrivial/calendar';

function Sundial(props) {
  let [timeString, setTimeString] = React.useState(null);
  let onChange = React.useCallback(date => {
    setTimeString(date.toTimeString());
  }, []);
  return (
    <React.Fragment>
      <marquee>{timeString}</marquee>
      <DateContext.Provider value={{ onChange }}>
        <MonthCycler />
        <Calendar />
      </DateContext.Provider>
    </React.Fragment>
  );
}
```
