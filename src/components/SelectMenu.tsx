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
        <Value placeholder="Select an option..." />
        <Select.Icon>
          <RxCaretDown size="0.6rem" />
        </Select.Icon>
      </Trigger>

      <Select.Portal>
        <Select.Content>
          <StyledSelectViewport>
            <Select.Item value="non-key">
              <ItemText>NK</ItemText>
              <Select.ItemIndicator />
            </Select.Item>

            <Select.Item value="primary-key">
              <ItemText>PK</ItemText>
              <Select.ItemIndicator />
            </Select.Item>

            <Select.Item value="foreign-key">
              <ItemText>FK</ItemText>
              <Select.ItemIndicator />
            </Select.Item>
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
  font-size: 0.5rem;
  gap: 5px;
`;

const Value = styled(Select.Value)``;

const ItemText = styled(Select.ItemText)`
  color: white;
  font-size: 0.5rem;
`;

const StyledSelectViewport = styled(Select.Viewport)`
  background-color: #333;
  color: white;
  border-radius: 5px;
  padding: 5px;
`;
