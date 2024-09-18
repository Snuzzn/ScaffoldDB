import { type NodeProps } from "@xyflow/react";
import styled from "styled-components";
import { type RelationshipNode } from "./types";
import Handle from "../components/Handle";
import { useState } from "react";

export function RelationshipNode({ data, id }: NodeProps<RelationshipNode>) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <NodeWrapper
            className="react-flow__node-default"
            style={{ position: "relative" }}
            isHovered={isHovered}
        >
            <Handle id={id} setIsHovered={setIsHovered} />
            <Body>
                <div style={{ position: "relative", cursor: "text" }}>{data.label}</div>
            </Body>
        </NodeWrapper>
    );
}

const NodeWrapper = styled.div<{ isHovered: boolean }>`
  border: 2px solid #737379;
  background: ${({ isHovered }) => (isHovered ? "#333333" : "#1e1e1e")};
  height: 60px;
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transform: rotate(45deg);
`;

const Body = styled.div`
  padding: 15px;
  font-size: 0.9em;
  position: relative;
  color: white;
  text-align: center;
  font-family: "Roboto Mono", "Fira Code", monospace;
  transform: rotate(-45deg);
`;
