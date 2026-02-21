import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from "./ToastContext";
import '@testing-library/jest-dom';
import { act } from 'react';

const TestComponent = () => {
  const { addToast } = useToast();

  return (
    <button onClick={() =>
      addToast({
        message: 'Hello',
        type: 'success',
        duration: 3000
      })
    }>
      Add Toast
    </button>
  );
};

describe('ToastProvider', () => {

  it('renders toast when addToast is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Add Toast'));

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('removes toast after duration', () => {
  vi.useFakeTimers();

  render(
    <ToastProvider>
      <TestComponent />
    </ToastProvider>
  );

  fireEvent.click(screen.getByText('Add Toast'));

  expect(screen.getByText('Hello')).toBeInTheDocument();

  act(() => {
    vi.advanceTimersByTime(3000);
  });

  expect(screen.queryByText('Hello')).not.toBeInTheDocument();
});

});