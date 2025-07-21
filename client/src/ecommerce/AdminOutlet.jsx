import { Outlet } from "react-router-dom";

function AdminOutlet() {
  return (
    <>
      <div className="w-full">
        <Outlet />
      </div>
    </>
  );
}

export default AdminOutlet;
