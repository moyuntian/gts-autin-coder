import { useState, useEffect } from "react";
import { Tooltip, Dropdown } from "antd";
import { Icon } from "../../../assets/shared/icon.jsx";
import { useApp } from "../../context.jsx";
import "./index.css";

const USER_MENU = {
  items: [
    { key: "profile", label: "个人中心", icon: <Icon name="user" size="0.875rem" /> },
    { key: "setting", label: "系统设置", icon: <Icon name="settings" size="0.875rem" /> },
    { type: "divider" },
    { key: "logout", label: "退出登录", icon: <Icon name="log-out" size="0.875rem" /> },
  ],
};

export default function AppHeader() {
  const { isDark, toggleDark } = useApp();
  const [immersive, setImmersive] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => setImmersive(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    const next = !immersive;
    setImmersive(next);
    try {
      if (next && document.documentElement.requestFullscreen) {
        const p = document.documentElement.requestFullscreen();
        if (p && p.catch) p.catch(() => {});
      } else if (!next && document.exitFullscreen) {
        const p = document.exitFullscreen();
        if (p && p.catch) p.catch(() => {});
      }
    } catch (e) {
      /* 全屏不可用时仅切换页内提示条 */
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="app-header__left">
          <Tooltip title="导航">
            <a className="app-header__action">
              <Icon name="menu" size="20px" />
            </a>
          </Tooltip>
          <div className="app-header__brand">
            <span className="app-header__logo">
              <Icon name="boxes" size="1rem" />
            </span>
            <span className="app-header__name">iMaster MAE</span>
            <span className="app-header__divider" />
            <span className="app-header__sub">网络智能体管理</span>
          </div>
        </div>

        <div className="app-header__right">
          <Tooltip title="帮助">
            <a className="app-header__action">
              <Icon name="circle-question-mark" size="20px" />
            </a>
          </Tooltip>
          <Tooltip title={immersive ? "退出全屏" : "全屏"}>
            <a className="app-header__action" onClick={toggleFullscreen}>
              <Icon name={immersive ? "shrink" : "fullscreen"} size="20px" />
            </a>
          </Tooltip>
          <Tooltip title={isDark ? "切换为浅色模式" : "切换为深色模式"}>
            <a className="app-header__action" onClick={toggleDark}>
              <Icon name={isDark ? "sun" : "moon"} size="20px" />
            </a>
          </Tooltip>
          <span className="app-header__sep" />
          <Dropdown menu={USER_MENU} trigger={["click"]} placement="bottomRight">
            <a className="app-header__user">
              <img className="app-header__avatar" src="./assets/uploads/user.png" alt="" />
              <span className="app-header__username">Admin</span>
              <Icon name="chevron-down" size="0.75rem" className="app-header__caret" />
            </a>
          </Dropdown>
        </div>
      </header>

      {immersive ? (
        <div className="app-header__tip">若要退出全屏模式，请按住 Esc</div>
      ) : null}
    </>
  );
}
