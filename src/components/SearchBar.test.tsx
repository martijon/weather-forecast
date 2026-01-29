import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('should render input and button', () => {
    render(<SearchBar onSearch={vi.fn()} isLoading={false} />);

    expect(screen.getByPlaceholderText('Enter city name...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('should call onSearch with city name when form is submitted', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchBar onSearch={onSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText('Enter city name...');
    await user.type(input, 'Sofia');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSearch).toHaveBeenCalledWith('Sofia');
  });

  it('should trim whitespace from city name', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchBar onSearch={onSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText('Enter city name...');
    await user.type(input, '  London  ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSearch).toHaveBeenCalledWith('London');
  });

  it('should not call onSearch when input is empty', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(<SearchBar onSearch={onSearch} isLoading={false} />);

    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('should disable input and button when loading', () => {
    render(<SearchBar onSearch={vi.fn()} isLoading={true} />);

    expect(screen.getByPlaceholderText('Enter city name...')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Loading...' })).toBeDisabled();
  });

  it('should disable button when input is empty', () => {
    render(<SearchBar onSearch={vi.fn()} isLoading={false} />);

    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });

  it('should enable button when input has value', async () => {
    const user = userEvent.setup();

    render(<SearchBar onSearch={vi.fn()} isLoading={false} />);

    const input = screen.getByPlaceholderText('Enter city name...');
    await user.type(input, 'Paris');

    expect(screen.getByRole('button', { name: 'Search' })).toBeEnabled();
  });
});
