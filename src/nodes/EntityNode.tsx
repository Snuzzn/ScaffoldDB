import { type NodeProps, useReactFlow } from "@xyflow/react";
import { type EntityNode } from "./types";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { HiOutlineKey, HiOutlineTrash } from "react-icons/hi";
import SelectMenu from "../components/SelectMenu";
import Handle from "../components/Handle";
import { LayoutGroup, motion } from "framer-motion";

type Attribute = { label: string; type: string };
interface CustomEntityNode extends EntityNode {
    data: {
        label: string;
        attributes: Attribute[];
        isActive: boolean;
    };
}

export function EntityNode({
    data,
    id,
    selected,
}: NodeProps<CustomEntityNode>) {
    const isActive = selected;
    const reactFlow = useReactFlow();
    const [inputValue, setInputValue] = useState("");
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [newAttributeValue, setNewAttributeValue] = useState("");
    const [attributeType, setAttributeType] = useState("non-key");

    const [isEditingHeader, setIsEditingHeader] = useState(false);
    const [headerValue, setHeaderValue] = useState(data.label || "");

    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => { }, [data.attributes]);

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
        if (newAttributeValue === "") return;
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
        if (!isActive) return;
        setInputValue(data.attributes[index].label);
        setEditIndex(index);
    };

    const handleDeleteClick = (index: number) => {
        if (!isActive) return;
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

    const handleHeaderClick = () => {
        if (!isActive) return;
        setIsEditingHeader(true);
    };

    const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHeaderValue(e.target.value);
    };

    const handleHeaderSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (headerValue === "") return;
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
        <EntityWrapper
            className="react-flow__node-default"
            $isHovered={isHovered}
            $isActive={isActive}
        >
            <Handle id={id} setIsHovered={setIsHovered} isHovered={isHovered} />
            <Header onClick={handleHeaderClick} $isActive={isActive}>
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
                    <div style={{ zIndex: 2 }}>{data.label && <>{data.label}</>}</div>
                )}
            </Header>

            <Body>
                <LayoutGroup id={id}>
                    {data.attributes.map((item, index) => (
                        <AttributeWrapper key={index}>
                            <AttributeItem
                                $type={item.type}
                                $isActive={isActive}
                                onClick={() => handleEditClick(index)}
                            >
                                {editIndex === index ? (
                                    <EditForm onSubmit={handleEditSubmit}>
                                        <EditInput
                                            value={inputValue}
                                            onChange={handleInputChange}
                                            onBlur={() => setEditIndex(null)}
                                            placeholder="Edit attribute"
                                            autoFocus
                                        />
                                    </EditForm>
                                ) : (
                                    <>
                                        {item.label + " "}
                                        {item.type === "primary-key" && <HiOutlineKey />}
                                    </>
                                )}
                            </AttributeItem>
                            <DeleteButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(index);
                                }}
                                $isActive={isActive}
                            >
                                <HiOutlineTrash />
                            </DeleteButton>
                        </AttributeWrapper>
                    ))}
                </LayoutGroup>
                {(isActive || data.attributes.length === 0) && (
                    <NewAttributeForm onSubmit={handleNewAttributeSubmit}>
                        <Input
                            value={newAttributeValue}
                            onChange={handleNewAttributeChange}
                            placeholder="attribute"
                        />
                        <SelectMenu
                            attributeType={attributeType}
                            setAttributeType={setAttributeType}
                        />
                    </NewAttributeForm>
                )}
            </Body>
        </EntityWrapper>
    );
}

export const NodeWrapper = styled.div<{
    $isHovered: boolean;
    $isActive: boolean | undefined;
}>`
  border: 2px solid #737379;
  border-style: ${({ $isHovered }) => ($isHovered ? "dashed" : "solid")};
  outline: ${({ $isActive }) => ($isActive ? "2px solid #4a61de" : "none")};
  background: ${({ $isHovered }) => ($isHovered ? "#333333" : "#1e1e1e")};
  cursor: ${({ $isActive }) => ($isActive ? "auto" : "pointer")};
  font-family: "Roboto Mono", "Fira Code", monospace;
  transition: background 200ms ease;
  color: white;
`;

const EntityWrapper = styled(NodeWrapper)`
  border-radius: 10px;
  padding: 0;
  width: auto;
  min-width: 150px;
`;

export const Header = styled.div<{ $isActive: boolean | undefined }>`
  border-bottom: 1px solid #737379;
  padding: 7px;
  cursor: ${({ $isActive }) => ($isActive ? "text" : "pointer")};
  position: relative;
  z-index: 2;
`;

const Body = styled(motion.div)`
  padding: 10px;
  font-size: 0.7rem;
  position: relative;
`;

export const DeleteButton = styled.button<{ $isActive: boolean | undefined }>`
  background: none;
  border: none;
  color: #383838;
  cursor: ${({ $isActive }) => ($isActive ? "pointer" : "inherit")};
  opacity: ${({ $isActive }) => ($isActive ? "1" : "0")};
  transition: opacity 0.3s ease;
  &:hover {
    color: #434343ff;
  }
  font-size: 1em;
  z-index: 2;
`;

export const AttributeWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 0;
`;

export const AttributeItem = styled.div<{
    $type: string;
    $isActive: boolean | undefined;
}>`
  color: ${({ $type }) =>
        $type === "primary-key"
            ? "#d27735"
            : $type === "foreign-key"
                ? "#9788db"
                : "inherit"};
  &:hover {
    background: ${({ $isActive }) => ($isActive ? "#2a2a2a" : "inherit")};
  }
  cursor: ${({ $isActive }) => ($isActive ? "text" : "pointer")};
  z-index: 2;
`;

const EditForm = styled.form`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
`;

const NewAttributeForm = styled.form`
  margin-top: 3px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const Input = styled.input`
  background: none;
  color: #424242;
  border: none;
  border-bottom: 1px solid #424242;
  outline: none;
  width: 100px;
  z-index: 2;
  font-size: 1em;
  &::placeholder {
    color: #545454ff;
  }
`;

export const EditInput = styled(Input)`
  color: #a4a4a4ff;
  font-size: 0.65rem;
  margin-top: -3px;
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
