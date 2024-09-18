import { ConnectionLineComponentProps, getStraightPath } from "@xyflow/react";

function CustomConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  connectionLineStyle,
  connectionStatus,
}: ConnectionLineComponentProps) {
  const [edgePath] = getStraightPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
  });

  return (
    <g>
      <path
        style={connectionLineStyle}
        className="animated"
        fill="none"
        d={edgePath}
      />
      <circle
        cx={toX}
        cy={toY}
        fill={connectionStatus === "valid" ? "#273ca8ff" : "white"}
        r={8}
        stroke="white"
        strokeWidth={1.5}
      />
    </g>
  );
}

export default CustomConnectionLine;
