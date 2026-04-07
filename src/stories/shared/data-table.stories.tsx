import type { Meta, StoryObj } from "@storybook/react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@dashboardpack/core/components/shared/data-table";

interface SampleRow {
  id: string;
  name: string;
  email: string;
  status: string;
  amount: number;
}

const sampleData: SampleRow[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    status: "Active",
    amount: 250,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    status: "Inactive",
    amount: 150,
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    status: "Active",
    amount: 350,
  },
  {
    id: "4",
    name: "Diana Prince",
    email: "diana@example.com",
    status: "Pending",
    amount: 450,
  },
  {
    id: "5",
    name: "Edward Norton",
    email: "edward@example.com",
    status: "Active",
    amount: 550,
  },
];

const columns: ColumnDef<SampleRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
  },
];

const meta: Meta<typeof DataTable> = {
  title: "Shared/DataTable",
  component: DataTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof DataTable>;

export const Default: Story = {
  render: () => <DataTable columns={columns} data={sampleData} />,
};

export const WithSearch: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={sampleData}
      searchPlaceholder="Search users..."
    />
  ),
};

export const WithRowSelection: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={sampleData}
      enableRowSelection
      searchPlaceholder="Search users..."
    />
  ),
};

export const Empty: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={[]}
      emptyMessage="No users found."
    />
  ),
};
