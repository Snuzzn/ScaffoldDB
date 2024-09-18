import styled from "styled-components";
import EntityIcon from "../images/entity.svg";
import RelationshipIcon from "../images/relationship.svg";
import InheritanceIcon from "../images/inheritance.svg";
import RelationIcon from "../images/relation.svg";
import { NodeType } from "../nodes/types";

type ToolsPanelProps = {
  nodeType: NodeType | null;
  setNodeType: (nodeType: NodeType | null) => void;
};

const ToolsPanel = ({ nodeType, setNodeType }: ToolsPanelProps) => {
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
  height: 180px;
  border-radius: 10px;
  background: #1e1e1eff;
  color: white;
  margin: auto;
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
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
`;
