import type { Metadata } from "next";
import GroupPage from "@/components/group/GroupPage";

export const metadata: Metadata = {
  title: "Star Fly",
  description: "Star Fly",
};


const Group = () => {
  return (
    <GroupPage />
  );
};
export default Group;