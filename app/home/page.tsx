import StockRankTable from "@/components/StockRankTable";
import HeroSection from "@/app/components/home/HeroSection";
import EpsCardSection from "@/app/components/home/EpsCardSection";
import { Col, Row } from "antd";
import { fetchEpsGrowthRanking } from "@/app/actions/stockData";

async function getEpsData() {
  try {
    const data = await fetchEpsGrowthRanking({ limit: 3, skip: 0 });
    return data.data;
  } catch (error) {
    console.error("Failed to fetch EPS growth ranking:", error);
    return [];
  }
}

// TODO: Future features
// - Add error boundary component for better error handling
// - Add loading UI for streaming
// - Add error reporting to external service
// - Add data prefetching for improved performance
// - Add client-side caching for reduced server load

export default async function HomeView() {
  const epsData = await getEpsData();

  return (
    <Row justify={"center"} align={"middle"} style={{ minHeight: "100vh" }}>
      <Col span={20}>
        <Row
          gutter={[20, 40]} // Reduced vertical gutter to prevent large jumps
          style={{ margin: 0, padding: "24px 0" }}
          justify={"center"}
          align={"middle"}
        >
          <HeroSection style={{ minHeight: "400px" }} />
          <EpsCardSection style={{ minHeight: "300px" }} data={epsData} />
          <StockRankTable style={{ minHeight: "500px" }} />
        </Row>
      </Col>
    </Row>
  );
}

export const runtime = "edge";
