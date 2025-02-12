import { Menu, Switch, ConfigProvider, Flex, Button } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeOutlined,
  LineChartOutlined,
  UserOutlined,
  MoonOutlined,
  SunOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useThemeStore } from "@/lib/store/theme";
import { logout } from "@/app/actions/auth";

const items = [
  {
    label: <Link href="/">Home</Link>,
    key: "home",
    icon: <HomeOutlined />,
  },
  {
    label: <Link href="/ranking">Ranking</Link>,
    key: "ranking",
    icon: <LineChartOutlined />,
  },
  {
    label: <Link href="/settings">Settings</Link>,
    key: "settings",
    icon: <UserOutlined />,
  },
];

export default function Navbar() {
  const { theme, isDarkMode, toggleTheme } = useThemeStore();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
      // TODO: Show error notification to user
    }
  };

  return (
    <ConfigProvider theme={theme}>
      <Flex align="center" justify="space-between" content="between">
        <Menu
          mode="horizontal"
          items={items}
          selectedKeys={[pathname === "/" ? "home" : pathname.split("/")[1]]}
          style={{
            justifyContent: "center",
            borderBottom: "none",
            padding: "0 24px",
            background: "transparent",
          }}
        />
        <Flex gap={8}>
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            style={{ marginTop: 6 }}
          />
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ marginRight: 8 }}
          >
            Logout
          </Button>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
}
