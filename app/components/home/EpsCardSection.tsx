import React from "react";
import { Card, Row, Col, Typography, Flex } from "antd";
import type { CSSProperties } from "react";

interface EpsCardSectionProps {
  style?: CSSProperties;
}
import useSWR from "swr";
import type { Response } from "@/types/stockFetchData";
import { fetcher } from "@/lib/fetchData";
import Image from "next/image";
const { Title, Text } = Typography;

const url = "https://www.investing.com/pro/_/screener-v2/query";
const EpsCardSection: React.FC<EpsCardSectionProps> = ({ style }) => {
  const { data } = useSWR<Response, Error>(url, () =>
    fetcher({
      url,
    })
  );

  return (
    <Row gutter={[16, 16]} style={{ width: "100%", ...style }}>
      {data?.rows.slice(0, 3).map((item, index) => (
        <Col key={index} xs={24} sm={24} md={8} lg={8} xl={8}>
          <Card
            style={{
              minHeight: 300,
            }}
          >
            <Flex vertical={true} align={"flex-start"}>
              {item.asset.logo ? (
                <Image
                  alt={item.asset.name}
                  src={item.asset.logo}
                  width={50}
                  height={50}
                />
              ) : null}
              <Title level={2}>{item.asset.name}</Title>
              <Text>Ticker: {item.asset.ticker}</Text>
              <Text>Sector: {item.asset.sector}</Text>
              <Text>EPS Growth: {item.data[1].value}</Text>
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default EpsCardSection;
