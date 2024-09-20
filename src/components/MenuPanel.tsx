import styled from "styled-components";
import logo from "../images/blueprint-logo.svg";
import dropIcon from "../images/drop-file.svg";
import fileIcon from "../images/file.svg";
import { FiMenu } from "react-icons/fi";
import { useReactFlow } from "@xyflow/react";
import { Modal } from "./Modal";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Dropdown from "./Dropdown";
import { LuFolderOpen, LuDownload, LuFilePlus, LuTrash2 } from "react-icons/lu";
import {
  appName,
  getNextUntitledFilename,
  loadDiagram,
  renameFileInLocalStorage,
  saveToLocalStorage,
} from "../utils/fileUtils";
import { motion } from "framer-motion";
import { HiOutlineTrash } from "react-icons/hi";

interface RecentFile {
  name: string;
  date: string;
  timestamp: string;
}

const MenuPanel = ({
  filename,
  setFilename,
}: {
  filename: string | null;
  setFilename: (filename: string | null) => void;
}) => {
  const reactFlow = useReactFlow();
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedFilename, setEditedFilename] = useState(filename || "");

  useEffect(() => {
    // for renaming a newly opened file
    setEditedFilename(filename || "");
  }, [filename]);

  const handleFilenameClick = () => {
    setIsEditing(true);
  };

  const handleFilenameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedFilename(e.target.value);
  };

  const handleFilenameBlur = () => {
    setIsEditing(false);
    setFilename(editedFilename);
    renameFileInLocalStorage(filename, editedFilename);
  };

  const handleFilenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      setFilename(editedFilename);
      renameFileInLocalStorage(filename, editedFilename);
    }
  };

  const exportToJson = () => {
    const nodes = reactFlow.getNodes();
    const edges = reactFlow.getEdges();

    const data = { nodes, edges };
    const jsonString = JSON.stringify(data, null, 2);

    // Create a Blob with the JSON data
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.download = `${filename}.json`;
    link.href = window.URL.createObjectURL(blob);
    link.click();
    window.URL.revokeObjectURL(link.href);
  };

  const [isDiagramManagerOpen, setIsDiagramManagerOpen] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/json": [".json"],
    },
    onDrop: (acceptedFiles) => {
      handleFileUpload(acceptedFiles[0]);
    },
  });

  const handleFileUpload = (file: File) => {
    if (file.type === "application/json") {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          try {
            const json = JSON.parse(result);
            // Remove the file extension from the filename
            const filenameWithoutExtension = file.name
              .split(".")
              .slice(0, -1)
              .join(".");
            loadDiagram(json, reactFlow, filenameWithoutExtension, setFilename);
            setIsDiagramManagerOpen(false);
          } catch (error) {
            console.error("Error parsing JSON file", error);
          }
        } else {
          console.error("File content is not a valid string");
        }
      };
      reader.readAsText(file);
    } else {
      console.error("Uploaded file is not a valid JSON file.");
    }
  };

  const handleFileOpen = (selectedFilename: string) => {
    console.log(selectedFilename);
    const fileKey = `${appName}-${selectedFilename}`;
    const fileDataString = localStorage.getItem(fileKey);

    if (fileDataString) {
      try {
        const fileData = JSON.parse(fileDataString);
        loadDiagram(fileData, reactFlow, selectedFilename, setFilename);
        setIsDiagramManagerOpen(false);
      } catch (error) {
        console.error("Error parsing file data", error);
      }
    } else {
      console.error("File not found in localStorage");
    }
  };

  const handleFileDelete = (selectedFilename: string) => {
    // Remove from localStorage
    const fileKey = `${appName}-${selectedFilename}`;
    localStorage.removeItem(fileKey);

    // Remove from recentFiles state
    setRecentFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== selectedFilename),
    );

    console.log(filename, selectedFilename);
    // if currently open file is deleted, create a new file
    if (filename === selectedFilename) {
      createNewFile(false);
    }
  };

  // grab files from local storage
  useEffect(() => {
    const files: RecentFile[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${appName}-`)) {
        // Null check for key
        const fileName = key.replace(`${appName}-`, "");
        const fileDataString = localStorage.getItem(key);
        if (fileDataString) {
          // Null check for localStorage value
          try {
            const fileData = JSON.parse(fileDataString);
            console.log(fileData.timestamp);
            const formattedDate = new Date(fileData.timestamp).toLocaleString(
              "en-GB",
              {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              },
            );
            files.push({
              name: fileName,
              date: formattedDate || "Unknown date",
              timestamp: fileData.timestamp,
            });
          } catch (error) {
            console.error("Error parsing file data from localStorage", error);
          }
        }
      }
    }
    setRecentFiles(files);
  }, [isDiagramManagerOpen]);

  const createNewFile = (saveCurrentFile: boolean) => {
    // save the current one just in case it wasn't already
    if (saveCurrentFile) saveToLocalStorage(reactFlow, filename);

    // set new name
    const newFilename = getNextUntitledFilename();
    setFilename(newFilename);

    // reset current reactflow data
    reactFlow.setEdges([]);
    reactFlow.setNodes([]);
  };

  // create new file (handle overwrite situation where the same file name is used)
  // 'save as JSON'
  // 'save as PNG'
  // load diagram
  // export file
  //
  //
  return (
    <Container layout>
      <Title layout>
        <Logo src={logo} />
        BlueprintDB
      </Title>
      <Divider layout />
      {isEditing ? (
        <Input
          value={editedFilename}
          onChange={handleFilenameChange}
          onBlur={handleFilenameBlur}
          onKeyDown={handleFilenameKeyDown}
          autoFocus
          layout
        />
      ) : (
        <DocumentName onClick={handleFilenameClick} layout="position">
          {filename || "Untitled"}
        </DocumentName>
      )}
      <Dropdown
        items={[
          {
            name: "New file",
            icon: <LuFilePlus />,
            onSelect: () => createNewFile(false),
          },
          {
            name: "Open file",
            icon: <LuFolderOpen />,
            onSelect: () => setIsDiagramManagerOpen(true),
          },
          {
            name: "Export as JSON",
            icon: <LuDownload />,
            onSelect: () => exportToJson(),
          },
        ]}
      >
        <UnstyledBtn layout="position">
          <FiMenu color="white" size="1rem" />
        </UnstyledBtn>
      </Dropdown>
      <Modal isOpen={isDiagramManagerOpen} setIsOpen={setIsDiagramManagerOpen}>
        <ModalContainer>
          <ModalHeader>Open file</ModalHeader>
          <Flex>
            <RecentWrapper>
              <h2>Recent files...</h2>
              <RecentContainer>
                {recentFiles
                  .sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime(),
                  ) // Sort by timestamp
                  .map((file) => (
                    <FileBtn
                      key={file.name}
                      onClick={() => handleFileOpen(file.name)}
                      layout="position"
                    >
                      <img src={fileIcon} width="35px" height="35px" />
                      <FileDetails>
                        <div>{file.name}</div>
                        <FileDate>{file.date}</FileDate>
                      </FileDetails>
                      <UnstyledBtn
                        onClick={() => handleFileDelete(file.name)} // Call handleFileDelete when clicked
                        style={{
                          marginLeft: "auto",
                          padding: "10px",
                        }}
                      >
                        <HiOutlineTrash size={20} color="#424242" />
                      </UnstyledBtn>
                    </FileBtn>
                  ))}
              </RecentContainer>
            </RecentWrapper>
            <DropZoneWrapper>
              <h2>From your computer...</h2>
              <DropZoneContainer {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <UnstyledBtn>
                  <img src={dropIcon} width={"70px"} />
                </UnstyledBtn>
                <div style={{ textAlign: "center" }}>
                  Drag & Drop or <br />
                  <u>Choose file</u> to upload
                </div>
              </DropZoneContainer>
            </DropZoneWrapper>
          </Flex>
        </ModalContainer>
      </Modal>
    </Container>
  );
};

export default MenuPanel;
const UnstyledBtn = styled(motion.button)`
  border: none;
  background: none;
  cursor: pointer;
`;

const ModalContainer = styled.div`
  color: white;
  background: #1b1b1b;
  height: 500px;
  padding: 20px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 0.5;
`;

const Flex = styled.div`
  display: flex;
  flex: 1;
  gap: 20px;
  h2 {
    font-weight: 500;
    color: #9d9d9d;
    font-size: 1.2rem;
  }
`;

const RecentWrapper = styled.div`
  flex: 1;
  width: 100%;
`;
const RecentContainer = styled.div`
  width: 100%;
  flex: 1;
  overflow-y: auto;
  height: 400px;
`;

const FileBtn = styled(UnstyledBtn)`
  color: white;
  font-size: 1rem;
  text-align: start;
  flex: 1;
  background: #242424;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: background 200ms ease;
  height: 80px;
  width: 100%;
  margin-bottom: 10px;

  &:hover {
    background: #292929;
  }
`;

const FileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const FileDate = styled.div`
  color: #8b8b8b;
  font-size: 0.9rem;
  font-style: italic;
`;

const DropZoneWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
const DropZoneContainer = styled.div`
  border: 1px dashed grey;
  border-radius: 20px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  color: #8e8e8e;
  cursor: pointer;
  background: linear-gradient(320deg, #171717 15%, #242424 90%);
  transition: 200ms border-color ease;
  &:hover {
    border-color: #a0a0a0;
  }
`;

const Logo = styled.img`
  width: 2.2rem;
`;

const Title = styled(motion.div)`
  font-weight: 600;
  font-size: 1.3rem;
  //font-family: "Roboto Mono", "Fira Code", monospace;
  display: flex;
  gap: 15px;
  align-items: center;
`;

const Container = styled(motion.div)`
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 2;
  color: white;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    rgba(0, 0, 0, 0.25) 0px 14px 28px,
    rgba(0, 0, 0, 0.22) 0px 10px 10px;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
`;
const Divider = styled(motion.hr)`
  height: 25px;
`;

const DocumentName = styled(motion.div)`
  font-size: 1.1rem;
  font-weight: 600;
`;

const Input = styled(motion.input)`
  font-size: 1.1rem;
  font-weight: 600;
  background: transparent;
  border: none;
  color: white;
  outline: none;
  border-bottom: 2px solid #424242;
`;
