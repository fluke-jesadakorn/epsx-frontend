"use client";

import StockRankTable from "@/components/StockRankTable";
import CardSection from "@/views/components/HeroSection";
import EpsCardSection from "../components/EpsCardSection";
import { Col, Row } from "antd";

export default function HomeView() {
  return (
    <Row justify={"center"} align={"middle"}>
      <Col span={20}>
        <Row
          gutter={[20, 100]}
          style={{ margin: 0 }}
          justify={"center"}
          align={"middle"}
        >
          <CardSection />
          <EpsCardSection />
          <StockRankTable />
        </Row>
      </Col>
    </Row>
  );
}

export const runtime = "edge";
