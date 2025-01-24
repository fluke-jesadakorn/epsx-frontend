"use client";

import StockRankTable from "@/components/StockRankTable";
import CardSection from "@/app/components/home/HeroSection";
import EpsCardSection from "@/app/components/home/EpsCardSection";
import { Col, Row } from "antd";

export default function HomeView() {
  return (
    <Row justify={"center"} align={"middle"} style={{ minHeight: '100vh' }}>
      <Col span={20}>
        <Row
          gutter={[20, 40]} // Reduced vertical gutter to prevent large jumps
          style={{ margin: 0, padding: '24px 0' }}
          justify={"center"}
          align={"middle"}
        >
          {/* TODO: Add loading skeletons for async components */}
          <CardSection style={{ minHeight: '400px' }} />
          <EpsCardSection style={{ minHeight: '300px' }} />
          <StockRankTable style={{ minHeight: '500px' }} />
        </Row>
      </Col>
    </Row>
  );
}

export const runtime = "edge";
