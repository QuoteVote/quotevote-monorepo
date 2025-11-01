import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LocationPermissionDialog from '../index';

describe('LocationPermissionDialog', () => {
  const mockOnAllow = jest.fn();
  const mockOnDeny = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when open is false', () => {
    const { container } = render(
      <LocationPermissionDialog
        open={false}
        onAllow={mockOnAllow}
        onDeny={mockOnDeny}
        onClose={mockOnClose}
      />
    );

    expect(container.querySelector('.MuiDialog-root')).not.toBeInTheDocument();
  });

  it('should render when open is true', () => {
    render(
      <LocationPermissionDialog
        open={true}
        onAllow={mockOnAllow}
        onDeny={mockOnDeny}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/Enable Location Access/i)).toBeInTheDocument();
  });

  it('should display privacy messaging', () => {
    render(
      <LocationPermissionDialog
        open={true}
        onAllow={mockOnAllow}
        onDeny={mockOnDeny}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/share your approximate location/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Guaranteed/i)).toBeInTheDocument();
  });

  it('should call onAllow when Allow button is clicked', () => {
    render(
      <LocationPermissionDialog
        open={true}
        onAllow={mockOnAllow}
        onDeny={mockOnDeny}
        onClose={mockOnClose}
      />
    );

    const allowButton = screen.getByRole('button', { name: /Allow/i });
    fireEvent.click(allowButton);

    expect(mockOnAllow).toHaveBeenCalledTimes(1);
  });

  it('should call onDeny when Deny button is clicked', () => {
    render(
      <LocationPermissionDialog
        open={true}
        onAllow={mockOnAllow}
        onDeny={mockOnDeny}
        onClose={mockOnClose}
      />
    );

    const denyButton = screen.getByRole('button', { name: /Not Now/i });
    fireEvent.click(denyButton);

    expect(mockOnDeny).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when close icon is clicked', () => {
    render(
      <LocationPermissionDialog
        open={true}
        onAllow={mockOnAllow}
        onDeny={mockOnDeny}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should have lock icon for privacy', () => {
    const { container } = render(
      <LocationPermissionDialog
        open={true}
        onAllow={mockOnAllow}
        onDeny={mockOnDeny}
        onClose={mockOnClose}
      />
    );

    const lockIcon = container.querySelector('[data-testid="LockIcon"]');
    expect(lockIcon).toBeInTheDocument();
  });

  it('should list privacy features', () => {
    render(
      <LocationPermissionDialog
        open={true}
        onAllow={mockOnAllow}
        onDeny={mockOnDeny}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText(/Only city\/neighborhood/i)).toBeInTheDocument();
    expect(screen.getByText(/No exact addresses/i)).toBeInTheDocument();
    expect(screen.getByText(/You control when to share/i)).toBeInTheDocument();
  });
});
