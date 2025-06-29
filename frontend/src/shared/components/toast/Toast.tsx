import type { Toast as ToastType } from "react-hot-toast";
import styles from './Toast.module.scss'
import { InfoSvg } from "../svg/icons";

type Props = {
  t: ToastType;
  label: string;
  text: string;
  PrimaryColor: string;
  SecondaryColor: string;
  ThirdColor: string;
  TextColor: string;
};

const CustomToast = ({ t, label, text, PrimaryColor, SecondaryColor, ThirdColor, TextColor }: Props ) => (
    <div 
        className={`${styles.toast} ${t.visible ? styles.enter : styles.leave}`} 
        style={{background: `${PrimaryColor}`, borderLeft: `4px solid ${SecondaryColor}`}}
    >
        <InfoSvg color={`${ThirdColor}`}/>
        <div className={styles.toastText} style={{ color: `${TextColor}`}}>
            {label} - {text}
        </div>
    </div>
)

export default CustomToast