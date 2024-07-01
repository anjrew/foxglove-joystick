import React from "react";

export function generateButton(
  value: number,
  x: number,
  y: number,
  text: string,
  radius: number,
  onPointerDown: (e: React.PointerEvent) => void,
  onPointerUp: (e: React.PointerEvent) => void,
): React.ReactElement {
  return (
    <g key={`button-${x}-${y}`}>
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={value > 0 ? "red" : "gray"}
        stroke="black"
        strokeWidth="2"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      />
      <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill="white">
        {text}
      </text>
    </g>
  );
}

export function generateStick(
  xValue: number,
  yValue: number,
  buttonValue: number,
  x: number,
  y: number,
  radius: number,
  onPointerDown: (e: React.PointerEvent) => void,
  onPointerMove: (e: React.PointerEvent) => void,
  onPointerUp: (e: React.PointerEvent) => void,
): React.ReactElement {
  return (
    <g key={`stick-${x}-${y}`}>
      <circle cx={x} cy={y} r={radius} fill="lightgray" stroke="black" strokeWidth="2" />
      <circle
        cx={x + xValue * radius}
        cy={y + yValue * radius}
        r={radius / 2}
        fill={buttonValue > 0 ? "red" : "gray"}
        stroke="black"
        strokeWidth="2"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />
    </g>
  );
}

export function generateDPad(
  xValue: number,
  yValue: number,
  x: number,
  y: number,
  size: number,
): React.ReactElement {
  const buttonSize = size / 3;
  return (
    <g key={`dpad-${x}-${y}`}>
      <rect
        x={x - size / 2}
        y={y - size / 2}
        width={size}
        height={size}
        fill="lightgray"
        stroke="black"
        strokeWidth="2"
      />
      <rect
        x={x - buttonSize / 2}
        y={y - size / 2}
        width={buttonSize}
        height={buttonSize}
        fill={yValue < -0.5 ? "red" : "gray"}
        stroke="black"
        strokeWidth="2"
      />
      <rect
        x={x - buttonSize / 2}
        y={y + size / 2 - buttonSize}
        width={buttonSize}
        height={buttonSize}
        fill={yValue > 0.5 ? "red" : "gray"}
        stroke="black"
        strokeWidth="2"
      />
      <rect
        x={x - size / 2}
        y={y - buttonSize / 2}
        width={buttonSize}
        height={buttonSize}
        fill={xValue < -0.5 ? "red" : "gray"}
        stroke="black"
        strokeWidth="2"
      />
      <rect
        x={x + size / 2 - buttonSize}
        y={y - buttonSize / 2}
        width={buttonSize}
        height={buttonSize}
        fill={xValue > 0.5 ? "red" : "gray"}
        stroke="black"
        strokeWidth="2"
      />
    </g>
  );
}

export function generateBar(
  value: number,
  x: number,
  y: number,
  rotation: number,
): React.ReactElement {
  const width = 60;
  const height = 20;
  const filledWidth = ((value + 1) * width) / 2;

  return (
    <g key={`bar-${x}-${y}`} transform={`translate(${x}, ${y}) rotate(${rotation})`}>
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        fill="lightgray"
        stroke="black"
        strokeWidth="2"
      />
      <rect x={-width / 2} y={-height / 2} width={filledWidth} height={height} fill="blue" />
    </g>
  );
}
