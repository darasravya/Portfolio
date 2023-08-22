import ParticlesComponent from "./ParticlesComponent";
import styles from "./Particles.module.scss";
import { heroOptions } from "./particlesOptions";

const Particles = () => {
  return (
      <ParticlesComponent
        id={styles["particles"]}
        className="w-full h-screen z-0 min-h-[800px]"
        particlesOptions={heroOptions}
      />
  );
};

export default Particles;