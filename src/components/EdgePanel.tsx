import { Edge, MarkerType } from "@xyflow/react";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import {
  PiArrowRightBold,
  PiArrowRightFill,
  PiMinusBold,
} from "react-icons/pi";
import crowsFootEndIcon from "../images/crows-foot-end.svg";
import crowsFootStartIcon from "../images/crows-foot-start.svg";

type CustomMarkerType =
  | MarkerType.Arrow
  | MarkerType.ArrowClosed
  | "none"
  | "CrowsFootEnd"
  | "CrowsFootStart";

const EdgePanel = ({
  selectedEdge,
  setEdges,
  edges,
}: {
  selectedEdge: any;
  edges: Edge[];
  setEdges: (edges: Edge[]) => void;
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

  const [inputValue, setInputValue] = useState(selectedEdge?.data?.label || "");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value); // update inputValue state with input value
  };
  const modifyEdgeLabel = () => {
    const updatedEdges = edges.map((edge: Edge) => {
      if (edge.id === selectedEdge.id) {
        return {
          ...edge,
          data: {
            ...edge.data, // keep existing data properties
            label: inputValue, // update label with input value
          },
        };
      }
      return edge;
    });

    setEdges(updatedEdges);
  };

  useEffect(() => {
    modifyEdgeLabel();
  }, [inputValue]);

  return (
    <div style={{ position: "relative" }}>
      <EdgePanelWrapper>
        <div>
          <Title>Cardinality</Title>
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
                <PiArrowRightBold />
              </MarkerBtn>
              <MarkerBtn
                selected={markerStart === MarkerType.ArrowClosed}
                onClick={() =>
                  modifyMarker("markerStart", MarkerType.ArrowClosed)
                }
              >
                <PiArrowRightFill />
              </MarkerBtn>
              <MarkerBtn
                selected={markerStart === "CrowsFootStart"}
                onClick={() => modifyMarker("markerStart", "CrowsFootStart")}
              >
                <img src={crowsFootStartIcon} />
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
                selected={markerEnd === "CrowsFootEnd"}
                onClick={() => modifyMarker("markerEnd", "CrowsFootEnd")}
              >
                <img src={crowsFootEndIcon} />
              </MarkerBtn>
            </Flex>
          </FlexCol>
        </div>
        <div style={{ marginTop: "5px" }}>
          <Title>
            <label htmlFor="edge-name">Label</label>
          </Title>
          <Input
            name="edge-name"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="e.g. 'Contains'"
          />
        </div>
      </EdgePanelWrapper>
    </div>
  );
};

export default EdgePanel;

const EdgePanelWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  border-radius: 20px;
  padding: 20px;
  width: 230px;
  height: 270px;
  color: white;
  z-index: 4;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Title = styled.div`
  font-weight: bold;
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
