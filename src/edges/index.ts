import { type Edge, type EdgeTypes } from "@xyflow/react";
import CustomEdge from "./CustomEdge";

export const initialEdges: Edge[] = [
  //  {
  //    id: "1-2",
  //    source: "1",
  //    target: "2",
  //    type: "customEdge",
  //    sourceHandle: "left",
  //    targetHandle: "right",
  //    data: {
  //      label: "contains",
  //    },
  //    //markerStart: {
  //    //    type: MarkerType.Arrow,
  //    //    width: 30,
  //    //    height: 30,
  //    //},
  //  },
];

export const edgeTypes = {
  customEdge: CustomEdge,
} satisfies EdgeTypes;
