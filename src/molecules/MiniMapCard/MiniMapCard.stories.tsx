import type { Meta, StoryObj } from "@storybook/react";
import { MiniMapCard } from "./MiniMapCard";

const meta: Meta<typeof MiniMapCard> = {
  title: "Molecules/MiniMapCard",
  component: MiniMapCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof MiniMapCard>;

export const Default: Story = {
  args: {
    overlayTitle: "COMPETIDORES DIRECTOS",
    overlayLinkLabel: "Basado en 3 competidores clave",
    competitorCount: 3,
  },
  render: (args) => (
    <div className="w-80">
      <MiniMapCard {...args} />
    </div>
  ),
};
