import { createAuthClient } from "better-auth/react"
import { oneTapClient  } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.BETTER_AUTH_URL,

    plugins: [
        oneTapClient({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            autoSelect: true, // Hiển thị tên + email nếu đã đăng nhập trước đó
            cancelOnTapOutside: true, // Tắt khi click ra ngoài
            context:"signin",
            additionalOptions: {
                prompt_parent_id: "gsi-button", // ID của phần tử để render nút
            },
            promptOptions: {
                baseDelay: 1000, // Thời gian chờ trước khi hiển thị nút
                maxAttempts: 5, // Số lần thử tối đa
            }
        }),
    ],
});