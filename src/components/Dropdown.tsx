import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import styled from "styled-components";
import { IoChevronDownOutline } from "react-icons/io5";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type MenuItem = {
  name: string;
  icon: React.ReactElement;
  onSelect?: () => void;
  linkUrl?: string;
};

type DropdownMenuProps = {
  children: React.ReactNode;
  items: MenuItem[];
  showChevron?: boolean;
};

const Dropdown = ({
  children,
  items,
  showChevron = false,
  ...triggerProps
}: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);

  const renderItem = (item: MenuItem) => {
    const content = (
      <>
        {item.icon}
        {item.name}
      </>
    );

    const handleSelect = () => {
      if (item.onSelect) {
        item.onSelect();
      }
      setOpen(false); // Close the dropdown after selection
    };
    // If item is a link, make it a Next link
    if (item.linkUrl) {
      return (
        <UnstyledLink href={item.linkUrl} key={item.name}>
          <StyledItem>{content}</StyledItem>
        </UnstyledLink>
      );
    } else {
      // Otherwise, make it a regular menu item with an onSelect handler
      return (
        <StyledItem onSelect={handleSelect} key={item.name}>
          {content}
        </StyledItem>
      );
    }
  };

  return (
    <StyledRoot
      open={open}
      onOpenChange={() => {
        setOpen((open) => !open);
      }}
      modal={false}
    >
      <StyledTrigger {...triggerProps}>
        {children} {showChevron && <IoChevronDownOutline />}
      </StyledTrigger>
      <AnimatePresence>
        {open && (
          <DropdownMenuPrimitive.Portal forceMount>
            <StyledContent align="start" asChild>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  transition: { type: "spring", duration: 0.3 },
                }}
                exit={{ scale: 0, opacity: 0, transition: { duration: 0.1 } }}
              >
                {items.map(renderItem)}
              </motion.div>
            </StyledContent>
          </DropdownMenuPrimitive.Portal>
        )}
      </AnimatePresence>
    </StyledRoot>
  );
};

export default Dropdown;

const UnstyledLink = styled.a`
  text-decoration: none;
`;

const StyledRoot = styled(DropdownMenuPrimitive.Root)`
  width: 100%;
`;

const StyledTrigger = styled(DropdownMenuPrimitive.Trigger)`
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0;
`;

const StyledContent = styled(DropdownMenuPrimitive.Content)`
  min-width: 200px;
  background: ${({ theme }) => theme.background};
  border-radius: 6px;
  padding: 5px;
  box-shadow:
    rgba(0, 0, 0, 0.3) 0px 19px 38px,
    rgba(0, 0, 0, 0.22) 0px 15px 12px;
  transform-origin: top;
  z-index: 3;
  background: #303030;
  color: white;
`;

const StyledItem = styled(DropdownMenuPrimitive.Item)`
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  &:hover {
    background: #262626;
  }
`;
