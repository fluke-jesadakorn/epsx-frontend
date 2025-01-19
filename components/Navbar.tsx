"use client";

import { useEffect } from "react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useThemeStore, ThemeType } from "@/lib/store/theme";
import { Layout, Menu, Button, Switch, Row } from "antd";
import type { ItemType, MenuItemType } from "antd/es/menu/interface";
import { Typography } from "antd";
import { LogOut, Moon, Sun } from "lucide-react";
import { signOut } from "@/utils/auth";

const { Text } = Typography;
const { Header } = Layout;

// TODO: Add authentication state handling for dynamic menu items
// TODO: Add active link styling based on current route

export default function Navbar() {
  const pathname = usePathname();
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  const menuItemsLtr: ItemType<MenuItemType>[] = [
    {
      label: <Text style={{ cursor: "default" }}>EPSx.ai</Text>,
      key: "0",
    },
    {
      label: <Link href="/">Home</Link>,
      key: "1",
    },
    {
      label: <Link href="/ranking">Rankings</Link>,
      key: "2",
    },
    {
      label: <Link href="/portfolio">Portfolio</Link>,
      key: "3",
    },
    {
      label: <Link href="/services">Services</Link>,
      key: "4",
      children: [
        {
          label: <Link href="/services/manual">Manual</Link>,
          key: "4-1",
        },
        {
          label: <Link href="/portfolio">Portfolio</Link>,
          key: "4-2",
        },
      ],
    },
  ];

  const menuItemsRtl: ItemType<MenuItemType>[] = [
    {
      label: (
        <Switch
          checked={theme === ThemeType.darkTheme}
          onChange={(checked) => {
            setTheme(checked ? ThemeType.darkTheme : ThemeType.lightTheme);
          }}
          checkedChildren={
            <Row align={"middle"} style={{ paddingTop: 3 }}>
              <Moon size={16} />
            </Row>
          }
          unCheckedChildren={
            <Row align={"middle"} style={{ paddingTop: 3 }}>
              <Sun size={16} />
            </Row>
          }
        />
      ),
      key: "0",
    },
    {
      label: (
        <Button
          onClick={async () => {
            const isSignedOut = await signOut();
            if (isSignedOut) redirect("/");
          }}
          type="text"
          icon={<LogOut size={16} />}
        />
      ),
      key: "1",
    },
  ];

  // Map routes to menu item keys
  // Add new routes here when adding new menu items
  const routeToKeyMap: { [key: string]: string } = {
    "/": "1",
    "/ranking": "2",
    "/portfolio": "3",
    "/services": "4",
  };

  // Get current key based on route
  const currentKey = routeToKeyMap[pathname] || "1";

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <Header
      style={{
        display: "flex",
        background: "black",
        padding: 0,
      }}
    >
      <Menu
        style={{
          background: theme.token?.colorBgBase,
          width: "50%",
        }}
        mode="horizontal"
        selectedKeys={[currentKey]}
        items={menuItemsLtr}
      />

      <Menu
        style={{
          background: theme.token?.colorBgBase,
          width: "50%",
          display: "flex",
          justifyContent: "flex-end",
        }}
        mode="horizontal"
        selectedKeys={["0"]}
        items={menuItemsRtl}
      />
    </Header>
  );
}

export const runtime = "edge";
