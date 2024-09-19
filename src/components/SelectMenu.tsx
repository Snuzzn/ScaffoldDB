import * as Select from "@radix-ui/react-select";
import styled from "styled-components";
import { RxCaretDown } from "react-icons/rx";

const SelectMenu = ({
  attributeType,
  setAttributeType,
}: {
  attributeType: string;
  setAttributeType: (attributeType: string) => void;
}) => {
  return (
    <Select.Root value={attributeType} onValueChange={setAttributeType}>
      <Trigger>
        <Select.Value />
        <Select.Icon>
          <RxCaretDown size="0.6rem" />
        </Select.Icon>
      </Trigger>

      <Select.Portal>
        <Select.Content>
          <StyledSelectViewport>
            <Item value="non-key">
              <Select.ItemText>NK</Select.ItemText>
              <Select.ItemIndicator />
            </Item>

            <Item value="primary-key">
              <Select.ItemText>PK</Select.ItemText>
              <Select.ItemIndicator />
            </Item>

            <Item value="foreign-key">
              <Select.ItemText>FK</Select.ItemText>
              <Select.ItemIndicator />
            </Item>
          </StyledSelectViewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
export default SelectMenu;

const Trigger = styled(Select.Trigger)`
  color: #383838;
  background: none;
  border: none;
  border-bottom: 1px solid #424242;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1em;
  gap: 5px;
  z-index: 2;
`;

const Item = styled(Select.Item)`
  cursor: pointer;
  font-size: 1rem;
  color: white;
  text-align: center;
  border-radius: 5px;
  padding: 5px;
  &:hover {
    background: #202020;
  }
`;

const StyledSelectViewport = styled(Select.Viewport)`
  background-color: #333;
  color: white;
  border-radius: 5px;
  padding: 5px;
`;
