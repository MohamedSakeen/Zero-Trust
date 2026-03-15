/**
 * Real-Time Communication Type Definitions
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5
 */

export interface WebSocketMessage {
  type: 'exam-update' | 'answer-sync' | 'result-update' | 'notification' | 'proctoring-event';
  payload: any;
  timestamp: Date;
  messageId: string;
}

export interface WebSocketConnection {
  connected: boolean;
  reconnecting: boolean;
  lastConnected?: Date;
  connectionId: string;
}

export interface WebSocketConfig {
  url: string;
  reconnectAttempts: number;
  reconnectDelay: number;
  timeout: number;
}

export interface SubscriptionTopic {
  topic: string;
  callback: (message: WebSocketMessage) => void;
}
