import { useState, useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesComponent = ({ particlesOptions, className, id }) => {
  const [isInitialized, setIsIntialized] = useState(false)

  const particlesInit = useCallback(async (engine) => {
    if(!isInitialized) {
      await loadFull(engine);
      setIsIntialized(true)
    }
  }, [isInitialized]);

  const particlesLoaded = useCallback(async (container) => {
      await container
  }, []);

  return (
    <Particles
      id={id}
      className={className}
      init={particlesInit}
      loaded={particlesLoaded}
      options={particlesOptions}
    />
  );
};

export default ParticlesComponent;