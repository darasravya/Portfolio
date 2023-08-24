/* eslint-disable @next/next/no-img-element */
import { forwardRef, useEffect, useRef } from "react";
import Image from "next/image";
import { MENULINKS, SKILLS, skillCategory } from "../../constants";
import { gsap, Linear } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const Skills = forwardRef((props, ref) => {
  const targetSection = useRef(null);

  useEffect(function () {
    ref.current = targetSection.current;
  }, [ref]);


  useEffect(() => {
    const revealTl = gsap.timeline({ defaults: { ease: Linear.easeNone } });
    revealTl.from(
      targetSection.current.querySelectorAll(".seq"),
      { opacity: 0, duration: 0.5, stagger: 0.5 },
      "<"
    );

    ScrollTrigger.create({
      trigger: targetSection.current.querySelector(".skills-wrapper"),
      start: "100px bottom",
      end: `center center`,
      animation: revealTl,
      scrub: 0,
    });
  }, [targetSection]);

  const skillsContent = (category) => {
    return (
      <>
        <h3 className="uppercase tracking-widest text-gray-light-2 text-base mb-4 seq font-bold">
          {category.text}
        </h3>
        <div className="flex flex-wrap gap-6 transform-gpu seq ">
          {SKILLS[category.objName].map((skill) => (
            <div key={skill} className="flex flex-col items-center gap-1.5">
              <Image
                src={`/skills/${skill}.svg`}
                alt={skill}
                width={50}
                height={50}
              />
              <div className="text-gray-light-3">
                {skill.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <section
      className="w-full relative select-none mt-35"
      id={MENULINKS[1].ref}
      ref={targetSection}
    >
      <div className="section-container md:py-16 pt-4 pb-16 flex flex-col justify-center">
        <img
          src="/right-pattern.svg"
          alt=""
          className="absolute hidden right-0 bottom-2/4 w-2/12 max-w-xs md:block"
          loading="lazy"
          height={700}
          width={320}
        />
        <div className="flex flex-col skills-wrapper">
          <div className="flex flex-col">
            <h1 className="text-6xl mt-2 font-medium text-gradient w-fit seq">
              My Skills
            </h1>
          </div>
          {skillCategory.map((category) => {
            return (<div key={category.objName} className='mt-6'> {skillsContent(category)} </div>)
          })}
        </div>
      </div>
    </section>
  );
});

Skills.displayName = 'Skills'

export default Skills;
