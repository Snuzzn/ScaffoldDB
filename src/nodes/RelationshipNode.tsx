import { useReactFlow, type NodeProps } from "@xyflow/react";
import styled from "styled-components";
import { type RelationshipNode } from "./types";
import Handle from "../components/Handle";
import { useState } from "react";
import { NodeWrapper } from "./EntityNode";
import { calculateSize } from "../utils/nodeUtils";

export function RelationshipNode({
  data,
  id,
  selected,
}: NodeProps<RelationshipNode>) {
  const isActive = selected;
  const reactFlow = useReactFlow();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState(data.label || "");

  const handleLabelClick = () => {
    if (!isActive) return;
    setIsEditingLabel(true);
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelValue(e.target.value);
  };

  const handleLabelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (labelValue === "") return;
    setIsEditingLabel(false);

    reactFlow.setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: labelValue,
            },
          };
        }
        return node;
      }),
    );
  };
  const nodeSize = calculateSize(labelValue, 40, 85);

  return (
    <RelationshipWrapper
      className="react-flow__node-default"
      style={{ position: "relative" }}
      $isHovered={isHovered}
      $isActive={isActive}
      $size={nodeSize}
    >
      <Handle id={id} isHovered={isHovered} setIsHovered={setIsHovered} />
      <Body>
        {isEditingLabel ? (
          <form onSubmit={handleLabelSubmit}>
            <LabelInput
              value={labelValue}
              onChange={handleLabelChange}
              onBlur={handleLabelSubmit} // automatically submit on blur
              autoFocus
            />
          </form>
        ) : (
          <div onClick={handleLabelClick} style={{ cursor: "pointer" }}>
            {labelValue}
          </div>
        )}
      </Body>
    </RelationshipWrapper>
  );
}

const RelationshipWrapper = styled(NodeWrapper)<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transform: rotate(45deg);
`;

const Body = styled.div`
  font-size: 0.9em;
  color: white;
  text-align: center;
  transform: rotate(-45deg);
  z-index: 2;
`;

const LabelInput = styled.input`
  background: none;
  color: white;
  border: none;
  border-bottom: 1px solid #4e4c4c;
  outline: none;
  font-size: 0.8rem;
  text-align: center;
  width: 100%;
`;
