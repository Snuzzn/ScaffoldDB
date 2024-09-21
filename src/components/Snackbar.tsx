import { forwardRef, useCallback } from "react";
import { useSnackbar, SnackbarContent, CustomContentProps } from "notistack";
import styled from "styled-components";
import {
    TbAlertTriangleFilled,
    TbInfoSquareRoundedFilled,
    TbSquareRoundedCheckFilled,
    TbSquareRoundedXFilled,
} from "react-icons/tb";
import { IoCloseSharp } from "react-icons/io5";

type Variant = "error" | "warning" | "success" | "info";
interface SnackbarProps extends CustomContentProps {
    variant: "error" | "warning" | "success" | "info";
}

const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(
    ({ id, ...props }, ref) => {
        const { closeSnackbar } = useSnackbar();
        const handleDismiss = useCallback(() => {
            closeSnackbar(id);
        }, [id, closeSnackbar]);

        const renderIcon = (variant: Variant) => {
            const icons = {
                error: <TbSquareRoundedXFilled color="#f5504e" size="1.9em" />,
                warning: <TbAlertTriangleFilled color="#ef9400" size="1.9em" />,
                success: <TbSquareRoundedCheckFilled color="#25bf5f" size="1.9em" />,
                info: <TbInfoSquareRoundedFilled color="#3150ec" size="1.9em" />,
            };
            return icons[variant] || null;
        };
        return (
            <SnackbarContent>
                <Container ref={ref}>
                    <IconWrapper variant={props.variant}>
                        {renderIcon(props.variant)}
                    </IconWrapper>
                    <BlurredIcon>
                        <IconWrapper variant={props.variant}>
                            {renderIcon(props.variant)}
                        </IconWrapper>
                    </BlurredIcon>

                    <MessageWrapper>{props.message}</MessageWrapper>
                    <CloseButton onClick={handleDismiss}>
                        <IoCloseSharp size="1.5em" color="#30362e" />
                    </CloseButton>
                </Container>
            </SnackbarContent>
        );
    },
);

Snackbar.displayName = "Snackbar";

export default Snackbar;

const Container = styled.div`
  box-shadow:
    rgba(0, 0, 0, 0.15) 0px 15px 25px,
    rgba(0, 0, 0, 0.05) 0px 5px 10px;
  background: #1e1e1e;
  color: #d3d3d3;
  border-radius: 20px;
  display: flex;
  width: 400px;
  justify-content: start;
  flex-direction: row !important;
  align-items: center;
  padding: 15px;
  gap: 10px;
  position: relative;
`;

const MessageWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
`;

type IconProps = {
    variant: string;
};
const IconWrapper = styled.div<IconProps>`
  border: none;
  padding: 10px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled.button`
  border: none;
  background: none;
  width: fit-content;
  cursor: pointer;
`;

const BlurredIcon = styled.div`
  position: absolute;
  filter: blur(40px);
  left: -3px;
`;
