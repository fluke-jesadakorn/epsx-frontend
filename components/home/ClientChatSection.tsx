"use client";

import { useRef, useState, useEffect, useTransition, useCallback } from "react";
import { Layout, Input, Button, Avatar, Spin, message, theme } from "antd";
import { SendOutlined, UserOutlined, RobotOutlined } from "@ant-design/icons";
import { ChatRequest, Message } from "@/types/chat";
import { chatQuery } from "@/app/actions/chat";
import styled from "@emotion/styled";
const { Content, Footer } = Layout;
const { useToken } = theme;

// TODO: Implement message persistence
// Consider options:
// - Local storage for demo
// - Database integration
// - Redis for real-time chat

interface StyledProps {
  theme: {
    colorBgContainer: string;
    colorBgElevated: string;
    colorPrimary: string;
    colorText: string;
    colorBorder: string;
    borderRadius: number;
    borderRadiusLG: number;
  };
}

interface MessageBubbleProps extends StyledProps {
  isUser: boolean;
}

// Styled components for chat UI
const ChatContainer = styled(Layout)<StyledProps>`
  height: calc(100vh - 6rem);
  background: ${(props: StyledProps) => props.theme.colorBgContainer};
  border-radius: ${(props: StyledProps) => props.theme.borderRadiusLG}px;
  overflow: hidden;
`;

const MessagesContainer = styled(Content)<StyledProps>`
  padding: 24px;
  overflow-y: auto;
  background: ${(props: StyledProps) => props.theme.colorBgContainer};
`;

const MessageBubble = styled.div<MessageBubbleProps>`
  display: flex;
  align-items: start;
  margin-bottom: 24px;
  flex-direction: ${(props: MessageBubbleProps) =>
    props.isUser ? "row-reverse" : "row"};

  .message-content {
    max-width: 80%;
    margin: ${(props: MessageBubbleProps) =>
      props.isUser ? "0 16px 0 0" : "0 0 0 16px"};
    padding: 12px 16px;
    border-radius: ${(props: MessageBubbleProps) => props.theme.borderRadius}px;
    background: ${(props: MessageBubbleProps) =>
      props.isUser ? props.theme.colorPrimary : props.theme.colorBgElevated};
    color: ${(props: MessageBubbleProps) =>
      props.isUser ? "#fff" : props.theme.colorText};
  }
`;

const InputContainer = styled(Footer)<StyledProps>`
  padding: 16px 24px;
  background: ${(props: StyledProps) => props.theme.colorBgContainer};
  border-top: 1px solid ${(props: StyledProps) => props.theme.colorBorder};
`;

const InputWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  gap: 8px;

  .ant-input {
    border-radius: ${(props: any) => props.theme.borderRadius}px;
  }

  .ant-btn {
    border-radius: ${(props: any) => props.theme.borderRadius}px;
  }
`;

export default function ClientChatSection() {
  const { token } = useToken();
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    if (!query.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    // TODO: Save user message to persistent storage

    startTransition(async () => {
      try {
        const chatRequest: ChatRequest = {
          messages: [
            {
              role: "user",
              content: userMessage.content,
            },
          ],
        };
        const result = await chatQuery(chatRequest);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: result.content,
          timestamp: new Date(),
        };

        // TODO: Save assistant message to persistent storage

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        messageApi.error({
          content: "Failed to send message. Please try again.",
          duration: 3,
        });
        console.error("Chat query failed:", error);
      } finally {
        setLoading(false);
      }
    });
  };

  const MessageComponent = ({ message }: { message: Message }) => (
    <MessageBubble isUser={message.role === "user"} theme={token}>
      <Avatar
        icon={message.role === "user" ? <UserOutlined /> : <RobotOutlined />}
        style={{
          backgroundColor:
            message.role === "user" ? token.colorPrimary : token.colorSuccess,
        }}
      />
      <div className="message-content">
        {message.role === "assistant" ? (
          <div dangerouslySetInnerHTML={{ __html: message.content }} />
        ) : (
          <div>{message.content}</div>
        )}
      </div>
    </MessageBubble>
  );

  return (
    <ChatContainer theme={token}>
      {contextHolder}
      <MessagesContainer theme={token}>
        {messages.map((message) => (
          <MessageComponent key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
        {loading && (
          <MessageBubble isUser={false} theme={token}>
            <Avatar
              icon={<RobotOutlined />}
              style={{ backgroundColor: token.colorSuccess }}
            />
            <div className="message-content">
              <Spin size="small" />
            </div>
          </MessageBubble>
        )}
      </MessagesContainer>

      <InputContainer theme={token}>
        <InputWrapper>
          <Input.TextArea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your message here..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={loading}
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSubmit}
            disabled={loading || !query.trim()}
            loading={loading}
          >
            Send
          </Button>
        </InputWrapper>
      </InputContainer>
    </ChatContainer>
  );
}
