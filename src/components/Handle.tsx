import styled from "styled-components";
import {
  Handle as FlowHandle,
  Position,
  useConnection,
  useHandleConnections,
} from "@xyflow/react";
import { useEffect } from "react";

type HandleProps = {
  id: string;
  setIsHovered: (isHovered: boolean) => void;
};

const Handle = ({ id, setIsHovered }: HandleProps) => {
  const connection = useConnection();
  const isTarget = connection.inProgress && connection.fromNode.id !== id;
  useHandleConnections({
    type: "target",
    nodeId: id,
    onConnect: () => {
      setIsHovered(false);
    },
    onDisconnect: () => {
      setIsHovered(false);
    },
  });

  useHandleConnections({
    type: "source",
    nodeId: id,
    onConnect: () => {
      setIsHovered(false);
    },
    onDisconnect: () => {
      setIsHovered(false);
    },
  });

  useEffect(() => {
    if (!connection.inProgress && !connection.isValid) setIsHovered(false);
  }, [connection]);

  return (
    <div>
      {!connection.inProgress && (
        <FullHandle
          position={Position.Right}
          type="source"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      )}
      {(!connection.inProgress || isTarget) && (
        <FullHandle
          position={Position.Left}
          type="target"
          isConnectableStart={false}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
      )}
    </div>
  );
};

export default Handle;

const FullHandle = styled(FlowHandle)`
  width: 100%;
  height: 100%;
  background: blue;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 0;
  transform: none;
  border: none;
  opacity: 0;
`;
