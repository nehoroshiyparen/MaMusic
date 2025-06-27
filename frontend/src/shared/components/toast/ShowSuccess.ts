import toast from "react-hot-toast";

export const showSuccess = (message: string) => {
    toast.success(message, {
        duration: 4000,
        style: {
            background: '#1f1f1f',
            color: '#00ffcc',
            border: '1px solid #00ffcc',
            borderRadius: '10px',
        },
        icon: '✅'
    })
}