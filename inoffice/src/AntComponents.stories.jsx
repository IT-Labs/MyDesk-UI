import { Meta, Canvas, Story } from "@storybook/addon-docs";
import {
  Button,
  Modal as ModalComponent,
  Select,
  Input,
  Checkbox,
  Dropdown,
  Menu,
  DatePicker,
  Space,
} from "antd";
import { useState } from "react";

export default {
  title: "Antd Components",
  component: Space,
};

export const SelectField = () => {
  return (
    <>
      <p>Select Field</p>
      <span>
        A dropdown menu for displaying choices - an elegant alternative to the
        native {"<select>"} element.
        <br />
      </span>
      <Select showSearch style={{ width: 200 }} placeholder="Placeholder text">
        <Select.Option key={1} value={"Value 1"}>
          Value 1
        </Select.Option>
        <Select.Option key={2} value={"Value 2"}>
          Value 2
        </Select.Option>
        <Select.Option key={3} value={"Value 3"}>
          Value 3
        </Select.Option>
      </Select>
    </>
  );
};

export const InputField = () => {
  return (
    <>
      <span>
        A basic widget for getting the user input is a text field. Keyboard and
        mouse can be used for providing or changing data.
      </span>
      <br />
      <Input />
    </>
  );
};

export const CheckboxField = () => {
  return (
    <>
      <span>Used for selecting multiple values from several options.</span>
      <br />
      <Checkbox />
    </>
  );
};

export const DropdownField = () => {
  return (
    <>
      <span>
        When there are more than a few options to choose from, you can wrap them
        in a Dropdown. By hovering or clicking on the trigger, a dropdown menu
        will appear, which allows you to choose an option and execute the
        relevant action.
      </span>
      <br />
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item>Single monito</Menu.Item>
            <Menu.Item>Dual monitor</Menu.Item>
          </Menu>
        }
      >
        <Button>Click</Button>
      </Dropdown>
    </>
  );
};

export const RangePicker = () => {
  return (
    <Space direction="vertical" size={12}>
      <span>
        Range Picker is used to select a range of dates, by default you can
        select any dates but you can configure it to be only able to select past
        or future dates.
      </span>

      <DatePicker.RangePicker style={{ width: "100%" }} />
    </Space>
  );
};

export const Modal = () => {
  const [visible, setVisible] = useState(false);
  const handleClick = () => {
    setVisible(!visible);
  };
  return (
    <>
      <span>
        A modal (also called a modal window or lightbox) is a web page element
        that displays in front of and deactivates all other page content. To
        return to the main content, the user must engage with the modal by
        completing an action or by closing it. Modals are often used to direct
        users’ attention to an important action or piece of information on a
        website or application.
      </span>
      <br />
      <Button type="primary" onClick={handleClick}>
        Click for modal
      </Button>
      <ModalComponent
        visible={visible}
        onOk={handleClick}
        onCancel={handleClick}
      >
        <p>This is a modal</p>
      </ModalComponent>
    </>
  );
};
