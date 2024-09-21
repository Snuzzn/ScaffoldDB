import {
    BaseEdge,
    EdgeProps,
    EdgeLabelRenderer,
    useInternalNode,
    getStraightPath,
} from "@xyflow/react";
import styled from "styled-components";
import { getEdgeParams } from "../utils/edgeUtils";

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

    const offsetSX = tx > sx ? 15 : -15;
    const offsetSY = ty > sy ? 50 : -10;

    const offsetTX = sx > tx ? 15 : -15; // Right if source is to the left, left if to the right
    const offsetTY = sy > ty ? 50 : -10; // Up if source is above, down if below

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
                <EndpointLabel
                    transform={`translate(-45%, -100%) translate(${sx + offsetSX}px, ${sy + offsetSY}px)`}
                    label={data.sourceLabel}
                />
                <Label $midX={midX} $midY={midY}>
                    {data?.label}
                </Label>
                <EndpointLabel
                    transform={`translate(-45%, -100%) translate(${tx + offsetTX}px, ${ty + offsetTY}px)`}
                    label={data.targetLabel}
                />
            </EdgeLabelRenderer>
        </>
    );
}

function EndpointLabel({
    transform,
    label,
}: {
    transform: string;
    label: string;
}) {
    return (
        <EndpointLabelWrapper className="nodrag nopan" $transform={transform}>
            {label}
        </EndpointLabelWrapper>
    );
}

