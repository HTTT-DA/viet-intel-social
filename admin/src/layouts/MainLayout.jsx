// import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import Logo from "@/assets/logo.svg";
import Divider from "@mui/material/Divider";
import { menu } from "../constants";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HomeIcon from "@mui/icons-material/Home";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const label = { inputProps: { "aria-label": "Switch demo" } };

function MainLayout() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (
  //     !window.localStorage.getItem("userId") ||
  //     !window.localStorage.getItem("email") ||
  //     !window.localStorage.getItem("accessToken")
  //   ) {
  //     navigate("/login");
  //   }
  // }, [navigate]);

  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href="/"
      onClick={handleClick}
    >
      <div className={styles["breadcrumbs-item"]}>
        <HomeIcon />
        Dashboard
      </div>
    </Link>,
    <Link
      underline="hover"
      key="2"
      color="inherit"
      href={window.location.pathname}
      onClick={(e) =>
        handleClick(
          e,
          menu.filter((item) => item.path === window.location.pathname)[0]
            ?.path || "/"
        )
      }
    >
      <div className={styles["breadcrumbs-item"]}>
        {menu.filter((item) => item.path === window.location.pathname)[0]?.icon}
        {
          menu.filter((item) => item.path === window.location.pathname)[0]
            ?.title
        }
      </div>
    </Link>,
  ];

  function handleClick(event, path) {
    event.preventDefault();
    navigate(path);
  }

  return (
    <>
      <div className={styles["layout"]}>
        <div className={styles["side-bar"]}>
          <div className={styles["logo"]}>
            <img className={styles["logo-icon"]} src={Logo} />
            <div className={styles["title"]}>VIETINTELSOCIAL</div>
            <Divider className={styles["divider"]} />
          </div>
          {menu.map((item, i) => (
            <div
              key={i}
              className={
                window.location.pathname === item.path
                  ? styles["menu-item-active"]
                  : styles["menu-item"]
              }
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <div>{item.title}</div>
            </div>
          ))}
        </div>
        <div>
          <div className={styles["header"]}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              {breadcrumbs}
            </Breadcrumbs>
            <div className={styles["header-menu"]}>
              <SettingsIcon />
              <AccountCircleIcon />
              <NotificationsIcon />
            </div>
          </div>
          <Outlet />
        </div>
        <div className={styles[""]}></div>
      </div>
    </>
  );
}

export default MainLayout;
