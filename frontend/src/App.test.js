import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';
import axios from 'axios';

jest.mock('axios', () => {
  return {
    get: jest.fn()
  };
});

describe('App component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders x status', async () => {
    axios.get.mockResolvedValueOnce({ status: 200 });

    render(<App />);

    await waitFor(() => expect(screen.getByText('Healthy')).toBeInTheDocument());
  });
});
