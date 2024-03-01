import { notification } from "antd";

export function displaySuccessNotification(
    message: string,
    description?: string
) {
    return notification["success"]({
        message,
        description,
        placement: "topLeft",
        style: {
            marginTop: 50,
        },
    });
}