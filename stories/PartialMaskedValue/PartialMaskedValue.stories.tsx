import React from "react";
import { Story, Meta } from "@storybook/react";

import { PartialMaskedValue } from "./PartialMaskedValue";

export default {
  title: "Examples/PartialMaskedValue",
  component: PartialMaskedValue,
  argTypes: {},
} as Meta;

const Template: Story = () => <PartialMaskedValue />;

export const VanillaInput = Template.bind({});
