import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LocationBadge from '../index';

describe('LocationBadge', () => {
  it('should not render when placeLabel is missing', () => {
    const { container } = render(
      <LocationBadge placeLabel="" distance={2.5} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render with placeLabel', () => {
    render(
      <LocationBadge placeLabel="Oakland, CA" distance={2.5} />
    );

    expect(screen.getByText(/Oakland, CA/i)).toBeInTheDocument();
  });

  it('should display distance in km when >= 1km', () => {
    render(
      <LocationBadge placeLabel="Oakland, CA" distance={2.567} />
    );

    expect(screen.getByText(/2\.6 km away/i)).toBeInTheDocument();
  });

  it('should display distance in meters when < 1km', () => {
    render(
      <LocationBadge placeLabel="Oakland, CA" distance={0.5} />
    );

    expect(screen.getByText(/500 m away/i)).toBeInTheDocument();
  });

  it('should not show distance when not provided', () => {
    render(
      <LocationBadge placeLabel="Oakland, CA" />
    );

    expect(screen.queryByText(/away/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Oakland, CA/i)).toBeInTheDocument();
  });

  it('should render default variant with location icon', () => {
    const { container } = render(
      <LocationBadge placeLabel="Oakland, CA" variant="default" />
    );

    const icon = container.querySelector('[data-testid="LocationOnIcon"]');
    expect(icon).toBeInTheDocument();
  });

  it('should render chip variant', () => {
    const { container } = render(
      <LocationBadge placeLabel="Oakland, CA" variant="chip" />
    );

    const chip = container.querySelector('.MuiChip-root');
    expect(chip).toBeInTheDocument();
  });

  it('should apply small size class', () => {
    const { container } = render(
      <LocationBadge placeLabel="Oakland, CA" size="small" variant="default" />
    );

    const badge = container.querySelector('.MuiBox-root');
    expect(badge).toHaveStyle({ fontSize: '0.75rem' });
  });

  it('should apply medium size class', () => {
    const { container } = render(
      <LocationBadge placeLabel="Oakland, CA" size="medium" variant="default" />
    );

    const badge = container.querySelector('.MuiBox-root');
    expect(badge).toHaveStyle({ fontSize: '0.875rem' });
  });

  it('should format very small distances correctly', () => {
    render(
      <LocationBadge placeLabel="Oakland, CA" distance={0.05} />
    );

    expect(screen.getByText(/50 m away/i)).toBeInTheDocument();
  });

  it('should format large distances correctly', () => {
    render(
      <LocationBadge placeLabel="Oakland, CA" distance={15.789} />
    );

    expect(screen.getByText(/15\.8 km away/i)).toBeInTheDocument();
  });

  it('should show place and distance together', () => {
    render(
      <LocationBadge placeLabel="San Francisco, CA" distance={3.2} />
    );

    expect(screen.getByText(/San Francisco, CA/i)).toBeInTheDocument();
    expect(screen.getByText(/3\.2 km away/i)).toBeInTheDocument();
  });
});
