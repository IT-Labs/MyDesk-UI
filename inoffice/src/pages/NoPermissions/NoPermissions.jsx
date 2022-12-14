import React from "react";
import MainLayout from "../../layouts/MainLayout";

const NoPermissions = () => {
  return (
    <MainLayout isHome={true}>
      <div className="acccess-denied-wrap">
        <h1>401: Sorry, You Are Not Allowed to Access This Page</h1>
      </div>
    </MainLayout>
  );
};

export default NoPermissions;
