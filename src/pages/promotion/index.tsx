import LuckyWheelContainer from "@/components/luckyWheel";
import { Base } from "@/templates/Base";
import Container from "@mui/material/Container";
import styles from "./styles.module.css";

const LuckyWheel = () => {
  return (
    <Base>
      <div style={{ backgroundColor: "#f4f7fc" }}>
        <Container maxWidth="lg" className={styles.container}>
          <LuckyWheelContainer />
        </Container>
      </div>
    </Base>
  );
};

export default LuckyWheel;
