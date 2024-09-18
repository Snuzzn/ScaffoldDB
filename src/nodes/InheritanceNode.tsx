import { type NodeProps, useReactFlow } from "@xyflow/react";
import styled from "styled-components";
import { type InheritanceNode } from "./types";
import { useState } from "react";
import Handle from "../components/Handle";

export function InheritanceNode({ data, id }: NodeProps<InheritanceNode>) {
    const reactFlow = useReactFlow();

    const [isEditing, setIsEditing] = useState(false);
    const [labelValue, setLabelValue] = useState(data.label || "");

    // Function to handle label input changes
    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLabelValue(e.target.value);
    };

    // Submit label change to update the node
    const handleLabelSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditing(false);

        // Update the node with the new label
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

    const [isHovered, setIsHovered] = useState(false);

    // calculate node size based on label length
    const calculateSize = (label: string) => {
        const baseSize = 40;
        const incrementPerChar = 5;
        const maxSize = 150;
        const newSize = Math.min(
            baseSize + label.length * incrementPerChar,
            maxSize,
        );
        return newSize;
    };
    const nodeSize = calculateSize(labelValue);

    return (
        <NodeWrapper
            className="react-flow__node-default"
            style={{ position: "relative" }}
            isHovered={isHovered}
            size={nodeSize}
        >
            <Handle id={id} setIsHovered={setIsHovered} />
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
                        <div onClick={() => setIsEditing(true)}>{data.label}</div>
                    )}
                </div>
            </Body>
        </NodeWrapper>
    );
}

const NodeWrapper = styled.div<{ isHovered: boolean; size: number }>`
  border: 2px solid #737379;
  background: ${({ isHovered }) => (isHovered ? "#3e3e3e" : "#1e1e1e")};
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease; // Smooth transition for hover effect
`;

const Body = styled.div`
  padding: 5px;
  font-size: 0.9em;
  position: relative;
  color: white;
  text-align: center;
  font-family: "Roboto Mono", "Fira Code", monospace;
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
`;
