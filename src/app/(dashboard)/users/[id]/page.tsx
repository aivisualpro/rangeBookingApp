import { getUserIds } from "@dashboardpack/core/lib/data";
import UserDetail from "./user-detail";

export function generateStaticParams() {
  return getUserIds().map((id) => ({ id }));
}

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <UserDetail params={params} />;
}
