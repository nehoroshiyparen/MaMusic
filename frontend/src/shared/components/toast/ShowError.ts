import toast from "react-hot-toast";

export const showError = (message: string) => {
    toast.dismiss('error')
    toast.error(message, {
        duration: 4000,
        style: {
            background: '#1f1f1f',
            color: '#ff5555',
            border: '1px solid #ff5555',
            borderRadius: '10px',
        },
        icon: '❌', 
        id: 'error'
    })
}