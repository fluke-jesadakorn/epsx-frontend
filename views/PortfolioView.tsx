"use client";
import { Card, Row, Col, Statistic, Table, Typography } from "antd";
import React from "react";
const { Title } = Typography;

// Mock data for EPS visualization
const epsData = [
  { quarter: "Q1 2024", eps: 1.25 },
  { quarter: "Q2 2024", eps: 1.45 },
  { quarter: "Q3 2024", eps: 1.60 },
  { quarter: "Q4 2024", eps: 1.80 },
];

const portfolioData = [
  {
    key: "1",
    ticker: "AAPL",
    name: "Apple Inc.",
    allocation: "25%",
    return: "+12.5%",
    sector: "Technology",
  },
  {
    key: "2",
    ticker: "TSLA",
    name: "Tesla Inc.",
    allocation: "15%",
    return: "+8.2%",
    sector: "Automotive",
  },
  {
    key: "3",
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    allocation: "20%",
    return: "+10.1%",
    sector: "Technology",
  },
];

const columns = [
  {
    title: "Ticker",
    dataIndex: "ticker",
    key: "ticker",
  },
  {
    title: "Company Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Allocation",
    dataIndex: "allocation",
    key: "allocation",
  },
  {
    title: "Return",
    dataIndex: "return",
    key: "return",
  },
  {
    title: "Sector",
    dataIndex: "sector",
    key: "sector",
  },
];

const PortfolioView = () => {
  return (
    <div className="p-4 sm:p-6">
      <Title level={2} className="mb-4 sm:mb-6 text-lg sm:text-xl">
        Investment Dashboard
      </Title>

      {/* Key Metrics Section */}
      <Row gutter={[16, 16]} className="mb-4 sm:mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Portfolio Value"
              value={1250000}
              precision={2}
              prefix="$"
              className="text-sm sm:text-base"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="YTD Return"
              value={12.5}
              precision={2}
              suffix="%"
              className="text-sm sm:text-base"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Current EPS"
              value={1.45}
              precision={2}
              className="text-sm sm:text-base"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Dividend Yield"
              value={2.15}
              precision={2}
              suffix="%"
              className="text-sm sm:text-base"
            />
          </Card>
        </Col>
      </Row>

      {/* EPS Visualization Section */}
      <Card
        title="Earnings Per Share (EPS) Growth"
        className="mb-4 sm:mb-6"
      >
        <div className="overflow-x-auto">
          <Table
            dataSource={epsData}
            columns={[
              { title: "Quarter", dataIndex: "quarter", key: "quarter" },
              { title: "EPS", dataIndex: "eps", key: "eps" },
            ]}
            pagination={false}
            scroll={{ x: true }}
            size="middle"
          />
        </div>
      </Card>

      {/* Portfolio Management Section */}
      <Card title="Global Portfolio Overview">
        <div className="overflow-x-auto">
          <Table
            dataSource={portfolioData}
            columns={columns}
            pagination={false}
            scroll={{ x: true }}
            size="middle"
          />
        </div>
      </Card>

      {/* TODO: Add chart visualization for EPS growth */}
      {/* TODO: Implement portfolio allocation pie chart */}
      {/* TODO: Add filter options for portfolio table */}
    </div>
  );
};

export default PortfolioView;
