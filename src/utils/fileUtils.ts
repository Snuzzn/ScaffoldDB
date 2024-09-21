import { Node, Edge, ReactFlowInstance, getNodesBounds } from "@xyflow/react";
import { toPng } from "html-to-image";

export const appName = "scaffolddb";
export const saveToLocalStorage = (
    reactFlowInstance: ReactFlowInstance,
    filename: string | null,
): void => {
    const nodes: Node[] = reactFlowInstance.getNodes();
    const edges: Edge[] = reactFlowInstance.getEdges();

    const data = {
        nodes,
        edges,
        timestamp: new Date().toISOString(),
    };

    const jsonData = JSON.stringify(data);

    localStorage.setItem(`${appName}-${filename}`, jsonData);
};

export const loadDiagram = (
    json: { nodes: any; edges: any; timestamp?: any },
    reactFlow: ReactFlowInstance,
    filename: string | null,
    setFilename: (filename: string | null) => void,
) => {
    if (json.nodes && json.edges) {
        reactFlow.setNodes(json.nodes);
        reactFlow.setEdges(json.edges);

        setFilename(filename);
        setTimeout(() => {
            reactFlow.fitView({ duration: 1500 });
        }, 200);
    } else {
        console.error("Invalid JSON structure. Must contain 'nodes' and 'edges'.");
    }
};

export const getLatestFileFromLocalStorage = (): {
    nodes: Node[];
    edges: Edge[];
    timestamp: string;
    filename: string;
} | null => {
    const localStorageKeys = Object.keys(localStorage);
    const appFiles = localStorageKeys
        .filter((key) => key.startsWith(appName))
        .map((key) => {
            const jsonData = localStorage.getItem(key);
            if (!jsonData) return null;

            try {
                const parsedData = JSON.parse(jsonData);
                return {
                    nodes: parsedData.nodes,
                    edges: parsedData.edges,
                    timestamp: parsedData.timestamp,
                    filename: key, // Add filename here
                };
            } catch (error) {
                console.error(`Error parsing JSON data for key: ${key}`, error);
                return null;
            }
        })
        .filter((data) => data !== null);

    if (appFiles.length === 0) {
        return null; // No files found
    }

    // Find the latest file based on the timestamp
    const latestFile = appFiles.reduce((latest, current) => {
        return new Date(current!.timestamp) > new Date(latest!.timestamp)
            ? current
            : latest;
    });

    return latestFile || null;
};

export const renameFileInLocalStorage = (
    oldFilename: string | null,
    newFilename: string | null,
): void => {
    if (!oldFilename || !newFilename) {
        console.error(
            "Invalid filenames. Both old and new filenames are required.",
        );
        return;
    }

    const oldKey = `${appName}-${oldFilename}`;
    const newKey = `${appName}-${newFilename}`;

    // Check if the new filename already exists
    if (localStorage.getItem(newKey)) {
        throw new Error(`A file with the name "${newFilename}" already exists.`);
    }

    const oldData = localStorage.getItem(oldKey);

    if (!oldData) {
        console.error(`No data found for the file: ${oldFilename}`);
        return;
    }

    // Proceed with renaming
    localStorage.setItem(newKey, oldData);
    localStorage.removeItem(oldKey);
};

export const generateNextAvailableFilename = (prefix: string): string => {
    const localStorageKeys = Object.keys(localStorage);

    // Find all keys that start with "appName-prefix" (either "appName-prefix" or "appName-prefix-<number>")
    const untitledFiles = localStorageKeys
        .filter((key) => key.startsWith(`${appName}-${prefix}`))
        .map((key) => {
            const match = key.match(new RegExp(`${appName}-${prefix}-(\\d+)$`));
            return match ? parseInt(match[1], 10) : null;
        })
        .filter((num) => num !== null) as number[];

    // If no untitled files exist, return just "prefix"
    if (localStorageKeys.every((key) => key !== `${appName}-${prefix}`)) {
        return `${prefix}`;
    }

    // If "prefix" already exists, find the largest number and return the next one
    if (untitledFiles.length === 0) {
        return `${prefix} (1)`; // Start with "prefix-1" if no numbered files exist
    }

    const maxNumber = Math.max(...untitledFiles);
    return `${prefix} (${maxNumber + 1})`;
};

export const downloadImage = (
    reactFlow: ReactFlowInstance,
    filename: string,
) => {
    function triggerDownload(dataUrl: string) {
        const a = document.createElement("a");
        a.setAttribute("download", `${filename}.png`);
        a.setAttribute("href", dataUrl);
        a.click();
    }
    const nodes = reactFlow.getNodes();
    const nodesBounds: any = getNodesBounds(nodes);

    // Fit the view so all nodes are visible before exporting the image
    reactFlow.fitView({ duration: 0 });

    // Get the current viewport element (the container)
    const viewportElement: any = document.querySelector(".react-flow__viewport");

    // Calculate the total size of the nodes' bounds
    const diagramWidth = nodesBounds.right - nodesBounds.left;
    const diagramHeight = nodesBounds.bottom - nodesBounds.top;

    // Define a scaling factor for upscaling the resolution
    const scaleFactor = 3; // Adjust this value for higher resolution

    // Adjust style to capture the entire diagram and upscale the resolution
    toPng(viewportElement, {
        backgroundColor: "#141414",
        width: diagramWidth * scaleFactor, // Scale up the width
        height: diagramHeight * scaleFactor, // Scale up the height
        style: {
            width: `${diagramWidth}`,
            height: `${diagramHeight}`,
            transform: `translate(${-nodesBounds.left}px, ${-nodesBounds.top}px)`,
            transformOrigin: "top left", // Ensure scaling starts from the top left
        },
        pixelRatio: scaleFactor, // Upscale the resolution
    }).then(triggerDownload);
};
