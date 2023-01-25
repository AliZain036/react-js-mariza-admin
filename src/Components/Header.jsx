import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { userLogout } from "../Redux/Actions";

const Header = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(userLogout());
    history.push("/auth/login");
  };

  return (
    <div className="d-flex justify-content-end align-items-center headerColor">
      <Button
        icon={<LogoutOutlined />}
        style={{
          fontSize: "16px",
          backgroundColor: "transparent",
          border: "none",
          boxShadow: "none",
          letterSpacing: "1px",
        }}
        className="fw-bold logoutBtn"
        title="Logout"
        type="primary"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
};

export default Header;
