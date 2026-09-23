import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DateRangePicker, type DateRangePickerProps, type DateRangeValue } from "./DateRangePicker";

const meta: Meta<typeof DateRangePicker> = {
  title: "Molecules/DateRangePicker",
  component: DateRangePicker,
  tags: ["autodocs"],
  // The popover is absolutely positioned: leave room below the trigger so it isn't clipped in the canvas.
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="min-h-[28rem] max-w-xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

/** Controlled wrapper - the component itself holds no committed value. */
function Controlled(props: Partial<DateRangePickerProps> & { initial?: DateRangeValue }) {
  const { initial = { startDate: "", endDate: "" }, ...rest } = props;
  const [range, setRange] = useState<DateRangeValue>(initial);
  return <DateRangePicker {...range} onChange={setRange} {...rest} />;
}

export const Empty: Story = {
  render: () => <Controlled />,
};

export const WithRange: Story = {
  render: () => <Controlled initial={{ startDate: "2026-11-12", endDate: "2026-11-20" }} />,
};

/** Days before `min` are dimmed and not clickable. Here: from today on (computed in local time). */
export const WithMin: Story = {
  render: () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    return <Controlled min={today} />;
  },
};

export const WithMinAndMax: Story = {
  render: () => <Controlled min="2026-11-10" max="2026-12-20" initial={{ startDate: "2026-11-12", endDate: "2026-11-18" }} />,
};

export const CustomTexts: Story = {
  render: () => (
    <Controlled
      startLabel="Check-in"
      endLabel="Check-out"
      placeholder="Pick a date"
      labels={{
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        weekdays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        weekdaysLong: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        dayAriaTemplate: "{weekday}, {month} {day}, {year}",
        previousMonth: "Previous month",
        nextMonth: "Next month",
        clear: "Clear",
        dialog: "Choose dates",
      }}
    />
  ),
};

/** Below the `sm` breakpoint (640px) it shows one month and the popover spans the trigger's width. */
export const Mobile: Story = {
  render: () => <Controlled initial={{ startDate: "2026-11-12", endDate: "2026-11-20" }} />,
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
