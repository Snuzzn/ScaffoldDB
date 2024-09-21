import { TbArrowAutofitWidth } from "react-icons/tb";
import styled from "styled-components";
import { UnstyledBtn } from "./Shared";
import { useReactFlow } from "@xyflow/react";

const ControlsPanel = () => {
  const reactFlow = useReactFlow();

  return (
    <Container>
      <UnstyledBtn onClick={() => reactFlow.fitView({ duration: 2000 })}>
        <TbArrowAutofitWidth color="white" size="1.3rem" />
      </UnstyledBtn>
    </Container>
  );
};

export default ControlsPanel;

const Container = styled.div`
  position: absolute;
  bottom: 15px;
  left: 15px;
  z-index: 2;
  padding: 8px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    rgba(0, 0, 0, 0.25) 0px 14px 28px,
    rgba(0, 0, 0, 0.22) 0px 10px 10px;
`;
