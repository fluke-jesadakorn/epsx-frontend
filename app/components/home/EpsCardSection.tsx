"use client";
import React from "react";
import { Card, Row, Col, Typography, Flex } from "antd";
import type { CSSProperties } from "react";

interface EpsCardSectionProps {
  style?: CSSProperties;
  data?: EpsData[];
}

interface EpsData {
  current: {
    symbol: string;
    companyName: string;
    eps: number;
    epsGrowthPercent: number;
    reportDate: string;
    recommendationType?: "BUY" | "SELL";
    startDate?: string;
  };
  previous: {
    symbol: string;
    companyName: string;
    eps: number;
    epsGrowthPercent: number;
    reportDate: string;
    startDate?: string;
  };
}

const { Title, Text } = Typography;

// TODO: Future feature - Add pagination support
// TODO: Future feature - Add sorting options
// TODO: Future feature - Add SSR revalidation strategy
// TODO: Future feature - Add filters for buy/sell stock rankings
// TODO: Future feature - Add ranking indicators (1st, 2nd, 3rd place)
// TODO: Future feature - Add stock performance metrics visualization
const EpsCardSection: React.FC<EpsCardSectionProps> = ({
  style,
  data = [],
}) => {
  if (!data || !Array.isArray(data)) {
    return (
      <Row gutter={[16, 16]} style={{ width: "100%", ...style }}>
        <Col span={24}>
          <Card>
            <Text type="warning">No EPS data available.</Text>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <Row gutter={[16, 16]} style={{ width: "100%", ...style }}>
      {data.map((item, index) => (
        <Col key={index} xs={24} sm={24} md={8} lg={8} xl={8}>
          <Card
            style={{
              minHeight: 300,
            }}
          >
            <Flex vertical={true} align={"flex-start"}>
              <Title level={2} style={{ marginBottom: "8px" }}>
                {item.current.companyName}
              </Title>
              <Text>Symbol: {item.current.symbol}</Text>
              <Text>
                Start Buy{" "}
                {new Date(item.current.reportDate).toLocaleDateString()}
              </Text>
              <Text>
                Stop or wait and Hold:{" "}
                {new Date(item.previous.reportDate).toLocaleDateString()}
              </Text>
              <Text>Current EPS: {item.current.eps.toFixed(2)}</Text>
              <Text>Previous EPS: {item.previous.eps.toFixed(2)}</Text>
              <Text>Growth: {item.current.epsGrowthPercent}%</Text>
              {item.current.startDate && (
                <Text
                  style={{
                    color:
                      item.current.recommendationType === "BUY"
                        ? "#52c41a"
                        : "#ff4d4f",
                  }}
                >
                  {item.current.recommendationType} Start Date:{" "}
                  {new Date(item.current.startDate).toLocaleDateString()}
                </Text>
              )}
              {item.previous.startDate && (
                <Text type="secondary">
                  Previous Start Date:{" "}
                  {new Date(item.previous.startDate).toLocaleDateString()}
                </Text>
              )}
              {index < 3 && (
                <Text
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    fontWeight: "bold",
                    color:
                      index === 0
                        ? "#FFD700"
                        : index === 1
                        ? "#C0C0C0"
                        : "#CD7F32",
                  }}
                >
                  #{index + 1}
                </Text>
              )}
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default EpsCardSection;
