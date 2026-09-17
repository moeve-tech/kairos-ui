import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileDropzone } from "./FileDropzone";

const meta: Meta<typeof FileDropzone> = {
  title: "Molecules/FileDropzone",
  component: FileDropzone,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof FileDropzone>;

export const Empty: Story = {
  args: { hint: "Video (MP4) o imagen (JPG/PNG), máx. 100MB" },
  render: (args) => (
    <div className="w-96">
      <FileDropzone {...args} onFileSelected={() => {}} />
    </div>
  ),
};

export const WithFileSelected: Story = {
  args: { selectedFileName: "spot-verano-2026.mp4" },
  render: (args) => (
    <div className="w-96">
      <FileDropzone {...args} onFileSelected={() => {}} />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    function Wrapper() {
      const [fileName, setFileName] = useState<string | null>(null);
      return (
        <div className="w-96">
          <FileDropzone hint="Video (MP4) o imagen (JPG/PNG)" selectedFileName={fileName} onFileSelected={(f) => setFileName(f?.name ?? null)} />
        </div>
      );
    }
    return <Wrapper />;
  },
};
