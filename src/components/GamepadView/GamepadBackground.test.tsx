import { render } from '@testing-library/react';
import { GamepadBackground } from './GamepadBackground';

describe('GamepadBackground', () => {
    it('renders Steam Deck background', () => {
        const { container } = render(<GamepadBackground layoutName="steamdeck" />);
        expect(container.querySelector('path')).toBeInTheDocument();
    });

    it('renders Xbox background', () => {
        const { container } = render(<GamepadBackground layoutName="xbox" />);
        expect(container.querySelector('path')).toBeInTheDocument();
    });

    it('renders iPega background', () => {
        const { container } = render(<GamepadBackground layoutName="ipega-9083s" />);
        expect(container.querySelector('path')).toBeInTheDocument();
    });

    it('renders empty background with message for unknown layout', () => {
        const { container } = render(<GamepadBackground layoutName="unknown" />);
        const gElement = container.querySelector('g');
        expect(gElement).toBeInTheDocument();
        expect(gElement).toHaveTextContent('Unknown Layout:');
    });
});