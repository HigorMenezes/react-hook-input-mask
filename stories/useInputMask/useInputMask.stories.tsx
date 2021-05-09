import React from "react";
import { Story, Meta } from "@storybook/react";

import { CustomInput } from "./CustomInput";

export default {
  title: "useInputMask/CustomInput",
  component: CustomInput,
  argTypes: {},
} as Meta;

const Template: Story = () => <CustomInput />;

export const SimpleExample = Template.bind({});
