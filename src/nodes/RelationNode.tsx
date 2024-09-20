import { type NodeProps, useReactFlow } from "@xyflow/react";
import { Attribute, type EntityNode } from "./types";
import styled from "styled-components";
import { useState } from "react";
import { HiOutlineKey, HiOutlineTrash } from "react-icons/hi";
import SelectMenu from "../components/SelectMenu";
import Handle from "../components/Handle";
import {
    AttributeItem,
    AttributeWrapper,
    DeleteButton,
    EditInput,
    Header,
    Input,
    NodeWrapper,
} from "./EntityNode";

interface CustomEntityNode extends EntityNode {
    data: {
        label: string;
        attributes: Attribute[];
    };
}
export function RelationNode({
    data,
    id,
    selected,
}: NodeProps<CustomEntityNode>) {
    const reactFlow = useReactFlow();
    const isActive = selected;
    const [inputValue, setInputValue] = useState("");
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [newAttributeValue, setNewAttributeValue] = useState("");
    const [newDataType, setNewDataType] = useState("");
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
        if (inputValue === "") return;
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
                                {
                                    label: newAttributeValue,
                                    type: attributeType,
                                    dataType: newDataType,
                                },
                            ],
                        },
                    };
                }
                return node;
            }),
        );
        setNewAttributeValue("");
        setNewDataType("");
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

    const [editDataTypeIndex, setEditDataTypeIndex] = useState<number | null>(
        null,
    );
    const [editedDataTypeValue, setEditedDataTypeValue] = useState("");

    const handleEditDataTypeClick = (index: number) => {
        if (!isActive) return;
        setEditedDataTypeValue(data.attributes[index].dataType || "string");
        setEditDataTypeIndex(index);
    };

    const handleEditDataTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedDataTypeValue(e.target.value);
    };

    const handleEditDataTypeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editDataTypeIndex !== null) {
            reactFlow.setNodes((nodes) =>
                nodes.map((n) => {
                    const node = n as CustomEntityNode;
                    if (node.id === id) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                attributes: node.data.attributes.map((attr, index) =>
                                    index === editDataTypeIndex
                                        ? { ...attr, dataType: editedDataTypeValue }
                                        : attr,
                                ),
                            },
                        };
                    }
                    return node;
                }),
            );
            setEditDataTypeIndex(null);
            setEditedDataTypeValue("");
        }
    };

    return (
        <RelationWrapper
            className="react-flow__node-default"
            $isHovered={isHovered}
            $isActive={isActive}
        >
            <Handle id={id} setIsHovered={setIsHovered} isHovered={isHovered} />
            <Header onClick={() => setIsEditingHeader(true)} $isActive={isActive}>
                {isEditingHeader ? (
                    <form onSubmit={handleHeaderSubmit}>
                        <HeaderInput
                            value={headerValue}
                            onChange={handleHeaderChange}
                            onBlur={handleHeaderSubmit} // automatically submit
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
                <LeftCol>
                    {data.attributes.map((item, index) => (
                        <AttributeWrapper key={index} $isActive={isActive}>
                            <AttributeItem
                                onClick={() => handleEditClick(index)}
                                $isActive={isActive}
                                $type={item.type}
                            >
                                {editIndex === index ? (
                                    <EditForm onSubmit={handleEditSubmit}>
                                        <EditInput
                                            value={inputValue}
                                            onChange={handleInputChange}
                                            onBlur={() => setEditIndex(null)}
                                            placeholder="attribute"
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
                                $isActive={isActive}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(index);
                                }}
                            >
                                <HiOutlineTrash />
                            </DeleteButton>
                        </AttributeWrapper>
                    ))}

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
                </LeftCol>
                <RightCol>
                    {data.attributes.map((item, index) => (
                        <DataType
                            key={index}
                            onClick={() => handleEditDataTypeClick(index)}
                            $isActive={isActive}
                        >
                            {editDataTypeIndex === index ? (
                                <EditForm onSubmit={handleEditDataTypeSubmit}>
                                    <EditInput
                                        value={editedDataTypeValue}
                                        onChange={handleEditDataTypeChange}
                                        onBlur={handleEditDataTypeSubmit}
                                        placeholder="data type"
                                        autoFocus
                                    />
                                </EditForm>
                            ) : (
                                <span style={{ cursor: "text" }}>
                                    {item.dataType || "string"}
                                </span>
                            )}
                        </DataType>
                    ))}

                    {(isActive || data.attributes.length === 0) && (
                        <form
                            onSubmit={handleNewAttributeSubmit}
                            style={{ textAlign: "start" }}
                        >
                            <Input
                                style={{ marginTop: "3px", width: "60px" }}
                                value={newDataType}
                                placeholder="string"
                                onChange={(e) => setNewDataType(e.target.value)}
                            />
                        </form>
                    )}
                </RightCol>
            </Body>
        </RelationWrapper>
    );
}

const RelationWrapper = styled(NodeWrapper)`
  border-radius: 10px;
  width: auto;
  padding: 0;
  min-width: 230px;
`;

const Body = styled.div`
  font-size: 0.9em;
  position: relative;
  display: flex;
`;

const LeftCol = styled.div`
  padding: 10px;
  flex: 3;
`;

const RightCol = styled.div`
  padding: 10px;
  border-left: 1px solid #737379;
  z-index: 2;
  flex: 2;
`;

const DataType = styled.div<{ $isActive: boolean | undefined }>`
  text-align: start;
  color: #696868;
  &:hover {
    background: ${({ $isActive }) => ($isActive ? "#2a2a2a" : "inherit")};
  }
`;

const EditForm = styled.form`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 5px;
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

const NewAttributeForm = styled.form`
  width: 100%;
  margin-top: 3px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 5px;
`;
