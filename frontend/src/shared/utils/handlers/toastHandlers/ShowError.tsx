import toast from "react-hot-toast";
import CustomToast from "shared/components/toast/Toast";

export const showError = (message: string) => {
    toast.dismiss('error')
    toast.custom((t) => (
        <CustomToast
            t={t}
            label="Ошибка"
            text={message}
            PrimaryColor="rgb(127 29 29)"
            SecondaryColor="rgb(239 68 68)"
            ThirdColor="rgb(220 38 38)"
            TextColor="#FFFFFF"
        />
    ), { duration: 4000 });
}