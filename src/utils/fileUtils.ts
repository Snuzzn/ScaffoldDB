import { Node, Edge, ReactFlowInstance } from "@xyflow/react";

export const appName = "blueprintdb";
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
    // TODO: If nodes and edges exist already, give warning toast first.
    reactFlow.setNodes(json.nodes);
    reactFlow.setEdges(json.edges);

    setFilename(filename);
    console.log("Nodes and edges loaded successfully");
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

export const getNextUntitledFilename = (): string => {
  const prefix = "Untitled";
  const localStorageKeys = Object.keys(localStorage);

  // Find all keys that start with "untitled" (either "untitled" or "untitled-<number>")
  const untitledFiles = localStorageKeys
    .filter((key) => key.startsWith(`${appName}-${prefix}`))
    .map((key) => {
      const match = key.match(new RegExp(`${appName}-${prefix}-(\\d+)$`));
      return match ? parseInt(match[1], 10) : null;
    })
    .filter((num) => num !== null) as number[];

  // If no untitled files exist, return just "untitled"
  if (localStorageKeys.every((key) => key !== `${appName}-${prefix}`)) {
    return prefix;
  }

  // If "untitled" already exists, find the largest number and return the next one
  if (untitledFiles.length === 0) {
    return `${prefix}-1`; // Start with "untitled-1" if no numbered files exist
  }

  const maxNumber = Math.max(...untitledFiles);
  return `${prefix}-${maxNumber + 1}`;
};
