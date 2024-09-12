// src/utils/message.ts
import { message as antdMessage } from 'ant-design-vue';

// 定义消息类型的接口
type MessageType = 'success' | 'error' | 'info' | 'warning';

export const openMessage = (type: MessageType, content: string, duration?: number) => {
    antdMessage[type]({
        content,
        duration, // duration 默认为 3 秒
    });
};
