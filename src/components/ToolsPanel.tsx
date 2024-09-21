import styled from "styled-components";
import EntityIcon from "../images/tools/entity.svg";
import RelationshipIcon from "../images/tools/relationship.svg";
import InheritanceIcon from "../images/tools/inheritance.svg";
import RelationIcon from "../images/tools/relation.svg";
import { NodeType } from "../nodes/types";
import { useEffect } from "react";

type ToolsPanelProps = {
  nodeType: NodeType | null;
  setNodeType: (nodeType: NodeType | null) => void;
};

const ToolsPanel = ({ nodeType, setNodeType }: ToolsPanelProps) => {
  useEffect(() => {
    const flowPane = document.querySelector(".react-flow__pane") as HTMLElement;

    if (flowPane) {
      if (nodeType !== null) {
        flowPane.style.cursor = "pointer"; // force the cursor to pointer
      } else {
        flowPane.style.cursor = ""; // reset to default when no node type is selected
      }
    }

    return () => {
      if (flowPane) {
        flowPane.style.cursor = "";
      }
    };
  }, [nodeType]);
  return (
    <Wrapper>
      <Button
        onClick={() => setNodeType("entity")}
        $isActive={nodeType === "entity"}
      >
        <img src={EntityIcon} />
      </Button>
      <Button
        onClick={() => setNodeType("relation")}
        $isActive={nodeType === "relation"}
      >
        <img src={RelationIcon} />
      </Button>
      <Button
        onClick={() => setNodeType("relationship")}
        $isActive={nodeType === "relationship"}
      >
        <img src={RelationshipIcon} />
      </Button>
      <Button
        onClick={() => setNodeType("inheritance")}
        $isActive={nodeType === "inheritance"}
      >
        <img src={InheritanceIcon} />
      </Button>
    </Wrapper>
  );
};

export default ToolsPanel;

const Wrapper = styled.div`
  position: absolute;
  z-index: 2;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 60px;
  height: 220px;
  border-radius: 10px;
  color: white;
  margin: auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    rgba(0, 0, 0, 0.25) 0px 14px 28px,
    rgba(0, 0, 0, 0.22) 0px 10px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

const Button = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  background: ${({ $isActive }) => ($isActive ? "#3d57dcff" : "none")};
  color: ${({ $isActive }) => ($isActive ? "#3d57dcff" : "white")};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
`;
