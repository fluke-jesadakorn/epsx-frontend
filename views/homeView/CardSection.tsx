"use client";

import React from "react";
import { Card, Row, Col, Typography, Button, Space } from "antd";
import { ArrowRight } from "lucide-react";

const { Title, Paragraph } = Typography;

const HomeView = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Row style={{ height: "30vh" }} align="middle" justify="center">
        <Col span={24} style={{ textAlign: "center" }}>
          <Title level={1} style={{ marginBottom: 16 }}>
            Discover the World of Stocks
            <span style={{ color: "#1677FF" }}> with EPSx.ai</span>
          </Title>
          <Paragraph style={{ fontSize: 18 }}>
            Track EPS growth rankings, manage your portfolio, and unlock deeper
            insights for smarter investment decisions.
          </Paragraph>
        </Col>
      </Row>

      <Row gutter={[32, 32]} justify="center" style={{ padding: "0 24px" }}>
        <Col xs={24} md={8}>
          <Card
            hoverable
            style={{ height: "100%" }}
            cover={
              <img
                alt="Global Rankings"
                src="/public/globe.svg"
                style={{ padding: 24 }}
              />
            }
          >
            <Card.Meta
              title="Global Stock Rankings"
              description="View and analyze stock rankings by EPS growth across global markets."
              style={{ marginBottom: 24 }}
            />
            <Button type="primary" icon={<ArrowRight />} size="large" block>
              View Rankings
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            hoverable
            style={{ height: "100%" }}
            cover={
              <img
                alt="Portfolio Management"
                src="/public/file.svg"
                style={{ padding: 24 }}
              />
            }
          >
            <Card.Meta
              title="Portfolio Management"
              description="Organize and optimize your investment portfolio with powerful tools."
              style={{ marginBottom: 24 }}
            />
            <Button type="primary" icon={<ArrowRight />} size="large" block>
              Manage Portfolio
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            hoverable
            style={{ height: "100%" }}
            cover={
              <img
                alt="Premium Features"
                src="/public/window.svg"
                style={{ padding: 24 }}
              />
            }
          >
            <Card.Meta
              title="Premium Features"
              description="Access advanced analytics and exclusive investment insights."
              style={{ marginBottom: 24 }}
            />
            <Button type="primary" icon={<ArrowRight />} size="large" block>
              Subscribe Now
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Future Features Section - Commented Out */}
      {/*
      <Row justify="center" style={{ marginTop: 48 }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Title level={2}>Coming Soon</Title>
          <Paragraph style={{ marginBottom: 32 }}>
            Exciting new features in development
          </Paragraph>
          <Space>
            <Button type="dashed">AI Predictions</Button>
            <Button type="dashed">Market Trends</Button>
            <Button type="dashed">Custom Alerts</Button>
          </Space>
        </Col>
      </Row>
      */}
    </Space>
  );
};

export default HomeView;
