"use client";

import StockRankTable from "@/components/StockRankTable";
import CardSection from "@/views/homeView/CardSection";
import { Col, Row } from "antd";

export default function HomeView() {
  return (
    <Row style={{ padding: "0 20px" }} justify={"center"}>
      <Col span={20}>
        <CardSection />
        <StockRankTable />
      </Col>
    </Row>
  );
}

export const runtime = "edge";
