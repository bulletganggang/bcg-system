import {
  WebSocketMessage,
  WebSocketMessageType,
  BCGData,
  HealthStatus,
} from "../types";
import { message as antMessage } from "antd";

// 定义WebSocket消息处理器的类型
type MessageHandler<T> = (data: T) => void;

// 定义消息类型到数据类型的映射
type MessageDataTypeMap = {
  [WebSocketMessageType.BCG_DATA]: BCGData;
  [WebSocketMessageType.HEALTH_STATUS]: HealthStatus;
  [WebSocketMessageType.SYSTEM_MESSAGE]: string;
  [WebSocketMessageType.ERROR]: string;
};

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 3000;
  private messageHandlers: Map<
    WebSocketMessageType,
    MessageHandler<MessageDataTypeMap[WebSocketMessageType]>[]
  > = new Map();

  constructor(url: string) {
    this.url = url;
  }

  /**
   * 连接WebSocket服务器
   */
  connect(): void {
    try {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error("WebSocket连接失败:", error);
      this.reconnect();
    }
  }

  /**
   * 添加消息处理器
   * @param type 消息类型
   * @param handler 处理函数
   */
  addMessageHandler<T extends WebSocketMessageType>(
    type: T,
    handler: MessageHandler<MessageDataTypeMap[T]>
  ): void {
    const handlers = this.messageHandlers.get(type) || [];
    handlers.push(
      handler as MessageHandler<MessageDataTypeMap[WebSocketMessageType]>
    );
    this.messageHandlers.set(type, handlers);
  }

  /**
   * 移除消息处理器
   * @param type 消息类型
   * @param handler 处理函数
   */
  removeMessageHandler<T extends WebSocketMessageType>(
    type: T,
    handler: MessageHandler<MessageDataTypeMap[T]>
  ): void {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(
        handler as MessageHandler<MessageDataTypeMap[WebSocketMessageType]>
      );
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * 发送消息
   * @param message 消息内容
   */
  send(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      antMessage.error("WebSocket未连接");
    }
  }

  /**
   * 关闭连接
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  private handleOpen(): void {
    console.log("WebSocket连接成功");
    this.reconnectAttempts = 0;
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      const handlers = this.messageHandlers.get(message.type);
      if (handlers) {
        handlers.forEach((handler) =>
          handler(message.data as MessageDataTypeMap[typeof message.type])
        );
      }
    } catch (error) {
      console.error("消息处理失败:", error);
    }
  }

  private handleClose(): void {
    console.log("WebSocket连接关闭");
    this.reconnect();
  }

  private handleError(error: Event): void {
    console.error("WebSocket错误:", error);
    this.reconnect();
  }

  private reconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `尝试重新连接 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );
      setTimeout(() => this.connect(), this.reconnectTimeout);
    } else {
      antMessage.error("WebSocket连接失败,请检查网络连接");
    }
  }
}
