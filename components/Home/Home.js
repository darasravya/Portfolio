import { useEffect, useRef } from "react";
import Image from "next/image";
import Typed from "typed.js";
import { gsap, Linear } from "gsap";
import { MENULINKS, TYPED_STRINGS } from "../../constants";
import styles from "./Home.module.scss";
import Button from "../Button/Button";
import Profiles from "../Profiles/Profiles";

const Home = () => {

  const typedEl = useRef(null);
  const targetSection = useRef(null);

  useEffect(() => {
    const options = {
      strings: TYPED_STRINGS,
      typeSpeed: 50,
      startDelay: 1500,
      backSpeed: 50,
      backDelay: 2000,
      loop: true,
    };
    const typed = new Typed(typedEl.current, options);

    const revealTl = gsap.timeline({ defaults: { ease: Linear.easeNone } });
    revealTl
      .to(targetSection.current, { opacity: 1, duration: 2 })
      .from(
        targetSection.current.querySelectorAll(".seq"),
        { opacity: 0, duration: 0.5, stagger: 0.5 },
        "<"
      );

    return () => typed.destroy();
  }, [typedEl, targetSection]);

  return (
    <section
      ref={targetSection}
      className="w-full flex md:items-center py-8 2xl:container mx-auto xl:px-20 md:px-12 px-4 min-h-screen relative mb-18"
      id={MENULINKS[0].ref}
      style={{ opacity: 0 }}
    >
      <style data-global data-jsx>
        {`
          .typed-cursor {
            font-size: 2rem;
          }
        `}
      </style>
      <div className="flex flex-col pt-40 md:pt-0 select-none">
        <h5
          className={`${styles.intro} font-mono font-medium text-indigo-light seq`}
        >
          Hi, my name is
        </h5>
        <h1 className={`${styles.name} text-white text-6xl font-semibold`}>
          <span className={`relative ${styles.emphasize} seq`}>Sravya</span>
          <span className="seq"> Dara</span>
        </h1>
        <p>
          <span
            ref={typedEl}
            className="seq text-3xl text-gray-light-3 font-mono leading-relaxed"
          ></span>
        </p>
        <div className="seq">
          <Profiles />
        </div>
        <div className="seq pt-4">
          <Button classes="mr-3" name="Resume" href="/Sravya_Resume.pdf" type="primary" target="_blank" rel="noreferrer"> Resume </Button>
          <Button href={`#${MENULINKS[3].ref}`} classes="link" type="primary">
            Let&apos;s Talk
          </Button>
        </div>
      </div>
      <div className="absolute invisible w-3/5 bottom-1.5 lg:visible lg:right-0 2xl:right-16 h-4/5 opacity-80">
        <div style={{width: '100%', height: '100%', position: 'relative'}}>
          <Image
            className="absolute w-full h-full top-0 left-0 object-fill"
            src="/web6.svg"
            alt="imaggg"
            layout='fill'
          />
        </div>

        {/* <img
          src="/web6.svg"
          alt="imaggg"
          className="absolute w-full h-full top-0 left-0 object-fill"
        /> */}
      </div>
    </section>
  );
};

export default Home;
