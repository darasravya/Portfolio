import { use, useCallback, useEffect, useRef, useState } from "react";
import styles from "./Timeline.module.scss";
import {
    Branch,
    ItemSize,
    MENULINKS,
    NodeTypes,
    TIMELINE,
} from "../../constants";
import Image from "next/image";
import { gsap, Linear } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const svgColor = "#9CA3AF";
const animColor = "#FCD34D";
const separation = 450;
const strokeWidth = 2;
const leftBranchX = 13;
const curveLength = 150;
const dotSize = 26;
const isSmallScreen = () => document.body.clientWidth < 767;

const Timeline = ({ isDesktop }) => {
    const [svgWidth, setSvgWidth] = useState(400);
    const [rightBranchX, setRightBranchX] = useState(109);

    const svgCheckpointItems = TIMELINE.filter(
        (item) => item.type === NodeTypes.CHECKPOINT && item.shouldDrawLine
    );

    const svgLength = svgCheckpointItems?.length * separation;

    const timelineSvg = useRef(null);
    const svgContainer = useRef(null);
    const screenContainer = useRef(null);
    const addNodeRefsToItems = (timeline) => {
        return timeline.map((node, idx) => ({
            ...node,
            next: timeline[idx + 1],
            prev: timeline[idx - 1],
        }));
    }

    const generateTimelineSvg = useCallback((timeline) => {
        let index = 1;
        let y = dotSize / 2;
        const timelineStyle = `<style>.str, .dot{stroke-width: ${strokeWidth}px}.anim-branch{stroke-dasharray: 186}</style>`;
        let isDiverged = false;

        const timelineSvg = addNodeRefsToItems(timeline).reduce(
            (svg, node) => {
                const { type, next } = node;
                let lineY = y;
                let dotY = y + separation / 2;

                switch (type) {
                    case NodeTypes.CHECKPOINT:
                        {
                            const { shouldDrawLine } = node;

                            // special handling for last checkpoint
                            if (!next) {
                                lineY = y - separation / 2;
                            }

                            // special handling for dot without line
                            if (!shouldDrawLine) {
                                dotY = y;
                            }

                            if (shouldDrawLine) {
                                // TO DO fix syntax
                                svg = shouldDrawLine
                                    ? `${drawLine(node, lineY, index, isDiverged)}${svg}`
                                    : svg;
                                y = y + separation;
                                index++;
                            }

                            svg = svg.concat(drawDot(node, dotY, isDiverged));
                        }
                        break;
                    case NodeTypes.DIVERGE:
                        {
                            isDiverged = true;

                            svg = `${drawBranch(node, y, index)}${svg}`;
                        }
                        break;
                    case NodeTypes.CONVERGE:
                        {
                            isDiverged = false;

                            // Drawing CONVERGE branch with previous line and index
                            svg = `${drawBranch(node, y - separation, index - 1)}${svg}`;
                        }
                        break;
                }

                return svg;
            },
            timelineStyle
        );

        return timelineSvg;
    }, [drawBranch, drawDot, drawLine])

    const getDotString = (x, y) => {
        return `<rect class='dot' width=${dotSize} height=${dotSize} fill='#111827' x=${x - dotSize / 2
            } y=${y - dotSize / 2
            } ></rect><circle cx=${x} cy=${y} r='7' stroke=${svgColor} class='dot' ></circle>`;
    };

    const drawDot = useCallback((timelineNode, y, isDiverged) => {
        const { next, alignment } = timelineNode;

        // Diverging
        if (next && next.type === NodeTypes.DIVERGE) {
            y = y - curveLength + 6 * dotSize;
        }

        // Converging
        if (next && next.type === NodeTypes.CONVERGE) {
            y = y + curveLength - 6 * dotSize;
        }

        const dotString = getDotString(
            alignment === Branch.LEFT ? leftBranchX : rightBranchX,
            y
        );

        const textString = addText(timelineNode, y, isDiverged);

        return `${textString}${dotString}`;
    }, [addText, rightBranchX])

    const addText = useCallback((timelineNode, y, isDiverged) => {
        const { title, subtitle, size, image } = timelineNode;

        const offset = isDiverged ? rightBranchX : 10;
        const foreignObjectX = dotSize / 2 + 10 + offset;
        const foreignObjectY = y - dotSize / 2;
        const foreignObjectWidth = svgWidth - (dotSize / 2 + 10 + offset);

        const titleSizeClass = size === ItemSize.LARGE ? "text-6xl" : "text-2xl";
        const logoString = image
            ? `<img src='${image}' class='h-8 mb-2 object-cover' loading='lazy' width='100' height='32' alt='${image}' />`
            : "";
        const subtitleString = subtitle
            ? `<p class='text-xl mt-2 text-gray-200 font-medium tracking-wide'>${subtitle}</p>`
            : "";

        return `<foreignObject x=${foreignObjectX} y=${foreignObjectY} width=${foreignObjectWidth} 
            height=${separation}>${logoString}<p class='${titleSizeClass}'>${title}</p>${subtitleString}</foreignObject>`;
    }, [rightBranchX, svgWidth])

    const drawLine = useCallback((timelineNode, y, i, isDiverged) => {
        const { alignment, prev, next } = timelineNode;

        const isPrevDiverge = prev && prev.type === NodeTypes.DIVERGE;
        const isNextConverge = next && next.type === NodeTypes.CONVERGE;

        const lineY = Math.abs(y + separation);

        // Smaller line for Diverging
        if (isPrevDiverge) {
            return `<line class='str' x1=${leftBranchX} y1=${y} x2=${leftBranchX} y2=${lineY} stroke=${svgColor} /><line class='str line-${i}' x1=${leftBranchX} y1=${y} x2=${leftBranchX} y2=${lineY} stroke=${animColor} />`;
        }

        // Smaller line for Converging
        if (isNextConverge) {
            return `<line class='str' x1=${leftBranchX} y1=${y} x2=${leftBranchX} y2=${lineY} stroke=${svgColor} /><line class='str line-${i}' x1=${leftBranchX} y1=${y} x2=${leftBranchX} y2=${lineY} stroke=${animColor} />`;
        }

        const lineX = alignment === Branch.LEFT ? leftBranchX : rightBranchX;

        let str = `<line class='str' x1=${lineX} y1=${y} x2=${lineX} y2=${lineY} stroke=${svgColor} /><line class='str line-${i}' x1=${lineX} y1=${y} x2=${lineX} y2=${lineY} stroke=${animColor} />`;

        // If already diverged, draw parallel line to the existing line
        if (isDiverged) {
            const divergedLineX =
                alignment === Branch.LEFT ? rightBranchX : leftBranchX;
            str = str.concat(
                `<line class='str' x1=${divergedLineX} y1=${y} x2=${divergedLineX} y2=${lineY} stroke=${svgColor} /><line class='str line-${i}' x1=${divergedLineX} y1=${y} x2=${divergedLineX} y2=${lineY} stroke=${animColor} />`
            );
        }
        return str;
    }, [rightBranchX])

    const drawBranch = useCallback((timelineNode, y, i) => {
        const { type } = timelineNode;

        switch (type) {
            case NodeTypes.DIVERGE:
                return `<path class='str' d='M ${leftBranchX} ${y} C ${leftBranchX} ${y + curveLength / 2
                    } ${rightBranchX} ${y + curveLength / 2} ${rightBranchX} ${y + curveLength
                    }' stroke=${svgColor} /><line class='str' x1=${rightBranchX} y1=${y + curveLength
                    } x2=${rightBranchX} y2=${y + separation
                    } stroke=${svgColor} /><path class='str anim-branch branch-${i}' d='M ${leftBranchX} ${y} C ${leftBranchX} ${y + curveLength / 2
                    } ${rightBranchX} ${y + curveLength / 2} ${rightBranchX} ${y + curveLength
                    }' stroke=${animColor} /><line class='str branch-line-${i}' x1=${rightBranchX} y1=${y + curveLength
                    } x2=${rightBranchX} y2=${y + separation} stroke=${animColor} />`;
            case NodeTypes.CONVERGE:
                return `<path class='str' d='M ${rightBranchX} ${y + separation - curveLength
                    } C ${rightBranchX} ${y + separation - curveLength + curveLength / 2
                    } ${leftBranchX} ${y + separation - curveLength + curveLength / 2
                    } ${leftBranchX} ${y + separation
                    }' stroke=${svgColor} /><line class='str' x1=${rightBranchX} y1=${y} x2=${rightBranchX} y2=${Math.abs(
                        y + separation - curveLength
                    )} stroke=${svgColor} /><path class='str anim-branch branch-${i}' d='M ${rightBranchX} ${y + separation - curveLength
                    } C ${rightBranchX} ${y + separation - curveLength + curveLength / 2
                    } ${leftBranchX} ${y + separation - curveLength + curveLength / 2
                    } ${leftBranchX} ${y + separation
                    }' stroke=${animColor} /><line class='str branch-line-${i}' x1=${rightBranchX} y1=${y} x2=${rightBranchX} y2=${Math.abs(
                        y + separation - curveLength
                    )} stroke=${animColor} />`;
            default:
                return "";
        }
    }, [rightBranchX])

    const addLineSvgAnimation = (timeline, duration, index) => {
        const startTime = `start+=${duration * index}`;

        timeline.from(
            svgContainer.current.querySelectorAll(`.line-${index + 1}`),
            { scaleY: 0, duration },
            startTime
        );

        return timeline;
    }

    const addDivergingBranchLineAnimation = (timeline, duration, index) => {
        timeline
            .from(
                svgContainer.current.querySelector(`.line-${index + 1}`),
                { scaleY: 0, duration },
                `start+=${duration * index}`
            )
            .from(
                svgContainer.current.querySelector(`.branch-${index + 1}`),
                { strokeDashoffset: 186, duration: duration - 2 },
                `start+=${duration * index}`
            )
            .from(
                svgContainer.current.querySelector(`.branch-line-${index + 1}`),
                { scaleY: 0, duration: duration - 1 },
                `start+=${duration * (index + 1) - 2}`
            );

        return timeline;
    };

    const addConvergingBranchLineAnimation = (timeline, duration, index) => {
        timeline
            .from(
                svgContainer.current.querySelector(`.line-${index + 1}`),
                { scaleY: 0, duration },
                `start+=${duration * index}`
            )
            .from(
                svgContainer.current.querySelector(`.branch-line-${index + 1}`),
                { scaleY: 0, duration: duration - 1 },
                `start+=${duration * index}`
            )
            .from(
                svgContainer.current.querySelector(`.branch-${index + 1}`),
                { strokeDashoffset: 186, duration: duration - 2 },
                `start+=${duration * (index + 1) - 1}`
            );

        return timeline;
    };

    const animateTimeline = useCallback((timeline, duration) => {
        let index = 0;

        addNodeRefsToItems(TIMELINE).forEach((item) => {
            const { type } = item;

            if (type === NodeTypes.CHECKPOINT && item.shouldDrawLine) {
                const { next, prev } = item;

                if (prev?.type === NodeTypes.DIVERGE) {
                    addDivergingBranchLineAnimation(timeline, duration, index);
                } else if (next?.type === NodeTypes.CONVERGE) {
                    addConvergingBranchLineAnimation(timeline, duration, index);
                } else {
                    addLineSvgAnimation(timeline, duration, index);
                }

                index++;
            }
        });
    }, [])

    const setTimelineSvg = useCallback((svgContainer, timelineSvg) => {
        const containerWidth = svgContainer.current.clientWidth;
        setSvgWidth(containerWidth);

        const resultSvgString = generateTimelineSvg(TIMELINE);
        timelineSvg.current.innerHTML = resultSvgString;

        if (isSmallScreen()) {
            setRightBranchX(70);
        }
    }, [generateTimelineSvg])

    const setSlidesAnimation = useCallback((timeline) => {
        svgCheckpointItems.forEach((_, index) => {
            // all except the first slide
            if (index !== 0) {
                timeline.fromTo(
                    screenContainer.current.querySelector(`.slide-${index + 1}`),
                    { opacity: 0 },
                    { opacity: 1 }
                );
            }

            // all except the last slide
            if (index !== svgCheckpointItems.length - 1) {
                timeline.to(
                    screenContainer.current.querySelector(`.slide-${index + 1}`),
                    {
                        opacity: 0,
                        delay: 2.35,
                    }
                );
            }
        });
    }, [svgCheckpointItems])

    const initScrollTrigger = useCallback(() => {
        const timeline = gsap
            .timeline({ defaults: { ease: Linear.easeNone, duration: 0.44 } })
            .addLabel("start");

        let duration;
        let trigger;
        let start;
        let end;
        let additionalConfig = {};

        // Slide as a trigger for Desktop
        if (isDesktop && !isSmallScreen()) {
            // Animation for right side slides
            setSlidesAnimation(timeline);

            const platformHeight =
                screenContainer.current.getBoundingClientRect().height;

            trigger = screenContainer.current;
            start = `top ${(window.innerHeight - platformHeight) / 2}`;
            end = `+=${svgLength - platformHeight}`;
            additionalConfig = {
                pin: true,
                pinSpacing: true,
            };
            duration = timeline.totalDuration() / 15;
        } else {
            // Clearing out the right side on mobile devices
            screenContainer.current.innerHTML = "";

            trigger = svgContainer.current;
            start = "top center";
            end = `+=${svgLength}`;
            duration = 3;
        }

        ScrollTrigger.create({
            ...additionalConfig,
            trigger,
            start,
            end,
            scrub: 0,
            animation: timeline,
        });
        return { timeline, duration };
    }, [isDesktop, setSlidesAnimation, svgLength])

    useEffect(() => {
        // Generate and set the timeline svg
        setTimelineSvg(svgContainer, timelineSvg);

        const { timeline, duration } = initScrollTrigger();

        // Animation for Timeline SVG
        animateTimeline(timeline, duration);
    }, [
        timelineSvg,
        svgContainer,
        svgWidth,
        rightBranchX,
        screenContainer,
        isDesktop,
        svgLength,
        initScrollTrigger,
        animateTimeline,
        setTimelineSvg
    ]);

    const renderSlides = () => (
        <div
            className="max-w-full h-96 shadow-xl bg-gray-800 rounded-2xl overflow-hidden"
            ref={screenContainer}
        >
            <Image
                className="w-full h-8"
                src="/timeline/title-bar.png"
                alt="Title bar"
                width={644}
                height={34}
            />
            <div className="relative h-full w-full -mt-2">
                <div className="absolute top-0 left-0 h-full w-full">
                    <div style={{width: '100%', height: '100%', position: 'relative'}}>
                    {svgCheckpointItems.map((item, index) => (
                        // <div key={`${(item).title}-${index}`} style={{width: '100%', height: '100%', position: 'relative'}}>
                        <Image
                            className={`w-full absolute top-0 object-fill slide-${index + 1
                                }`}
                            src={(item).slideImage || ""}
                            key={`${(item).title}-${index}`}
                            alt="Timeline"
                            layout="fill"
                        />
                        // </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSVG = () => (
        <svg
            width={svgWidth}
            height={svgLength}
            viewBox={`0 0 ${svgWidth} ${svgLength}`}
            fill="none"
            ref={timelineSvg}
        ></svg>
    );

    const renderSectionTitle = () => (
        <div className="flex flex-col">
            <p className={`${styles['section-title-sm']} seq`}>MILESTONES</p>
            <h1 className={`${styles['section-heading']} seq mt-2`}>Timeline</h1>
            <h2 className="text-2xl md:max-w-2xl w-full seq mt-2">
                Journey over the years
            </h2>
        </div>
    );

    return (
        <section
            className="w-full relative select-none min-h-screen section-container py-8 flex flex-col justify-center"
            id={MENULINKS[2].ref}
        >
            {renderSectionTitle()}
            <div className="grid grid-cols-12 gap-4 mt-20">
                <div className="col-span-12 md:col-span-6 line-svg" ref={svgContainer}>
                    {renderSVG()}
                </div>
                <div className="col-span-12 md:col-span-6 md:flex hidden">
                    {renderSlides()}
                </div>
            </div>
        </section>
    );
}

export default Timeline;
