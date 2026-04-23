import ProfileUi from "@/src/components/ProfileUi/profileUi";
import React from "react";

const UserProfile = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <ProfileUi userId={id} />;
};

export default UserProfile;
