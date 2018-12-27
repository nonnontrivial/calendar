import { render, cleanup, fireEvent } from 'react-testing-library';
import { withProfiler } from 'jest-react-profiler';
import React from 'react';
import { dayNames, monthNames } from '../util';
import { Calendar, MonthCycler, DateContext } from '../';

afterEach(cleanup);

function renderWithContext(Component, value, componentProps = {}) {
  return render(
    <DateContext.Provider value={{ date: new Date(), onChange: jest.fn(), ...value }}>
      <Component {...componentProps} />
    </DateContext.Provider>
  );
}

test('DateContext can accomodate arbitrary date range', () => {
  let onChange = jest.fn();
  let value = { date: new Date(), onChange };
  let { container, getByText, rerender } = render(
    <DateContext.Provider value={value}>
      <MonthCycler />
      <Calendar />
    </DateContext.Provider>
  );
  let i = 1000;
  while (i--) {
    fireEvent.click(getByText('←'));
  }
  expect(onChange).toHaveBeenCalledTimes(1000);
  expect(getByText('1')).not.toBeUndefined();
  let y = new Date().getFullYear() + 1000;
  rerender(
    <DateContext.Provider value={{ ...value, date: new Date(y, 0) }}>
      <MonthCycler />
      <Calendar />
    </DateContext.Provider>
  );
  expect(container.querySelector('p').textContent.endsWith(y)).toBe(true);
});

test('MonthCycler does not overcommit', () => {
  let { container, getByText } = renderWithContext(withProfiler(MonthCycler));
  expect(container.querySelector('p')).toHaveCommittedTimes(undefined);
  fireEvent.click(getByText('←'));
  expect(container.querySelector('p')).toHaveCommittedTimes(0);
});

test('MonthCycler accomodates className', () => {
  let { container } = renderWithContext(MonthCycler, {}, { className: 'c' });
  expect(container.querySelector('div').hasAttribute('class')).toBe(true);
});

test('MonthCycler throws if rendered without context', () => {
  expect(() => render(<MonthCycler />)).toThrow();
});

test('Calendar throws if rendered without context', () => {
  expect(() => render(<Calendar />)).toThrow();
});

test('Calendar does not overcommit', () => {
  let day = new Date().getDate().toString();
  let { container, getByText } = renderWithContext(withProfiler(Calendar));
  expect(container.querySelector('table')).toHaveCommittedTimes(undefined);
  let i = 10;
  while (i--) {
    fireEvent.click(getByText(day));
  }
  expect(container.querySelector('table')).toHaveCommittedTimes(0);
});

test('Calendar accomodates className', () => {
  let className = 'c';
  let { container, debug } = renderWithContext(Calendar, {}, { className });
  expect(container.querySelector('table').hasAttribute('class')).toBe(true);
});

test('Calendar spreads day style over selected day', () => {
  let selectedDayStyle = { opacity: '0.5', fontSize: '2rem' };
  let { getByText } = renderWithContext(Calendar, {}, { selectedDayStyle });
  expect(
    getByText(new Date().getDate().toString())
      .getAttribute('style')
      .endsWith('opacity: 0.5; font-size: 2rem;')
  ).toBe(true);
});

test('Calendar can render day names', () => {
  let { getByText } = renderWithContext(Calendar, {}, { weekdays: true });
  dayNames.forEach(d => expect(getByText(d)).not.toBeUndefined());
});

test('Calendar renders array of weekdays', () => {
  let weekdays = ['S', 'M', 'T'];
  let { container } = renderWithContext(Calendar, {}, { weekdays });
  expect(container.querySelector('tr').textContent).toBe(weekdays.join(''));
});

test('Calendar passes selected date to onChange', () => {
  let onChange = jest.fn();
  let { container, getByText } = renderWithContext(Calendar, { onChange });
  expect(container.querySelector('td')).not.toBeUndefined();
  fireEvent.click(getByText('1'));
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(
    new Date(new Date().getFullYear(), new Date().getMonth())
  );
});
