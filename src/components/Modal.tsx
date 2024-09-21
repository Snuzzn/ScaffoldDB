import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import styled, { keyframes } from "styled-components";

type ModalProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    children: React.ReactNode;
};

export const Modal = ({ isOpen, setIsOpen, children }: ModalProps) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={() => setIsOpen(false)}>
            <Dialog.Portal>
                <StyledOverlay
                    as={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />
                <StyledContent>
                    {children}
                    <StyledClose asChild>
                        <Button aria-label="Close">
                            <IoMdClose size="1.5rem" color="#4b4b4b" />
                        </Button>
                    </StyledClose>
                </StyledContent>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
const StyledOverlay = styled(Dialog.Overlay)`
  animation-fill-mode: forwards;
  z-index: 10;
  position: fixed;
  inset: 0;
  backdrop-filter: blur(3px);
  background-color: rgba(0, 0, 0, 0.5);
`;

export const moveUpAnimation = keyframes`
  from {
    top: 100%;
  }
  to {
    top: 20%;
  }
`;

export const StyledContent = styled(Dialog.Content)`
  z-index: 12;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  width: 100%;
  overflow-y: auto;
  max-width: 1000px;
  max-height: 90vh;
  box-shadow:
    rgba(0, 0, 0, 0.25) 0px 14px 28px,
    rgba(0, 0, 0, 0.22) 0px 10px 10px;
`;

const StyledClose = styled(Dialog.Close)`
  position: absolute;
  top: 20px;
  right: 10px;
  margin-right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
`;

const Button = styled.button`
  font-size: 20px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  border-radius: 5px;
`;
