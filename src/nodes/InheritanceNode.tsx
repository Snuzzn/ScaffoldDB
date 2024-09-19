import { type NodeProps, useReactFlow } from "@xyflow/react";
import styled from "styled-components";
import { type InheritanceNode } from "./types";
import { useState } from "react";
import Handle from "../components/Handle";
import { NodeWrapper } from "./EntityNode";
import { calculateSize } from "../utils/nodeUtils";

export function InheritanceNode({
  data,
  id,
  selected,
}: NodeProps<InheritanceNode>) {
  const isActive = selected;
  const reactFlow = useReactFlow();

  const [isEditing, setIsEditing] = useState(false);
  const [labelValue, setLabelValue] = useState(data.label || "");

  const [isHovered, setIsHovered] = useState(false);
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelValue(e.target.value);
  };

  const handleLabelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (labelValue === "") return;
    setIsEditing(false);

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

  const handleLabelClick = () => {
    if (!isActive) return;
    setIsEditing(true);
  };

  const nodeSize = calculateSize(labelValue, 30, 150);

  return (
    <InheritanceWrapper
      className="react-flow__node-default"
      $isHovered={isHovered}
      $isActive={isActive}
      $size={nodeSize}
    >
      <Handle id={id} setIsHovered={setIsHovered} isHovered={isHovered} />
      <Body>
        <div style={{ position: "relative" }}>
          {isEditing ? (
            <form onSubmit={handleLabelSubmit}>
              <LabelInput
                value={labelValue}
                onChange={handleLabelChange}
                onBlur={handleLabelSubmit}
                autoFocus
              />
            </form>
          ) : (
            <div onClick={handleLabelClick}>{data.label}</div>
          )}
        </div>
      </Body>
    </InheritanceWrapper>
  );
}

const InheritanceWrapper = styled(NodeWrapper)<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Body = styled.div`
  font-size: 0.9em;
  position: relative;
  color: white;
  text-align: center;
  font-family: "Roboto Mono", "Fira Code", monospace;
  z-index: 2;
`;

const LabelInput = styled.input`
  background: none;
  color: white;
  border: none;
  border-bottom: 1px solid #4e4c4c;
  outline: none;
  font-size: 0.7rem;
  text-align: center;
  width: 100%;
  z-index: 2;
`;
