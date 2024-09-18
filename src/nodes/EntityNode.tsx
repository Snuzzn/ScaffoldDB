import { type NodeProps, useReactFlow } from "@xyflow/react";
import { type EntityNode } from "./types";
import styled from "styled-components";
import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import SelectMenu from "../components/SelectMenu";
import Handle from "../components/Handle";

type Attribute = { label: string; type: string };
interface CustomEntityNode extends EntityNode {
    data: {
        label: string;
        attributes: Attribute[];
    };
}
export function EntityNode({ data, id }: NodeProps<CustomEntityNode>) {
    const reactFlow = useReactFlow();
    const [inputValue, setInputValue] = useState("");
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [newAttributeValue, setNewAttributeValue] = useState("");
    const [attributeType, setAttributeType] = useState("non-key");

    const [isEditingHeader, setIsEditingHeader] = useState(false);
    const [headerValue, setHeaderValue] = useState(data.label || "");

    const [isHovered, setIsHovered] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleNewAttributeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewAttributeValue(e.target.value);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editIndex !== null) {
            reactFlow.setNodes((nodes) =>
                nodes.map((n) => {
                    const node = n as CustomEntityNode; // Cast to your custom type
                    if (node.id === id) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                attributes: node.data.attributes.map(
                                    (attr: Attribute, index: number) =>
                                        index === editIndex ? { ...attr, label: inputValue } : attr,
                                ),
                            },
                        };
                    }
                    return node;
                }),
            );
            setEditIndex(null);
            setInputValue("");
        }
    };

    const handleNewAttributeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        reactFlow.setNodes((nodes) =>
            nodes.map((n) => {
                const node = n as CustomEntityNode;
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            attributes: [
                                ...node.data.attributes,
                                { label: newAttributeValue, type: attributeType },
                            ],
                        },
                    };
                }
                return node;
            }),
        );
        setNewAttributeValue("");
    };

    const handleEditClick = (index: number) => {
        setInputValue(data.attributes[index].label);
        setEditIndex(index);
    };

    const handleDeleteClick = (index: number) => {
        reactFlow.setNodes((nodes) =>
            nodes.map((n) => {
                const node = n as CustomEntityNode;
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            attributes: node.data.attributes.filter(
                                (_: Attribute, i: number) => i !== index,
                            ),
                        },
                    };
                }
                return node;
            }),
        );
    };

    const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHeaderValue(e.target.value);
    };

    const handleHeaderSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditingHeader(false);
        reactFlow.setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: headerValue,
                        },
                    };
                }
                return node;
            }),
        );
    };

    return (
        <NodeWrapper
            className="react-flow__node-default"
            style={{ position: "relative" }}
            isHovered={isHovered}
        >
            <Handle id={id} setIsHovered={setIsHovered} />
            <Header onClick={() => setIsEditingHeader(true)}>
                {isEditingHeader ? (
                    <form onSubmit={handleHeaderSubmit}>
                        <HeaderInput
                            value={headerValue}
                            onChange={handleHeaderChange}
                            onBlur={handleHeaderSubmit} // automatically submit on blur
                            autoFocus
                        />
                    </form>
                ) : (
                    <div style={{ position: "relative", cursor: "grab" }}>
                        {data.label && <span style={{ cursor: "text" }}>{data.label}</span>}
                    </div>
                )}
            </Header>

            <Body>
                <div style={{ position: "relative" }}>
                    {data.attributes.map((item, index) => (
                        <AttributeContainer key={index}>
                            <Attribute
                                type={item.type}
                                onClick={() => handleEditClick(index)}
                            >
                                {editIndex === index ? (
                                    <EditForm onSubmit={handleEditSubmit}>
                                        <EditInput
                                            value={inputValue}
                                            onChange={handleInputChange}
                                            onBlur={() => setEditIndex(null)} // Add this line
                                            placeholder="Edit attribute"
                                            autoFocus
                                        />
                                    </EditForm>
                                ) : (
                                    item.label
                                )}
                            </Attribute>
                            <DeleteButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(index);
                                }}
                            >
                                <HiOutlineTrash />
                            </DeleteButton>
                        </AttributeContainer>
                    ))}
                    <NewAttributeForm onSubmit={handleNewAttributeSubmit}>
                        <Flex>
                            <Input
                                value={newAttributeValue}
                                onChange={handleNewAttributeChange}
                                placeholder="New attribute"
                            />
                            <SelectMenu
                                attributeType={attributeType}
                                setAttributeType={setAttributeType}
                            />
                        </Flex>
                    </NewAttributeForm>
                </div>
            </Body>
        </NodeWrapper>
    );
}
const NodeWrapper = styled.div<{ isHovered: boolean }>`
  border: 2px solid #737379;
  background: ${({ isHovered }) => (isHovered ? "#333333" : "#1e1e1e")};
  border-radius: 10px;
  color: white;
  padding: 0;
  font-family: "Roboto Mono", "Fira Code", monospace;
  cursor: pointer;
`;

const Header = styled.div`
  border-bottom: 1px solid #737379;
  padding: 7px;
  cursor: grab;
`;

const Body = styled.div`
  padding: 10px;
  font-size: 0.9em;
`;

const Attribute = styled.div<{ type: string }>`
  color: ${({ type }) =>
        type === "primary-key"
            ? "#d27735"
            : type === "foreign-key"
                ? "#9788db"
                : "inherit"};
  cursor: text;
  &:hover {
    background: #2a2a2a;
  }
`;

const EditForm = styled.form`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
`;

const NewAttributeForm = styled.form`
  margin-top: 3px;
`;

const Input = styled.input`
  background: none;
  color: #424242;
  border: none;
  border-bottom: 1px solid #424242;
  outline: none;
  font-size: 0.55rem;
  width: 97%;
  &::placeholder {
    color: #545454ff;
  }
`;

const EditInput = styled(Input)`
  color: #a4a4a4ff;
  font-size: 0.65rem;
  margin-top: -3px;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #383838;
  font-size: 0.9rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
  &:hover {
    color: #434343ff;
  }
`;

const AttributeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 0;
  &:hover ${DeleteButton} {
    opacity: 1;
  }
`;

const HeaderInput = styled.input`
  background: none;
  color: white;
  border: none;
  border-bottom: 1px solid #4e4c4cff;
  outline: none;
  width: 100%;
  font-size: 0.7rem;
  text-align: center;
`;
