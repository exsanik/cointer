import React from "react";
import UserProfile from "../user-profile/UserProfile";
import AccountsList from "../accounts-list/AccountsList";
import Settings from "../settings/Settings";

const UserPage = () => {
  return (
    <div className="d-flex justify-content-beetween">
      <div className="d-flex flex-column">
        <UserProfile />
        <AccountsList />
      </div>
      <div>
        <Settings />
      </div>
    </div>
  );
};

export default UserPage;
