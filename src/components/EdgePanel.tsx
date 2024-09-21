import { Edge, MarkerType } from "@xyflow/react";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import {
    PiArrowLeftBold,
    PiArrowLeftFill,
    PiArrowRightBold,
    PiArrowRightFill,
    PiMinusBold,
} from "react-icons/pi";
import zeroManyStartIcon from "../images/zero-many-start.svg";
import zeroManyEndIcon from "../images/zero-many-end.svg";
import zeroOneStartIcon from "../images/zero-one-start.svg";
import zeroOneEndIcon from "../images/zero-one-end.svg";
import oneIcon from "../images/one.svg";
import manyStartIcon from "../images/many-start.svg";
import manyEndIcon from "../images/many-end.svg";
import onlyOneIcon from "../images/only-one.svg";
import oneManyStartIcon from "../images/one-many-start.svg";
import oneManyEndIcon from "../images/one-many-end.svg";
import { IoCloseSharp } from "react-icons/io5";

type CustomMarkerType =
    | MarkerType.Arrow
    | MarkerType.ArrowClosed
    | "none"
    | "ManyStart"
    | "ManyEnd"
    | "ZeroManyStart"
    | "ZeroManyEnd"
    | "ZeroOneStart"
    | "ZeroOneEnd"
    | "OneStart"
    | "OneEnd"
    | "OnlyOneStart"
    | "OnlyOneEnd"
    | "OneManyStart"
    | "OneManyEnd";

