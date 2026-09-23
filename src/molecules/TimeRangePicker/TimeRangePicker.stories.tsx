import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TimeRangePicker, type TimeRangePickerProps, type TimeRangeValue } from "./TimeRangePicker";

const meta: Meta<typeof TimeRangePicker> = {
  title: "Molecules/TimeRangePicker",
  component: TimeRangePicker,
  tags: ["autodocs"],
  // The popover is absolutely positioned: leave room below the trigger so it isn't clipped in the canvas.
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="min-h-[24rem] max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TimeRangePicker>;

/** Controlled wrapper - the component itself holds no committed value. */
function Controlled(props: Partial<TimeRangePickerProps> & { initial?: TimeRangeValue }) {
  const { initial = { startTime: "", endTime: "" }, ...rest } = props;
  const [range, setRange] = useState<TimeRangeValue>(initial);
  return (
    <div className="space-y-3">
      <TimeRangePicker {...range} onChange={setRange} {...rest} />
      <p className="text-xs text-text-tertiary">Value (always 24 h): {JSON.stringify(range)}</p>
    </div>
  );
}

/** Confirming the start opens the end popover right away. */
export const Empty: Story = {
  render: () => <Controlled />,
};

export const WithRange: Story = {
  render: () => <Controlled initial={{ startTime: "08:00", endTime: "18:30" }} />,
};

/** 12:43 is not on the 5-minute grid: it is still listed, selected and can be kept. */
export const OffStepValue: Story = {
  render: () => <Controlled initial={{ startTime: "12:43", endTime: "20:00" }} />,
};

export const MinuteStep15: Story = {
  render: () => <Controlled minuteStep={15} initial={{ startTime: "09:15", endTime: "" }} />,
};

/** Display only: the emitted value stays 24 h "HH:MM". */
export const Hour12: Story = {
  render: () => <Controlled hour12 initial={{ startTime: "00:00", endTime: "15:30" }} />,
};

export const CustomTexts: Story = {
  render: () => (
    <Controlled
      hour12
      startLabel="Opens"
      endLabel="Closes"
      placeholder="Pick a time"
      labels={{
        hours: "Hours",
        minutes: "Minutes",
        startDialog: "Choose opening time",
        endDialog: "Choose closing time",
        am: "AM",
        pm: "PM",
      }}
    />
  ),
};

/** Narrow screen: the start popover hangs from the left edge and the end popover from the right edge. */
export const Mobile: Story = {
  render: () => <Controlled initial={{ startTime: "09:00", endTime: "" }} />,
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
