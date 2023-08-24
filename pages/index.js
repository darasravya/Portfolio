import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Meta from "@/components/Seo/Meta";
import Loader from "@/components/Loader/Loader";
import Header from "@/components/Header/Header";
import Menu from "@/components/Header/Menu/Menu";
import ProgressIndicator from "@/components/ProgressIndicator/ProgressIndicator";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import Home from "@/components/Home/Home";
import Particles from "@/components/Particles/Particles";
import About from "@/components/About/About";
import Skills from "@/components/Skills/Skills";
import Timeline from "@/components/Timeline/Timeline";
import Collaboration from "@/components/Collaboration/Collabaration";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer/Footer";
import Scripts from "@/components/Scripts/Scripts";
import { displayFancyLogs } from "utils";

export default function App() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });

  const [isLoading, setIsLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);
  const [clientHeight, setClientHeight] = useState(0);
  const [clientWidth, setClientWidth] = useState(0);

  const skillsRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2600);

    displayFancyLogs();
  }, []);

  useEffect(() => {
    const { innerWidth, innerHeight, orientation, history } = window;

    const result =
      typeof orientation === "undefined" &&
      navigator.userAgent.indexOf("IEMobile") === -1;
    history.scrollRestoration = "manual";

    setIsDesktop(result);
    setClientHeight(innerHeight);
    setClientWidth(innerWidth);
  }, [isDesktop]);

  return (
    <>
      <Meta>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Header>
              <Menu />
            </Header>
            <ProgressIndicator />
            <main className="flex flex-col">
              <Particles />
              <Home skillsRef={skillsRef}/>
              <Skills ref={skillsRef}/>
              <About clientHeight={clientHeight} />
              <Timeline isDesktop={isDesktop} />
              <Collaboration clientHeight={clientHeight} />
              <Contact />
            </main>
            <Footer />
            <Scripts />
          </>
        )}
      </Meta>
    </>
  );
}
