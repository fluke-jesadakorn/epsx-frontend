import HomeTable from "@/components/HomeTable";
import HomeView from "@/views/HomeView";
import { Col, Row } from "antd";

export default function Home() {
  return (
    <Row style={{ padding: "0 20px" }} justify={"center"}>
      <Col>
        <HomeView />
        <HomeTable />
      </Col>
    </Row>
  );
}
