import { Menu, Switch, ConfigProvider, Flex } from "antd";
import Link from "next/link";
import {
  HomeOutlined,
  PieChartOutlined,
  LineChartOutlined,
  UserOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { useThemeStore } from "../lib/store/theme";

const items = [
  {
    label: <Link href="/">Home</Link>,
    key: "home",
    icon: <HomeOutlined />,
  },
  {
    label: <Link href="/portfolio">Portfolio</Link>,
    key: "portfolio",
    icon: <PieChartOutlined />,
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

  return (
    <ConfigProvider theme={theme}>
      <Flex align="center" justify="space-between" content="between">
        <Menu
          mode="horizontal"
          items={items}
          style={{
            justifyContent: "center",
            borderBottom: "none",
            backgroundColor: "transparent",
            padding: "0 24px",
          }}
          theme={isDarkMode ? "dark" : "light"}
        />
        <Switch
          checked={isDarkMode}
          onChange={toggleTheme}
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          style={{ marginRight: 24 }}
        />
      </Flex>
    </ConfigProvider>
  );
}
