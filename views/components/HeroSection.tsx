"use client";

import React from "react";
import { Row, Typography, theme } from "antd";

const { Title, Paragraph } = Typography;

const HomeView = () => {
  return (
    <Row
      style={{ height: "30vh", width: "100%" }}
      align="middle"
      justify="center"
    >
      <Row align={"middle"} justify={"center"} style={{ textAlign: "center" }}>
        <Title level={1} style={{ marginBottom: 16 }}>
          Discover the World of Stocks{" "}
          <span style={{ color: "#1fc7d4" }}>with EPSx</span>
        </Title>
        <Paragraph style={{ fontSize: 18 }}>
          Track EPS growth rankings, manage your portfolio, and unlock deeper
          insights for smarter investment decisions.
        </Paragraph>
      </Row>
    </Row>
  );
};

export default HomeView;
