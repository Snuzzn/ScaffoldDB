import { useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  Edge,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import EdgePanel from "./components/EdgePanel";
import CustomConnectionLine from "./edges/CustomConnectionLine";
import { AppNode, NodeType } from "./nodes/types";
import ToolsPanel from "./components/ToolsPanel";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [nodeType, setNodeType] = useState<NodeType | null>(null);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((edges) =>
        addEdge(
          {
            ...connection,
          },
          edges,
        ),
      );
    },
    [setEdges],
  );

  const editEdge = (_: React.MouseEvent, edge: Edge) => {
    if (!nodeType) {
      setSelectedEdge(edge);
    }
  };

  const resetPanels = () => {
    if (!nodeType) {
      setSelectedEdge(null);
    }
  };

  const reactFlow = useReactFlow();
  const handlePaneClick = (event: React.MouseEvent) => {
    if (nodeType) {
      const position = reactFlow.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      let newNode: AppNode;
      if (nodeType === "entity" || nodeType === "relation") {
        newNode = {
          id: uuidv4(),
          type: nodeType,
          position: position,
          data: { label: "text", attributes: [] },
        };
      } else if (nodeType === "relationship" || nodeType === "inheritance") {
        newNode = {
          id: uuidv4(),
          type: nodeType,
          position: position,
          data: { label: "text" },
        };
      } else {
        return;
      }
      setNodes((nodes) => [...nodes, newNode]);
      setNodeType(null);
    }
  };

  return (
    <>
      {selectedEdge && (
        <EdgePanel
          edges={edges}
          setEdges={setEdges}
          selectedEdge={selectedEdge}
        />
      )}
      <ToolsPanel nodeType={nodeType} setNodeType={setNodeType} />
      <div
        ref={reactFlowWrapper}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          edges={edges}
          edgeTypes={edgeTypes}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          colorMode={"dark"}
          onEdgeClick={editEdge}
          onNodeClick={resetPanels}
          onNodeDrag={resetPanels}
          onPaneClick={handlePaneClick}
          onEdgesDelete={resetPanels}
          onMove={resetPanels}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineComponent={CustomConnectionLine}
          connectionLineStyle={connectionLineStyle}
          proOptions={proOptions}
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
}

export default () => (
  <ReactFlowProvider>
    <App />
  </ReactFlowProvider>
);

const defaultEdgeOptions = {
  type: "customEdge",
  data: {
    label: "",
  },
};

const connectionLineStyle = {
  strokeWidth: 1,
  stroke: "#2f2f2f",
};

const proOptions = { hideAttribution: true };
