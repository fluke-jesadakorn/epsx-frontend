"use client";

import {
  Form,
  Input,
  Button,
  Alert,
  Spin,
  Divider,
  Col,
  Row,
  Typography,
  Checkbox,
  Card,
} from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import GoogleIcon from "@/public/icons/google";
import MicrosoftIcon from "@/public/icons/microsoft";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

const { Title, Text } = Typography;

type AuthFormProps = {
  type: "login" | "register";
  error?: string | null;
  loading?: boolean;
  onSubmit?: (values: { email: string; password: string }) => Promise<void>;
  onOAuthLogin?: (provider: "google" | "azure") => Promise<void>;
  onGoogleLogin?: () => Promise<void>;
  onMicrosoftLogin?: () => Promise<void>;
  action?: (formData: FormData) => Promise<void>;
};

export const AuthForm = ({
  type,
  error,
  loading,
  onSubmit,
  onOAuthLogin,
  action,
}: AuthFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const displayError = error || urlError;

  const handleSubmit = async (values: { email: string; password: string }) => {
    if (onSubmit) {
      await onSubmit(values);
    } else if (action) {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", values.password);
      await action(formData);
    }
  };

  return (
    <Row align={"middle"} justify={"center"} style={{ minHeight: "100vh" }}>
      <Col style={{ maxWidth: 370, width: "100%" }}>
        <Card
          style={{
            transition: "all 0.3s ease",
            textAlign: "center",
            padding: 10,
          }}
        >
          <Col style={{ marginBottom: 24 }}>
            <Title
              style={{
                fontSize: 24,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              {type === "login" ? "Welcome" : "Create Account"}
            </Title>
            <Text type="secondary">
              {type === "login"
                ? "Sign in to continue to your account"
                : "Join our community and get started"}
            </Text>
          </Col>

          {displayError && (
            <Alert
              message={displayError}
              type="error"
              showIcon
              closable
              style={{ marginBottom: 24 }}
            />
          )}

          <Form
            name={type}
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
            layout="vertical"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-300" />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 8, message: "Password must be at least 8 characters" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-300" />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            {type === "register" && (
              <>
                <Form.Item
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("The two passwords do not match!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-300" />}
                    placeholder="Confirm Password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error(
                                "You must accept the terms and conditions"
                              )
                            ),
                    },
                  ]}
                >
                  <Checkbox>
                    I agree to the{" "}
                    <a href="/terms" target="_blank" rel="noopener noreferrer">
                      terms and conditions
                    </a>
                  </Checkbox>
                </Form.Item>
              </>
            )}

            {type === "login" && (
              <Form.Item style={{ textAlign: "right", marginBottom: 24 }}>
                <Row justify="space-between">
                  <Button
                    type="link"
                    onClick={() => router.push("/login/forgot-password")}
                    style={{ padding: 0 }}
                  >
                    Forgot Password?
                  </Button>
                  <Button
                    type="link"
                    onClick={() => router.push("/register")}
                    style={{ padding: 0 }}
                  >
                    Create Account
                  </Button>
                </Row>
              </Form.Item>
            )}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                icon={loading ? <Spin /> : null}
              >
                {type === "login" ? "Sign In" : "Register"}
              </Button>
            </Form.Item>
          </Form>

          <Divider>or</Divider>

          <Col style={{ marginTop: 16, textAlign: "center" }}>
            <Button
              type="default"
              size="large"
              block
              style={{ marginBottom: 8 }}
              icon={<GoogleIcon width={20} height={20} />}
              onClick={async (e) => {
                e.preventDefault();
                try {
                  const url = await onOAuthLogin?.("google");
                  if (url) {
                    window.location.href = url;
                  }
                } catch (error) {
                  console.error("Google login failed:", error);
                }
              }}
            >
              Continue with Google
            </Button>

            <Button
              type="default"
              size="large"
              block
              icon={<MicrosoftIcon width={20} height={20} />}
              onClick={async (e) => {
                e.preventDefault();
                try {
                  const url = await onOAuthLogin?.("azure");
                  if (url) {
                    window.location.href = url;
                  }
                } catch (error) {
                  console.error("Microsoft login failed:", error);
                }
              }}
            >
              Continue with Microsoft
            </Button>
          </Col>
        </Card>
      </Col>
    </Row>
  );
};

const AuthFormWithSuspense = (props: AuthFormProps) => {
  return (
    <Suspense fallback={"Loading..."}>
      <AuthForm {...props} />
    </Suspense>
  );
};

export default AuthFormWithSuspense;

// TODO: Add animation transitions between login/register states
// TODO: Implement password strength meter
// TODO: Add loading states for OAuth buttons
// TODO: Implement two-factor authentication flow
