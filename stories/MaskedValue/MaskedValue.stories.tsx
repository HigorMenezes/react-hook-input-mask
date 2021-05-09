import React from "react";
import { Story, Meta } from "@storybook/react";

import { MaskedValue } from "./MaskedValue";

export default {
  title: "Examples/MaskedValue",
  component: MaskedValue,
  argTypes: {},
} as Meta;

const Template: Story = () => <MaskedValue />;

export const VanillaInput = Template.bind({});
