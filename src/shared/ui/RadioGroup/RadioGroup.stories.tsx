import { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "./RadioGroup";
import { ComponentProps, useState } from "react";
import { Radio } from "./Radio";

const meta: Meta<typeof RadioGroup> = {
  title: 'Component/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: false,
      table: {type: {summary: "string" }}
    },
    onChange: {
      action: "changed"
    },
    label: {
      control: "text"
    },
    name: {
      control: "text"
    },
  },
  args: {
    label: ''
  }
}

export default meta;
type Story = StoryObj<typeof meta>;

function TeachLearnRadioGroup(props: ComponentProps<typeof RadioGroup>) {
  const [value, setValue] = useState(props.value);
  return (
    <RadioGroup {...props}
    value = {value}
    name="teachlearn"
    onChange={(next) => {
      setValue(next);
      props.onChange(next);
    }}>
      <Radio value="everything" label="Всё" />
      <Radio value="wantlearn" label="Хочу научиться" />
      <Radio value="canteach" label="Могу научить" />
    </RadioGroup>
  )
}

function GenderRadioGroup(props: ComponentProps<typeof RadioGroup>) {
  const [value, setValue] = useState(props.value);
  return (
    <RadioGroup {...props}
    value = {value}
    label="Пол автора"
    name="gender"
    onChange={(next) => {
      setValue(next);
      props.onChange(next);
    }}>
      <Radio value="all" label="Не имеет значения" />
      <Radio value="male" label="Мужской" />
      <Radio value="female" label="Женский" />
    </RadioGroup>
  )
}

export const WithoutLabel: Story = {
  render: (args) => <TeachLearnRadioGroup {...args} value="everything" />
}

export const WithLabel: Story = {
  render: (args) => <GenderRadioGroup {...args} value="all" />
}