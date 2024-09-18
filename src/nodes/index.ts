import type { NodeTypes } from "@xyflow/react";
import { AppNode } from "./types";
import { EntityNode } from "./EntityNode";
import { RelationshipNode } from "./RelationshipNode";
import { InheritanceNode } from "./InheritanceNode";
import { RelationNode } from "./RelationNode";

export const initialNodes: AppNode[] = [
  {
    id: "1",
    type: "entity",
    position: { x: 100, y: 150 },
    data: {
      label: "User",
      attributes: [
        { label: "user_id", type: "primary-key" },
        { label: "name", type: "non-key" },
        { label: "password", type: "non-key" },
      ],
    },
  },
  {
    id: "2",
    type: "entity",
    position: { x: -150, y: 50 },
    data: {
      label: "Content",
      attributes: [
        { label: "id", type: "primary-key" },
        { label: "title", type: "non-key" },
        { label: "format", type: "non-key" },
      ],
    },
  },
  {
    id: "3",
    type: "relationship",
    position: { x: -150, y: 350 },
    data: {
      label: "Contains",
    },
  },
  {
    id: "4",
    type: "inheritance",
    position: { x: -150, y: 200 },
    data: {
      label: "O",
    },
  },
  {
    id: "5",
    type: "relation",
    position: { x: 50, y: 300 },
    data: {
      label: "Relation",
      attributes: [
        {
          label: "relation_name_email",
          type: "primary-key",
          dataType: "stdfsdjfkdsj ring",
        },
        { label: "title", type: "non-key", dataType: "string" },
        { label: "format", type: "non-key", dataType: "string" },
      ],
    },
  },
];

export const nodeTypes = {
  entity: EntityNode,
  relationship: RelationshipNode,
  inheritance: InheritanceNode,
  relation: RelationNode,
} satisfies NodeTypes;
