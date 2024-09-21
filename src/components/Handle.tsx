import styled, { css } from "styled-components";
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
    isHovered: boolean;
};

const Handle = ({ id, setIsHovered, isHovered }: HandleProps) => {
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
            <Cover />
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
            {isHovered && <Background />}
        </div>
    );
};

export default Handle;

const sharedHandleStyles = css`
  width: calc(100% + 40px);
  height: calc(100% + 40px);
  top: -20px;
  left: -20px;
`;

const FullHandle = styled(FlowHandle)`
  //border-radius: 0;
  transform: none;
  opacity: 0;
  ${sharedHandleStyles}
`;

const Background = styled.div`
  ${sharedHandleStyles}
  position: absolute;
  opacity: 50%;
  border-radius: 20px;
  z-index: -1;
  background: #1f1f20;
  transition: opacity 200ms ease;
  @starting-style {
    opacity: 0;
  }
`;

const Cover = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
`;
