import {
  BaseEdge,
  EdgeProps,
  EdgeLabelRenderer,
  useInternalNode,
  getStraightPath,
} from "@xyflow/react";
import { getEdgeParams } from "../utils/utils";
import styled from "styled-components";

export default function CustomEdge({
  source,
  target,
  markerEnd,
  markerStart,
  data,
}: EdgeProps & { data: any }) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  if (!sourceNode || !targetNode) {
    return null;
  }
  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  const midX = (sx + tx) / 2;
  const midY = (sy + ty) / 2;

  return (
    <>
      <MarkerSVGs />
      <BaseEdge
        style={{ strokeWidth: 1.5 }}
        path={edgePath}
        markerEnd={markerEnd}
        markerStart={markerStart}
      />
      <EdgeLabelRenderer>
        <Label $midX={midX} $midY={midY}>
          {data?.label}
        </Label>
      </EdgeLabelRenderer>
    </>
  );
}

interface LabelProps {
  $midX: number;
  $midY: number;
}
const Label = styled.div<LabelProps>`
  position: absolute;
  transform: translate(-50%, -50%);
  left: ${({ $midX }) => `${$midX}px`};
  top: ${({ $midY }) => `${$midY}px`};
  color: white;
  padding: 2px 4px;
  border-radius: 4px;
  pointer-events: none;
  font-size: 0.8rem;
`;

const MarkerSVGs = () => {
  return (
    <svg style={{ position: "absolute", top: 0, left: 0 }}>
      <defs>
        <marker
          id="1__height=30&type=CrowsFootEnd&width=30"
          viewBox="0 0 40 40"
          markerHeight={60}
          markerWidth={60}
          refX={12}
          refY={11.4}
          orient="auto"
        >
          <g transform="matrix(1,0,0,1,-218.097,-228.667)">
            <g transform="matrix(1,0,0,1,206.44,227.186)">
              <path
                d="M12.997,12.725L33.374,2.821M12.997,12.725L33.374,22.596"
                style={{
                  fill: "white",
                  stroke: "rgb(106,106,106)",
                  strokeWidth: "0.65px",
                }}
              />
            </g>
            <g transform="matrix(1,0,0,1,206.44,227.186)">
              <path
                d="M12.997,12.725L33.374,12.725"
                style={{
                  fill: "none",
                  stroke: "rgb(106,106,106)",
                  strokeWidth: "0.65px",
                }}
              />
            </g>
          </g>
        </marker>
        <marker
          id="1__height=30&type=CrowsFootStart&width=30"
          viewBox="0 0 40 40"
          markerHeight={60}
          markerWidth={60}
          refX={12}
          refY={11.4}
          orient="auto"
        >
          <g transform="matrix(1,0,0,1,-291.263,-233.619)">
            <g transform="matrix(-1,0,0,1,325.977,232.138)">
              <path
                d="M12.997,12.725L33.374,2.821M12.997,12.725L33.374,22.596"
                style={{
                  fill: "white",
                  stroke: "rgb(106,106,106)",
                  strokeWidth: "0.65px",
                }}
              />
            </g>
            <g transform="matrix(-1,0,0,1,325.977,232.138)">
              <path
                d="M12.997,12.725L33.374,12.725"
                style={{
                  fill: "none",
                  stroke: "rgb(106,106,106)",
                  strokeWidth: "0.65px",
                }}
              />
            </g>
          </g>{" "}
        </marker>
      </defs>
    </svg>
  );
};
