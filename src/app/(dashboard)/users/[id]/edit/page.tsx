import { getUserIds } from "@dashboardpack/core/lib/data";
import EditUser from "./edit-user";

export function generateStaticParams() {
  return getUserIds().map((id) => ({ id }));
}

export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <EditUser params={params} />;
}
