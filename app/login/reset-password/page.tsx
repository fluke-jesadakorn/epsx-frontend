"use client";

import { useState, useEffect } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
// Migrated from createClientComponentClient to server-side client
// Using relative path since utils is at root level
import { createServerClient } from "@/utils/supabase/server";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  Input,
  Button,
  Alert,
  Skeleton,
  Divider,
  Col,
  Row,
  Typography,
} from "antd";
import { LockOutlined } from "@ant-design/icons";

const { Title } = Typography;

// Zod schema for form validation
const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    const initializeSupabase = async () => {
    const client = await createServerClient();
    setSupabase(client);
    };
    initializeSupabase();
  }, []);

  const {
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (values: ResetPasswordForm) => {
    if (!supabase) {
      setError("Authentication system is still initializing. Please try again.");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    router.push("/login");
  };

  return (
    <Row align={"middle"} justify={"center"} style={{ minHeight: "100vh" }}>
      <Col xs={20} sm={12} md={8} lg={6}>
        <Title
          style={{
            fontSize: 24,
            fontWeight: 600,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          Reset Password
        </Title>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            style={{ marginBottom: 24 }}
          />
        )}

        {success && (
          <Alert
            message="Password reset successfully! Redirecting to login..."
            type="success"
            showIcon
            closable
            style={{ marginBottom: 24 }}
          />
        )}

        <Form
          name="reset-password"
          initialValues={{ remember: true }}
          onFinish={handleSubmit(onSubmit)}
          layout="vertical"
        >
          <Form.Item
            name="password"
            validateStatus={errors.password ? "error" : ""}
            help={errors.password?.message}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-300" />}
              placeholder="New Password"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            validateStatus={errors.confirmPassword ? "error" : ""}
            help={errors.confirmPassword?.message}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-300" />}
              placeholder="Confirm New Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              icon={loading ? (
                <Skeleton.Avatar 
                  active 
                  size="small" 
                  shape="circle" 
                  style={{ marginRight: 8 }}
                />
              ) : null}
              // TODO: Add skeleton loading for form fields
              // TODO: Implement progress indicators
              // TODO: Add loading states for navigation
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>

        <Divider>or</Divider>

        <Col style={{ marginTop: 16, textAlign: "center" }}>
          <Button
            type="link"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </Button>
        </Col>
      </Col>
    </Row>
  );
};

export default ResetPasswordPage;
export const runtime = 'edge';