const EndpointLabelWrapper = styled.div<{ $transform: string }>`
  position: absolute;
  background: transparent;
  padding: 10px;
  color: white;
  font-size: 12px;
  font-weight: 700;
  transform: ${({ $transform }) => $transform};
`;

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
                    id="1__height=30&type=ManyStart&width=30"
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
                    </g>
                </marker>
                <marker
                    id="1__height=30&type=ManyEnd&width=30"
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
                    id="1__height=30&type=ZeroManyStart&width=30"
                    viewBox="0 0 32 22"
                    refX="8"
                    refY="11.5"
                    markerWidth="25"
                    markerHeight="17"
                    orient="auto"
                >
                    <path
                        d="m12.997 12.725 20.377-9.904m-20.377 9.904 20.377 9.871"
                        style={{
                            fill: "#fff",
                            fillRule: "nonzero",
                            stroke: "#6a6a6a",
                            strokeWidth: ".8px",
                        }}
                        transform="matrix(-1 0 0 1 35.023 -1.172)"
                    />
                    <circle
                        cx={233.062}
                        cy={295.933}
                        r={5.82}
                        style={{
                            fill: "#141414",
                            stroke: "#6a6a6a",
                            strokeWidth: "1.07px",
                            strokeLinejoin: "round",
                            strokeMiterlimit: 1.5,
                        }}
                        transform="matrix(-.74877 0 0 .74877 200.892 -210.048)"
                    />
                    <path
                        d="M12.997 12.725h20.377"
                        style={{
                            fill: "none",
                            fillRule: "nonzero",
                            stroke: "#6a6a6a",
                            strokeWidth: ".8px",
                        }}
                        transform="matrix(-1 0 0 1 35.023 -1.172)"
                    />{" "}
                </marker>

                <marker
                    id="1__height=30&type=ZeroManyEnd&width=30"
                    viewBox="0 0 30 22"
                    refX="24"
                    refY="11.5"
                    markerWidth="25"
                    markerHeight="17"
                    orient="auto"
                >
                    <path
                        d="m12.997 12.725 20.377-9.904m-20.377 9.904 20.377 9.871"
                        style={{
                            fill: "#fff",
                            fillRule: "nonzero",
                            stroke: "#6a6a6a",
                            strokeWidth: ".8px",
                        }}
                        transform="translate(-3.881 -1.172)"
                    />
                    <circle
                        cx={233.062}
                        cy={295.933}
                        r={5.82}
                        style={{
                            fill: "#141414",
                            stroke: "#6a6a6a",
                            strokeWidth: "1.07px",
                            strokeLinejoin: "round",
                            strokeMiterlimit: 1.5,
                        }}
                        transform="matrix(.74877 0 0 .74877 -169.75 -210.048)"
                    />
                    <path
                        d="M12.997 12.725h20.377"
                        style={{
                            fill: "none",
                            fillRule: "nonzero",
                            stroke: "#6a6a6a",
                            strokeWidth: ".8px",
                        }}
                        transform="translate(-3.881 -1.172)"
                    />
                </marker>
                <marker
                    id="1__height=30&type=OneManyStart&width=30"
                    viewBox="0 0 32 22"
                    refX="4"
                    refY="11.5"
                    markerWidth="25"
                    markerHeight="17"
                    orient="auto"
                >
                    <path
                        d="m12.997 12.725 20.377-9.904m-20.377 9.904 20.377 9.871"
                        style={{
                            fill: "#fff",
                            fillRule: "nonzero",
                            stroke: "#6a6a6a",
                            strokeWidth: ".8px",
                        }}
                        transform="matrix(-1 0 0 1 35.023 -1.173)"
                    />
                    <path
                        d="M12.997 12.725h20.377"
                        style={{
                            fill: "none",
                            fillRule: "nonzero",
                            stroke: "#6a6a6a",
                            strokeWidth: ".8px",
                        }}
                        transform="matrix(-1 0 0 1 35.023 -1.173)"
                    />
                    <path
                        d="M238.226 287.912v9.332"
                        style={{
                            fill: "none",
                            stroke: "#6a6a6a",
                            strokeWidth: ".61px",
                            strokeLinejoin: "round",
                            strokeMiterlimit: 1.5,
                        }}
                        transform="matrix(-1 0 0 1.27075 260.704 -360.257)"
                    />{" "}
                </marker>
                <marker
                    id="1__height=30&type=OneManyEnd&width=30"
                    viewBox="0 0 32 22"
                    refX="19"
                    refY="11.5"
                    markerWidth="25"
                    markerHeight="17"
                    orient="auto"
                >
                    <path
                        d="m12.997 12.725 20.377-9.904m-20.377 9.904 20.377 9.871"
                        style={{
                            fill: "#fff",
                            fillRule: "nonzero",
                            stroke: "#6a6a6a",
                            strokeWidth: ".8px",
                        }}
                        transform="translate(-11.348 -1.173)"
                    />
                    <path
                        d="M12.997 12.725h20.377"
                        style={{
                            fill: "none",
                            fillRule: "nonzero",
                            stroke: "#6a6a6a",
                            strokeWidth: ".8px",
                        }}
                        transform="translate(-11.348 -1.173)"
                    />
                    <path
                        d="M238.226 287.912v9.332"
                        style={{
                            fill: "none",
                            stroke: "#6a6a6a",
                            strokeWidth: ".61px",
                            strokeLinejoin: "round",
                            strokeMiterlimit: 1.5,
                        }}
                        transform="matrix(1 0 0 1.27075 -237.029 -360.257)"
                    />{" "}
                </marker>
                <marker
                    id="1__height=30&type=OnlyOneStart&width=30"
                    viewBox="0 0 32 22"
                    refX="-10"
                    refY="11.5"
                    markerWidth="25"
                    markerHeight="17"
                    orient="auto"
                >
                    <path
                        d="M238.226 287.912v9.332"
                        style={{
                            fill: "none",
                            stroke: "#6a6a6a",
                            strokeWidth: ".7px",
                        }}
                        transform="matrix(1.06523 0 0 2.39898 -253.115 -690.044)"
                    />
                    <path
                        d="M238.226 287.912v9.332"
                        style={{
                            fill: "none",
                            stroke: "#6a6a6a",
                            strokeWidth: ".7px",
                        }}
                        transform="matrix(1.06523 0 0 2.39898 -248.651 -690.044)"
                    />
                </marker>
                <marker
                    id="1__height=30&type=OnlyOneEnd&width=30"
                    viewBox="0 0 32 22"
                    refX="16"
                    refY="11.5"
                    markerWidth="25"
                    markerHeight="17"
                    orient="auto"
                >
                    <path
                        d="M238.226 287.912v9.332"
                        style={{
                            fill: "none",
                            stroke: "#6a6a6a",
                            strokeWidth: ".7px",
                        }}
                        transform="matrix(1.06523 0 0 2.39898 -253.115 -690.044)"
                    />
                    <path
                        d="M238.226 287.912v9.332"
                        style={{
                            fill: "none",
                            stroke: "#6a6a6a",
                            strokeWidth: ".7px",
                        }}
                        transform="matrix(1.06523 0 0 2.39898 -248.651 -690.044)"
                    />
                </marker>
                <marker
                    id="1__height=30&type=OneStart&width=30"
                    viewBox="0 0 32 22"
                    refX="-13"
                    refY="11.5"
                    markerWidth="25"
                    markerHeight="17"
                    orient="auto"
                >
                    <path
                        d="M238.226 287.912v9.332"
                        style={{
                            fill: "none",
                            stroke: "#6a6a6a",
                            strokeWidth: ".81px",
                        }}
                        transform="matrix(1.06523 0 0 2.01957 -253.115 -580.807)"
                    />{" "}
                </marker>
                <marker
                    id="1__height=30&type=OneEnd&width=30"
                    viewBox="0 0 32 22"
                    refX="13"
                    refY="11.5"
                    markerWidth="25"
                    markerHeight="17"
                    orient="auto"
                >
                    <path
                        d="M238.226 287.912v9.332"
                        style={{
                            fill: "none",
                            stroke: "#6a6a6a",
                            strokeWidth: ".81px",
                        }}
                        transform="matrix(1.06523 0 0 2.01957 -253.115 -580.807)"
                    />{" "}
                </marker>

                <marker
                    id="1__height=30&type=ZeroOneStart&width=30"
                    viewBox="0 0 32 22"
                    refX="-9"
                    refY="10"
                    markerWidth="25"
                    markerHeight="17"
                    orient="auto"
                >
                    <path
                        d="M238.226 287.912v9.332"
                        style={{
                            fill: "none",
                            stroke: "#6a6a6a",
                            strokeWidth: ".81px",
                        }}
                        transform="matrix(1.06523 0 0 2.01957 -253.115 -580.807)"
                    />
                    <circle
                        cx={233.062}
                        cy={295.933}
                        r={5.82}
                        style={{
                            fill: "#141414",
                            stroke: "#6a6a6a",
                            strokeWidth: "1.07px",
                        }}
                        transform="matrix(-.74877 0 0 .74877 185.347 -211.511)"
                    />{" "}
                </marker>
                <marker
                    id="1__height=30&type=ZeroOneEnd&width=30"
                    viewBox="0 0 32 22"
                    refX="25"
                    refY="10"
                    markerWidth="25"
                    markerHeight="17"
                    orient="auto"
                >
                    <path
                        d="M238.226 287.912v9.332"
                        style={{
                            fill: "none",
                            stroke: "#6a6a6a",
                            strokeWidth: ".81px",
                        }}
                        transform="matrix(-1.06523 0 0 2.01957 268.711 -580.807)"
                    />
                    <circle
                        cx={233.062}
                        cy={295.933}
                        r={5.82}
                        style={{
                            fill: "#141414",
                            stroke: "#6a6a6a",
                            strokeWidth: "1.07px",
                        }}
                        transform="matrix(.74877 0 0 .74877 -169.751 -211.511)"
                    />{" "}
                </marker>
            </defs>
        </svg>
    );
};
