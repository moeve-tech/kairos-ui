import type { Meta, StoryObj } from "@storybook/react";
import { Snackbar } from "./Snackbar";

const meta: Meta<typeof Snackbar> = {
  title: "Atoms/Snackbar",
  component: Snackbar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Snackbar>;

export const Success: Story = {
  args: { message: "Datos de mercado actualizados correctamente", tone: "success" },
};

export const Danger: Story = {
  args: { message: "No se pudieron actualizar los datos", tone: "danger" },
};

export const Neutral: Story = {
  args: { message: "Sin cambios desde la última actualización", tone: "neutral" },
};
