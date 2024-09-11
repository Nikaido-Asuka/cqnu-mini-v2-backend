import { notification } from 'ant-design-vue';

// 
export const openNotificationWithIcon = (type: string, message: string, description: string) => {
    notification[type]({
        message: message,
        description: description,
    });
}