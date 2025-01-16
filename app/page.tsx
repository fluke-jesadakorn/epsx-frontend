// Test hot reload
import StockRankTable from "@/components/StockRankTable";
import HomeView from "@/views/HomeView";
import { Col, Row } from "antd";

export default function Home() {
  return (
    <Row style={{ padding: "0 20px" }} justify={"center"}>
      <Col>
        <HomeView />
        <StockRankTable />
      </Col>
    </Row>
  );
}

export const runtime = "edge";
