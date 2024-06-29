import React from 'react';
import { render } from '@testing-library/react';
import { generateButton, generateBar, generateStick } from './gamepadUtils';

describe('gamepadUtils', () => {
  it('should render a button', () => {
    const mockDownCb = jest.fn();
    const mockUpCb = jest.fn();

    const { container } = render(generateButton(1, 50, 50, 'A', 18, mockDownCb, mockUpCb));

    const circle = container.querySelector('circle');
    const text = container.querySelector('text');

    expect(circle).toBeInTheDocument();
    expect(text).toBeInTheDocument();
    expect(text?.textContent).toBe('A');
  });

  it('should render a bar', () => {
    const { container } = render(generateBar(0.5, 50, 50, 90));

    const rects = container.querySelectorAll('rect');
    expect(rects).toHaveLength(2);
  });

  it('should render a stick', () => {
    const mockDownCb = jest.fn();
    const mockMoveCb = jest.fn();
    const mockUpCb = jest.fn();

    const { container } = render(
      generateStick(0.5, -0.5, 1, 50, 50, 30, mockDownCb, mockMoveCb, mockUpCb)
    );

    const circles = container.querySelectorAll('circle');
    expect(circles).toHaveLength(2);
  });
});