const EdgePanel = ({
    selectedEdge,
    setEdges,
    edges,
    setSelectedEdge,
}: {
    selectedEdge: any;
    edges: Edge[];
    setEdges: (edges: Edge[]) => void;
    setSelectedEdge: (edge: Edge | null) => void;
}) => {
    const [markerStart, setMarkerStart] = useState<CustomMarkerType>(
        selectedEdge.markerStart?.type || "none",
    );
    const [markerEnd, setMarkerEnd] = useState<CustomMarkerType>(
        selectedEdge.markerEnd?.type || "none",
    );

    const modifyMarker = (
        markerLocation: "markerStart" | "markerEnd",
        newMarker: CustomMarkerType,
    ) => {
        if (markerLocation === "markerStart") setMarkerStart(newMarker);
        if (markerLocation === "markerEnd") setMarkerEnd(newMarker);
        const updatedEdges = edges.map((edge: Edge) => {
            if (edge.id === selectedEdge.id) {
                return {
                    ...edge,
                    [markerLocation]: {
                        type: newMarker,
                        width: 30,
                        height: 30,
                    },
                };
            }
            return edge;
        });
        setEdges(updatedEdges);
    };

    const [edgeInput, setEdgeInput] = useState(selectedEdge?.data?.label || "");
    const [sourceInput, setSourceInput] = useState(
        selectedEdge?.data?.sourceLabel || "",
    );

    const [targetInput, setTargetInput] = useState(
        selectedEdge?.data?.targetLabel || "",
    );

    const modifyEdgeLabel = () => {
        const updatedEdges = edges.map((edge: Edge) => {
            if (edge.id === selectedEdge.id) {
                return {
                    ...edge,
                    data: {
                        ...edge.data, // keep existing data properties
                        label: edgeInput, // update label with input value
                        sourceLabel: sourceInput,
                        targetLabel: targetInput,
                    },
                };
            }
            return edge;
        });

        setEdges(updatedEdges);
    };

    useEffect(() => {
        modifyEdgeLabel();
    }, [edgeInput, sourceInput, targetInput]);

    return (
        <div style={{ position: "relative" }}>
            <EdgePanelWrapper>
                <CloseButton onClick={() => setSelectedEdge(null)}>
                    <IoCloseSharp size="1.2rem" />
                </CloseButton>
                <PanelHeader>Edge Options</PanelHeader>
                <div>
                    <Title>Markers</Title>
                    <FlexCol>
                        Start
                        <Flex>
                            <MarkerBtn
                                selected={markerStart === "none"}
                                onClick={() => modifyMarker("markerStart", "none")}
                            >
                                <PiMinusBold />
                            </MarkerBtn>
                            <MarkerBtn
                                selected={markerStart === MarkerType.Arrow}
                                onClick={() => modifyMarker("markerStart", MarkerType.Arrow)}
                            >
                                <PiArrowLeftBold />
                            </MarkerBtn>
                            <MarkerBtn
                                selected={markerStart === MarkerType.ArrowClosed}
                                onClick={() =>
                                    modifyMarker("markerStart", MarkerType.ArrowClosed)
                                }
                            >
                                <PiArrowLeftFill />
                            </MarkerBtn>
                            <MarkerBtn
                                selected={markerStart === "ZeroOneStart"}
                                onClick={() => modifyMarker("markerStart", "ZeroOneStart")}
                            >
                                <img src={zeroOneStartIcon} />
                            </MarkerBtn>
                            <MarkerBtn
                                selected={markerStart === "OneStart"}
                                onClick={() => modifyMarker("markerStart", "OneStart")}
                            >
                                <img src={oneIcon} />
                            </MarkerBtn>
                            <MarkerBtn
                                selected={markerStart === "OnlyOneStart"}
                                onClick={() => modifyMarker("markerStart", "OnlyOneStart")}
                            >
                                <img src={onlyOneIcon} />
                            </MarkerBtn>

                            <MarkerBtn
                                selected={markerStart === "ZeroManyStart"}
                                onClick={() => modifyMarker("markerStart", "ZeroManyStart")}
                            >
                                <img src={zeroManyStartIcon} />
                            </MarkerBtn>
                            <MarkerBtn
                                selected={markerStart === "OneManyStart"}
                                onClick={() => modifyMarker("markerStart", "OneManyStart")}
                            >
                                <img src={oneManyStartIcon} />
                            </MarkerBtn>
                            <MarkerBtn
                                selected={markerStart === "ManyStart"}
                                onClick={() => modifyMarker("markerStart", "ManyStart")}
                            >
                                <img src={manyStartIcon} />
                            </MarkerBtn>
                        </Flex>
                        End
                        <Flex>
                            <MarkerBtn
                                selected={markerEnd === "none"}
                                onClick={() => modifyMarker("markerEnd", "none")}
                            >
                                <PiMinusBold />
                            </MarkerBtn>
                            <MarkerBtn
                                selected={markerEnd === "arrow"}
                                onClick={() => modifyMarker("markerEnd", MarkerType.Arrow)}
                            >
                                <PiArrowRightBold />
                            </MarkerBtn>
                            <MarkerBtn
                                selected={markerEnd === MarkerType.ArrowClosed}
                                onClick={() =>
                                    modifyMarker("markerEnd", MarkerType.ArrowClosed)
                                }
                            >
                                <PiArrowRightFill />
                            </MarkerBtn>
                            <MarkerBtn
                                selected={markerEnd === "ZeroOneEnd"}
                                onClick={() => modifyMarker("markerEnd", "ZeroOneEnd")}
                            >
                                <img src={zeroOneEndIcon} />
                            </MarkerBtn>

                            <MarkerBtn
                                selected={markerEnd === "OneEnd"}
                                onClick={() => modifyMarker("markerEnd", "OneEnd")}
                            >
                                <img src={oneIcon} />
                            </MarkerBtn>
                            <MarkerBtn
                                selected={markerEnd === "OnlyOneEnd"}
                                onClick={() => modifyMarker("markerEnd", "OnlyOneEnd")}
                            >
                                <img src={onlyOneIcon} />
                            </MarkerBtn>
                            <MarkerBtn
                                selected={markerEnd === "ZeroManyEnd"}
                                onClick={() => modifyMarker("markerEnd", "ZeroManyEnd")}
                            >
                                <img src={zeroManyEndIcon} />
                            </MarkerBtn>
                            <MarkerBtn
                                selected={markerEnd === "OneManyEnd"}
                                onClick={() => modifyMarker("markerEnd", "OneManyEnd")}
                            >
                                <img src={oneManyEndIcon} />
                            </MarkerBtn>

                            <MarkerBtn
                                selected={markerEnd === "ManyEnd"}
                                onClick={() => modifyMarker("markerEnd", "ManyEnd")}
                            >
                                <img src={manyEndIcon} />
                            </MarkerBtn>
                        </Flex>
                    </FlexCol>
                </div>
                <div style={{ marginTop: "5px" }}>
                    <Title>
                        <label htmlFor="edge-name">Edge Label</label>
                    </Title>
                    <Input
                        name="edge-name"
                        type="text"
                        value={edgeInput}
                        onChange={(e) => setEdgeInput(e.target.value)}
                        placeholder="e.g. 'Contains'"
                    />
                </div>
                <div style={{ marginTop: "5px" }}>
                    <Title>
                        <label htmlFor="edge-name">Source Label</label>
                    </Title>
                    <Input
                        name="edge-name"
                        type="text"
                        value={sourceInput}
                        onChange={(e) => setSourceInput(e.target.value)}
                        placeholder="e.g. '0'"
                    />
                </div>
                <div style={{ marginTop: "5px" }}>
                    <Title>
                        <label htmlFor="edge-name">Destination Label</label>
                    </Title>
                    <Input
                        name="edge-name"
                        type="text"
                        value={targetInput}
                        onChange={(e) => setTargetInput(e.target.value)}
                        placeholder="e.g. '0'"
                    />
                </div>
            </EdgePanelWrapper>
        </div>
    );
};

export default EdgePanel;

const EdgePanelWrapper = styled.div`
  position: absolute;
  border-radius: 20px;
  top: 15px;
  right: 15px;
  padding: 20px;
  width: 290px;
  //height: 450px;
  color: white;
  z-index: 4;
  border: 2px solid #2c2d33;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow:
    rgba(0, 0, 0, 0.25) 0px 14px 28px,
    rgba(0, 0, 0, 0.22) 0px 10px 10px;
`;

const PanelHeader = styled.h1`
  font-size: 1rem;
  line-height: 0.5;
  text-transform: uppercase;
  color: #777777;
  font-weight: 600;
  letter-spacing: 0.05rem;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Title = styled.div`
  font-weight: 600;
  margin-bottom: 3px;
  font-size: 1.2rem;
`;

const MarkerBtn = styled.button<{ selected: boolean }>`
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: #323232ff;
  border: 1px solid #666666ff;
  color: #ccccccff;
  border-radius: 5px;
  cursor: pointer;
  ${({ selected }) =>
        selected &&
        css`
      background: #3d57dcff;
      color: white;
    `}
`;

const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Input = styled.input`
  background: none;
  border: none;
  color: white;
  border-bottom: 1px solid #424242;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 15px;
  z-index: 5;
  background: none;
  border: none;
  color: #777777;
  cursor: pointer;
`;
