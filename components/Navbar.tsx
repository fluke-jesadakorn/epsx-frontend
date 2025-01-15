"use client";

import { useEffect } from "react";
import { signOut } from "@/lib/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useThemeStore } from "@/lib/store/theme";
import { Layout, Menu, Button } from "antd";
import type { ItemType, MenuItemType } from "antd/es/menu/interface";
import { Typography } from "antd";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
const { Text } = Typography;
const { Header } = Layout;

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
    label: <Link href="/portfolio/assets/ranking">Rankings</Link>,
    key: "2",
  },
  {
    label: <Link href="/portfolio/management">Portfolio</Link>,
    key: "3",
  },
  {
    label: <Link href="/services/manual">Subscribe</Link>,
    key: "4",
  },
];

const menuItemsRtl: ItemType<MenuItemType>[] = [
  {
    label: (
      <Button
        onClick={async () => {
          await signOut();
          return redirect("/");
        }}
        type="text"
        icon={<LogOut size={16} />}
      />
    ),
    key: "1",
  },
];
// TODO: Add authentication state handling for dynamic menu items
// TODO: Add active link styling based on current route

export default function Navbar() {
  const pathname = usePathname();
  const theme = useThemeStore((state) => state.theme);
  const initializeTheme = useThemeStore((state) => state.initializeTheme);

  // Map routes to menu item keys
  // Add new routes here when adding new menu items
  const routeToKeyMap: { [key: string]: string } = {
    "/": "1",
    "/portfolio/assets/ranking": "2",
    "/portfolio/management": "3",
    "/services/manual": "4",
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
