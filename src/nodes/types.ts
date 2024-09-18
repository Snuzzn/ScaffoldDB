import type { Node, BuiltInNode } from "@xyflow/react";

export interface Attribute {
  label: string;
  type: string;
  dataType?: string;
}

export type EntityNode = Node<
  { label: string; attributes: Attribute[] },
  "entity"
>;
export type RelationshipNode = Node<{ label: string }, "relationship">;
export type InheritanceNode = Node<{ label: string }, "inheritance">;
export type RelationNode = Node<
  { label: string; attributes: Attribute[] },
  "relation"
>;

export type AppNode =
  | BuiltInNode
  | EntityNode
  | RelationshipNode
  | InheritanceNode
  | RelationNode;

export type NodeType = "entity" | "relationship" | "inheritance" | "relation";
