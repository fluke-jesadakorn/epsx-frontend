import React from "react";
import { Card, Row, Col, Typography } from "antd";
import useSWR from "swr";
import type { Response } from "@/types/stockFetchData";
import { fetcher } from "@/lib/fetchData";
import Image from "next/image";
const { Title } = Typography;
const url = "https://www.investing.com/pro/_/screener-v2/query";
const EPSGrowthCards = () => {
  const { data, error, isLoading } = useSWR<Response, Error>(url, () =>
    fetcher({
      url,
    })
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !data?.columns || !data?.rows) {
    return <div>Error: {error?.message || "Data not found"}</div>;
  }

  return (
    <Row gutter={[5, 5]} style={{ padding: 20 }}>
      {data?.rows.slice(0, 3).map((item, index) => (
        <Col xs={24} sm={12} lg={8} key={index}>
          <Card>
            <Row gutter={[20, 20]} align={"middle"} justify={"start"}>
              <Col style={{ paddingTop: 10 }}>
                {item.asset.logo ? (
                  <Image
                    alt={item.asset.name}
                    src={item.asset.logo}
                    // style={{ height: 50, objectFit: "contain" }}
                    width={50}
                    height={50}
                  />
                ) : null}
              </Col>
              <Title level={2}>{item.asset.name}</Title>
            </Row>
            <p>
              <strong>Ticker:</strong> {item.asset.ticker}
            </p>
            <p>
              <strong>Sector:</strong> {item.asset.sector}
            </p>
            <p>
              <strong>EPS Growth (รายไตรมาส):</strong> {item.data[1].value}
            </p>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default EPSGrowthCards;
