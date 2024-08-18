import Image from "next/image";
import VNMKLogo from "../../public/assets/icons/vnmk_logo.jpg";

const vnmkIcon = () => (
    <Image src={VNMKLogo} width={36} height={36} alt="logo vnmk" style={{borderRadius: 8}} />
)

export default vnmkIcon;