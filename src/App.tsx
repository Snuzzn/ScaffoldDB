import { useCallback, useState, useRef, useEffect } from "react";
import {
    ReactFlow,
    Background,
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
import MenuPanel from "./components/MenuPanel";
import {
    appName,
    getLatestFileFromLocalStorage,
    loadDiagram,
    saveToLocalStorage,
} from "./utils/fileUtils";
import ControlsPanel from "./components/ControlsPanel";

function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
    const [nodeType, setNodeType] = useState<NodeType | null>(null);
    const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
    const [filename, setFilename] = useState<string | null>("Untitled");

    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log(nodes);
    }, [nodes]);

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

    const handleEdgeClick = (_: React.MouseEvent, edge: Edge) => {
        setActiveNodeId(null);
        if (!nodeType) {
            setSelectedEdge(edge);
        }
    };

    const resetPanels = () => {
        setActiveNodeId(null);
        if (!nodeType) {
            setSelectedEdge(null);
        }
    };

    const handleNodeClick = (_: React.MouseEvent, node: AppNode) => {
        resetPanels();
        setActiveNodeId(node.id);
    };

    const reactFlow = useReactFlow();
    const handlePaneClick = (event: React.MouseEvent) => {
        resetPanels();
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
                    data: {
                        label: "title",
                        attributes: [],
                    },
                };
            } else if (nodeType === "relationship" || nodeType === "inheritance") {
                newNode = {
                    id: uuidv4(),
                    type: nodeType,
                    position: position,
                    data: { label: "title" },
                };
            } else {
                return;
            }
            setNodes((nodes) => [...nodes, newNode]);
            setNodeType(null);
        }
    };

    const [hasFirstLoaded, setHasFirstLoaded] = useState(false);
    useEffect(() => {
        const lastOpenedFile = getLatestFileFromLocalStorage();
        if (lastOpenedFile)
            loadDiagram(
                lastOpenedFile,
                reactFlow,
                lastOpenedFile.filename.split(`${appName}-`)[1], // get filename from key
                setFilename,
            );
        setHasFirstLoaded(true);
    }, [reactFlow]);

    useEffect(() => {
        // auto-save diagram after each change
        if (hasFirstLoaded) saveToLocalStorage(reactFlow, filename);
    }, [nodes, edges, reactFlow]);

    return (
        <>
            <ControlsPanel />
            <MenuPanel filename={filename} setFilename={setFilename} />
            {selectedEdge && (
                <EdgePanel
                    edges={edges}
                    setEdges={setEdges}
                    selectedEdge={selectedEdge}
                    setSelectedEdge={setSelectedEdge}
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
                    nodes={nodes.map((node) => ({
                        ...node,
                        selected: node.id === activeNodeId,
                    }))}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    edges={edges}
                    edgeTypes={edgeTypes}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    colorMode={"dark"}
                    onEdgeClick={handleEdgeClick}
                    onNodeClick={handleNodeClick}
                    onNodeDrag={handleNodeClick}
                    onPaneClick={handlePaneClick}
                    onEdgesDelete={resetPanels}
                    defaultEdgeOptions={defaultEdgeOptions}
                    connectionLineComponent={CustomConnectionLine}
                    connectionLineStyle={connectionLineStyle}
                    proOptions={proOptions}
                    className="download-image"
                >
                    <Background />
                    <MiniMap nodeBorderRadius={10} pannable zoomable />
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
