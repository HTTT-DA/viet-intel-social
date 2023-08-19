import { useEffect, useState } from "react";
import { Outlet, useNavigate} from "react-router-dom";
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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";

const label = { inputProps: { "aria-label": "Switch demo" } };

function MainLayout() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (
      !window.localStorage.getItem("userId") ||
      !window.localStorage.getItem("email") ||
      !window.localStorage.getItem("accessToken")
    ) {
      setIsLoggedIn(false);
      navigate("/login");
    } else {
      setUsername(window.localStorage.getItem("username"));
      setIsLoggedIn(true);
    }
  }, [navigate]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("email");
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    navigate("/login");
  }

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
              {isLoggedIn ? ( // Hiển thị dòng "Hi, username" nếu đăng nhập thành công
                <span>Hi, {username}</span>
              ) : null}
              <SettingsIcon />
              {isLoggedIn && (
                <>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenuOpen}
                    color="inherit"
                  >
                    <AccountCircleIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick="#">My Account</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              )}
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
