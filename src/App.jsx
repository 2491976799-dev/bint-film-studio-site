import { useEffect, useRef, useState } from "react";
import {
  aboutLines,
  bloopers,
  clientLogos,
  services,
  studio,
  works,
} from "./content.js";
import filmTransitionVideo from "../assets/transitions/film-transition.mp4?url";

const TRANSITION_AUDIO_VOLUME = 0.36;

function getTransitionAudioVolume(currentTime, duration = 1) {
  const normalizedTime = Math.max(0, Math.min(1, currentTime / (duration || 1)));
  const fadeIn = Math.min(1, normalizedTime / 0.08);
  const fadeOutProgress = Math.max(0, Math.min(1, (normalizedTime - 0.48) / 0.38));
  const easedFadeOut = fadeOutProgress * fadeOutProgress * (3 - 2 * fadeOutProgress);

  return TRANSITION_AUDIO_VOLUME * fadeIn * (1 - easedFadeOut);
}

function SplashCover({ onEnter, exiting }) {
  const coverRef = useRef(null);
  const transitionVideoRef = useRef(null);
  const transitionAudioRef = useRef(null);
  const transitionCanvasRef = useRef(null);
  const transitionFrameRef = useRef(0);
  const transitionAudioFrameRef = useRef(0);
  const motionCleanupRef = useRef(null);
  const motionRequestedRef = useRef(false);

  const applyMotion = ({ shiftX, shiftY, tiltX, tiltY, spotX, spotY }) => {
    coverRef.current?.style.setProperty("--shift-x", shiftX.toFixed(3));
    coverRef.current?.style.setProperty("--shift-y", shiftY.toFixed(3));
    coverRef.current?.style.setProperty("--tilt-x", tiltX.toFixed(3));
    coverRef.current?.style.setProperty("--tilt-y", tiltY.toFixed(3));
    coverRef.current?.style.setProperty("--spot-x", spotX);
    coverRef.current?.style.setProperty("--spot-y", spotY);
  };

  const installDeviceMotion = () => {
    if (motionCleanupRef.current || !window.DeviceOrientationEvent) return;

    const updateMotion = (event) => {
      const beta = Math.max(-24, Math.min(24, event.beta ?? 0));
      const gamma = Math.max(-24, Math.min(24, event.gamma ?? 0));
      const shiftX = gamma / 24;
      const shiftY = beta / 30;

      applyMotion({
        shiftX,
        shiftY,
        tiltX: gamma / 4,
        tiltY: beta / 6,
        spotX: `${50 + shiftX * 18}%`,
        spotY: `${52 + shiftY * 12}%`,
      });
    };

    window.addEventListener("deviceorientation", updateMotion, true);
    motionCleanupRef.current = () => {
      window.removeEventListener("deviceorientation", updateMotion, true);
    };
  };

  const updatePointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const shiftX = (x - 50) / 50;
    const shiftY = (y - 50) / 50;

    applyMotion({
      shiftX,
      shiftY,
      tiltX: shiftX * 3.6,
      tiltY: shiftY * 2.8,
      spotX: `${x}%`,
      spotY: `${y}%`,
    });
  };

  const resetPointer = () => {
    applyMotion({
      shiftX: 0,
      shiftY: 0,
      tiltX: 0,
      tiltY: 0,
      spotX: "50%",
      spotY: "52%",
    });
  };

  useEffect(() => {
    const orientation = window.DeviceOrientationEvent;
    if (orientation && !orientation.requestPermission) {
      installDeviceMotion();
    }

    return () => {
      motionCleanupRef.current?.();
      motionCleanupRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!exiting) return;

    const transitionVideo = transitionVideoRef.current;
    const transitionCanvas = transitionCanvasRef.current;
    if (!transitionVideo || !transitionCanvas) return;

    let stopped = false;
    const context = transitionCanvas.getContext("2d", { willReadFrequently: true });

    const resizeCanvas = () => {
      const rect = transitionCanvas.getBoundingClientRect();
      const maxPixels = 920000;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);
      const density = Math.min(pixelRatio, Math.sqrt(maxPixels / (rect.width * rect.height)));
      const width = Math.max(1, Math.round(rect.width * density));
      const height = Math.max(1, Math.round(rect.height * density));

      if (transitionCanvas.width !== width || transitionCanvas.height !== height) {
        transitionCanvas.width = width;
        transitionCanvas.height = height;
      }
    };

    const drawCoverFrame = () => {
      if (stopped || !context) return;

      if (transitionVideo.readyState >= 2 && transitionVideo.videoWidth && transitionVideo.videoHeight) {
        resizeCanvas();

        const { width, height } = transitionCanvas;
        const sourceRatio = transitionVideo.videoWidth / transitionVideo.videoHeight;
        const targetRatio = width / height;
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = transitionVideo.videoWidth;
        let sourceHeight = transitionVideo.videoHeight;

        if (targetRatio > sourceRatio) {
          sourceHeight = transitionVideo.videoWidth / targetRatio;
          sourceY = (transitionVideo.videoHeight - sourceHeight) / 2;
        } else {
          sourceWidth = transitionVideo.videoHeight * targetRatio;
          sourceX = (transitionVideo.videoWidth - sourceWidth) * (height > width ? 1 : 0.5);
        }

        context.clearRect(0, 0, width, height);
        context.drawImage(
          transitionVideo,
          sourceX,
          sourceY,
          sourceWidth,
          sourceHeight,
          0,
          0,
          width,
          height
        );

        const frame = context.getImageData(0, 0, width, height);
        const { data } = frame;

        // Luma-key the supplied transition so black film stays transparent, like a screen layer.
        for (let index = 0; index < data.length; index += 4) {
          const red = data[index];
          const green = data[index + 1];
          const blue = data[index + 2];
          const luma = red * 0.2126 + green * 0.7152 + blue * 0.0722;
          const keyed = Math.max(0, Math.min(1, (luma - 40) / 132));
          const alpha = Math.pow(keyed, 1.44);

          data[index] = Math.min(255, red * 1.46 + 24 * alpha);
          data[index + 1] = Math.min(255, green * 1.28 + 18 * alpha);
          data[index + 2] = Math.min(255, blue * 1.08 + 10 * alpha);
          data[index + 3] = Math.round(alpha * 245);
        }

        context.putImageData(frame, 0, 0);

        const grainSeed = Math.round(transitionVideo.currentTime * 30) + 1;
        let seed = (grainSeed * 2654435761 + width * 97 + height * 193) >>> 0;
        const random = () => {
          seed = (seed * 1664525 + 1013904223) >>> 0;
          return seed / 4294967296;
        };
        const grainCount = Math.max(48, Math.round((width * height) / 9000));
        const grainScale = height > width ? 1.9 : 1.2;

        context.save();
        context.globalCompositeOperation = "screen";
        for (let index = 0; index < grainCount; index += 1) {
          const size = (random() < 0.76 ? 1 : 1.9) * grainScale;
          const alpha = 0.22 + random() * 0.26;
          const red = 235 + Math.round(random() * 20);
          const green = 218 + Math.round(random() * 26);
          const blue = 178 + Math.round(random() * 42);

          context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
          context.fillRect(random() * width, random() * height, size, size);
        }
        context.restore();
      }

      if (!transitionVideo.ended) {
        transitionFrameRef.current = window.requestAnimationFrame(drawCoverFrame);
      }
    };

    const startDrawing = () => {
      if (stopped) return;
      window.cancelAnimationFrame(transitionFrameRef.current);
      transitionFrameRef.current = window.requestAnimationFrame(drawCoverFrame);
    };

    transitionVideo.muted = true;
    if (transitionVideo.paused) {
      transitionVideo.currentTime = 0;
      transitionVideo.play().then(startDrawing).catch(startDrawing);
    } else {
      startDrawing();
    }

    return () => {
      stopped = true;
      window.cancelAnimationFrame(transitionFrameRef.current);
      context?.clearRect(0, 0, transitionCanvas.width, transitionCanvas.height);
    };
  }, [exiting]);

  useEffect(() => {
    return () => {
      const transitionAudio = transitionAudioRef.current;
      window.cancelAnimationFrame(transitionAudioFrameRef.current);
      if (transitionAudio) {
        transitionAudio.volume = 0;
        transitionAudio.pause();
      }
    };
  }, []);

  const updateTransitionAudio = () => {
    const transitionAudio = transitionAudioRef.current;
    if (!transitionAudio || transitionAudio.paused || transitionAudio.ended) return;

    transitionAudio.volume = getTransitionAudioVolume(
      transitionAudio.currentTime,
      transitionAudio.duration
    );

    transitionAudioFrameRef.current = window.requestAnimationFrame(updateTransitionAudio);
  };

  const playTransitionMedia = () => {
    const transitionVideo = transitionVideoRef.current;
    const transitionAudio = transitionAudioRef.current;

    if (transitionVideo) {
      transitionVideo.muted = true;
      transitionVideo.currentTime = 0;
      transitionVideo.play().catch(() => {});
    }

    if (!transitionAudio) return;

    window.cancelAnimationFrame(transitionAudioFrameRef.current);
    transitionAudio.volume = getTransitionAudioVolume(0, transitionAudio.duration);
    transitionAudio.currentTime = 0;
    transitionAudio.play().then(updateTransitionAudio).catch(() => {
      transitionAudio.volume = 0;
    });
  };

  const requestMotionAccess = async (event) => {
    event?.stopPropagation();

    const orientation = window.DeviceOrientationEvent;
    if (!orientation || motionCleanupRef.current) return;

    if (orientation?.requestPermission) {
      if (motionRequestedRef.current) return;
      motionRequestedRef.current = true;

      try {
        const result = await orientation.requestPermission();
        if (result === "granted") {
          installDeviceMotion();
        }
      } catch {
        motionRequestedRef.current = false;
      }
      return;
    }

    installDeviceMotion();
  };

  return (
    <section
      ref={coverRef}
      className={`splash-cover${exiting ? " is-exiting" : ""}`}
      aria-label="BINT Film Studio 进入封面"
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
      onPointerDown={requestMotionAccess}
    >
      <img className="cover-background" src={studio.coverImage} alt="" aria-hidden="true" />
      <div className="splash-burst" aria-hidden="true">
        {["top-left", "top-right", "bottom-left", "bottom-right"].map((part) => (
          <span
            className={`splash-shard ${part}`}
            style={{ "--cover-image": `url(${studio.coverImage})` }}
            key={part}
          />
        ))}
      </div>
      <button
        className="splash-lockup"
        type="button"
        aria-label={`${studio.mark} ${studio.name}`}
        onClick={requestMotionAccess}
      >
        <img src={studio.coverLockup} alt="" aria-hidden="true" />
      </button>
      <button
        className="enter-button"
        type="button"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          playTransitionMedia();
          onEnter();
        }}
      >
        进入网页 <span>Enter Site</span>
      </button>
      <div className="film-transition" aria-hidden="true">
        <canvas ref={transitionCanvasRef} className="film-transition-canvas" />
        <video
          ref={transitionVideoRef}
          className="film-transition-source"
          src={filmTransitionVideo}
          muted
          playsInline
          preload="auto"
        />
        <audio
          ref={transitionAudioRef}
          className="film-transition-source"
          src={filmTransitionVideo}
          preload="auto"
        />
      </div>
    </section>
  );
}

function copyTextToClipboard(text, onSuccess, onError) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(onError);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
    onSuccess();
  } catch {
    onError();
  } finally {
    document.body.removeChild(textarea);
  }
}

function useAutoScroller(defaultSpeed = 0.7) {
  const railRef = useRef(null);
  const targetSpeedRef = useRef(defaultSpeed);
  const currentSpeedRef = useRef(defaultSpeed);
  const initializedRef = useRef(false);

  const getLoopWidth = () => {
    const rail = railRef.current;
    const baseSet = rail?.querySelector('[data-loop-set="base"]');
    if (!rail || !baseSet) return 0;

    const styles = window.getComputedStyle(rail);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return baseSet.getBoundingClientRect().width + gap;
  };

  const normalizeLoopPosition = () => {
    const rail = railRef.current;
    const loopWidth = getLoopWidth();
    if (!rail || loopWidth <= 0) return;

    if (!initializedRef.current) {
      rail.scrollLeft = loopWidth;
      initializedRef.current = true;
      return;
    }

    if (rail.scrollLeft <= loopWidth * 0.02) {
      rail.scrollLeft += loopWidth;
    } else if (rail.scrollLeft >= loopWidth * 1.98) {
      rail.scrollLeft -= loopWidth;
    }
  };

  useEffect(() => {
    let frameId = 0;
    let lastTime = performance.now();
    let resizeFrameId = 0;

    const resetLoop = () => {
      initializedRef.current = false;
      cancelAnimationFrame(resizeFrameId);
      resizeFrameId = requestAnimationFrame(normalizeLoopPosition);
    };

    const tick = (time) => {
      const rail = railRef.current;
      if (rail) {
        const delta = Math.min(32, time - lastTime);

        normalizeLoopPosition();

        if (rail.scrollWidth > rail.clientWidth) {
          currentSpeedRef.current +=
            (targetSpeedRef.current - currentSpeedRef.current) * 0.045;
          rail.scrollLeft += currentSpeedRef.current * delta;
          normalizeLoopPosition();
        }
      }

      lastTime = time;
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    window.addEventListener("resize", resetLoop);
    return () => {
      cancelAnimationFrame(frameId);
      cancelAnimationFrame(resizeFrameId);
      window.removeEventListener("resize", resetLoop);
    };
  }, []);

  const onPointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const centered = (ratio - 0.5) * 2;
    const direction = Math.abs(centered) < 0.2 ? 0 : Math.sign(centered);
    const speed = defaultSpeed * 0.35 + Math.abs(centered) * defaultSpeed * 2.2;
    targetSpeedRef.current = direction === 0 ? defaultSpeed * 0.18 : direction * speed;
  };

  const onPointerLeave = () => {
    targetSpeedRef.current = defaultSpeed;
  };

  const scrollRail = (direction) => {
    const rail = railRef.current;
    if (!rail) return;
    normalizeLoopPosition();
    targetSpeedRef.current = direction * defaultSpeed * 1.8;
    rail.scrollBy({
      left: direction * Math.max(rail.clientWidth * 0.48, 220),
      behavior: "smooth",
    });
  };

  return {
    railRef,
    railProps: {
      onPointerMove,
      onPointerLeave,
    },
    scrollRail,
  };
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const navItems = [
    ["about", "关于"],
    ["services", "业务"],
    ["clients", "客户"],
    ["works", "作品"],
    ["bloopers", "花絮"],
    ["contact", "联系"],
  ];

  const navigateToSection = (event) => {
    const sectionId = event.currentTarget.dataset.section;
    if (!sectionId) return;

    const target = document.getElementById(sectionId);
    if (!target) return;

    event.preventDefault();
    const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 0;
    const scrollTarget = target.querySelector(".works-heading, .section-title") ?? target;
    const targetTop = Math.max(
      0,
      scrollTarget.getBoundingClientRect().top + window.scrollY - headerHeight - 12,
    );

    window.scrollTo({ top: targetTop, behavior: "auto" });
    window.history.pushState(null, "", `#${sectionId}`);
  };

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <a className="brand" href="#about" aria-label="BINT Film Studio">
        <span>{studio.mark}</span>
        <strong>{studio.englishName}</strong>
      </a>
      <nav aria-label="主导航">
        {navItems.map(([sectionId, label]) => (
          <button
            type="button"
            data-section={sectionId}
            onClick={navigateToSection}
            key={sectionId}
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}

function SectionTitle({ kicker, title, align = "center" }) {
  return (
    <div className={`section-title ${align}`}>
      <p>{kicker}</p>
      <h2>{title}</h2>
    </div>
  );
}

function About() {
  return (
    <section className="section about" id="about">
      <div className="texture texture-left" aria-hidden="true" />
      <div className="about-copy">
        {aboutLines.map((line, index) => (
          <p className={index === 0 ? "about-lead" : undefined} key={line}>
            {line}
          </p>
        ))}
      </div>
      <p className="studio-line">以山城为原点，用影像创造价值</p>
    </section>
  );
}

function Services() {
  return (
    <section className="section services" id="services">
      <div className="texture texture-right" aria-hidden="true" />
      <SectionTitle kicker="SERVICES" title="主营业务" />
      <div className="service-stack">
        {services.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </section>
  );
}

function ClientLogoSphere() {
  const [angle, setAngle] = useState(0);
  const targetSpeedRef = useRef(-0.00034);
  const currentSpeedRef = useRef(-0.00034);
  const frameRef = useRef(0);

  useEffect(() => {
    let lastTime = performance.now();

    const tick = (time) => {
      const delta = Math.min(32, time - lastTime);
      currentSpeedRef.current += (targetSpeedRef.current - currentSpeedRef.current) * 0.026;
      setAngle((current) => current + currentSpeedRef.current * delta);
      lastTime = time;
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const updateSpeed = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const centered = (ratio - 0.5) * 2;
    const speed = 0.00012 + Math.abs(centered) * 0.00036;
    targetSpeedRef.current = -speed;
  };

  const resetSpeed = () => {
    targetSpeedRef.current = -0.00034;
  };

  const latitudeRows = [
    { y: -35, radius: 0.74, phase: 0.08, logos: [9, 11, 17, 13, 4] },
    { y: -13, radius: 0.96, phase: 0.42, logos: [3, 10, 14, 16, 19, 20] },
    { y: 11, radius: 1, phase: 0.12, logos: [0, 8, 15, 18, 7, 12] },
    { y: 35, radius: 0.78, phase: 0.34, logos: [2, 5, 6, 21, 22, 1] },
  ];

  const smoothStep = (start, end, value) => {
    const progress = Math.min(1, Math.max(0, (value - start) / (end - start)));
    return progress * progress * (3 - 2 * progress);
  };

  const widthMap = {
    hero: "clamp(190px, 20vw, 300px)",
    wide: "clamp(156px, 16.5vw, 230px)",
    medium: "clamp(134px, 14.5vw, 200px)",
    tall: "clamp(120px, 13vw, 184px)",
  };
  const maxHeightMap = {
    hero: "clamp(72px, 8.1vw, 112px)",
    wide: "clamp(56px, 6.2vw, 88px)",
    medium: "clamp(56px, 6.2vw, 88px)",
    tall: "clamp(64px, 7vw, 100px)",
  };
  const frameWidthMap = {
    hero: "300px",
    wide: "230px",
    medium: "200px",
    tall: "184px",
  };
  const frameMaxHeightMap = {
    hero: "112px",
    wide: "88px",
    medium: "88px",
    tall: "100px",
  };
  const mobileWidthMap = {
    hero: "27.78vw",
    wide: "21.3vw",
    medium: "18.52vw",
    tall: "17.04vw",
  };
  const mobileMaxHeightMap = {
    hero: "10.37vw",
    wide: "8.15vw",
    medium: "8.15vw",
    tall: "9.26vw",
  };

  const items = latitudeRows.flatMap((row, rowIndex) => {
    return row.logos
      .map((logoIndex, position) => {
        const logo = clientLogos[logoIndex];

        if (!logo) {
          return null;
        }

        const theta = angle + row.phase * Math.PI * 2 + (position / row.logos.length) * Math.PI * 2;
        const baseX = Math.cos(theta) * row.radius;
        const depth = Math.sin(theta) * row.radius;
        const projectedX = baseX * 40;
        const projectedMobileX = baseX * 31;
        const projectedY = row.y;
        const edgeFade = Math.max(0, 1 - Math.abs(baseX) * 0.18);
        const frontFade = smoothStep(-0.36, 0.42, depth);
        const opacity = Math.min(1, edgeFade * frontFade);
        const logoScale = (logo.size ?? 1) * (0.96 + Math.max(0, depth) * 0.18);

        return {
          ...logo,
          key: `${logo.name}-${rowIndex}-${position}`,
          style: {
            "--logo-x": `${projectedX}%`,
            "--logo-mobile-x": `${projectedMobileX}%`,
            "--logo-y": `${projectedY}%`,
            "--logo-depth": `${Math.round(depth * 78)}px`,
            "--logo-scale": logoScale.toFixed(3),
            "--logo-opacity": opacity.toFixed(3),
            "--logo-z": Math.round(100 + (depth + 1) * 40 + (4 - rowIndex)),
            "--logo-width": widthMap[logo.shape] ?? widthMap.medium,
            "--logo-max-height": maxHeightMap[logo.shape] ?? maxHeightMap.medium,
            "--logo-frame-width": frameWidthMap[logo.shape] ?? frameWidthMap.medium,
            "--logo-frame-max-height":
              frameMaxHeightMap[logo.shape] ?? frameMaxHeightMap.medium,
            "--logo-mobile-width": mobileWidthMap[logo.shape] ?? mobileWidthMap.medium,
            "--logo-mobile-max-height":
              mobileMaxHeightMap[logo.shape] ?? mobileMaxHeightMap.medium,
          },
        };
      })
      .filter(Boolean);
  });

  return (
    <div
      className="client-sphere"
      aria-label="合作客户 Logo 球形展廊"
      onPointerMove={updateSpeed}
      onPointerLeave={resetSpeed}
    >
      <div className="sphere-core" aria-hidden="true" />
      {items.map((logo) => (
        <figure className="sphere-logo" key={logo.key} style={logo.style}>
          <img src={logo.src} alt={logo.name} loading="lazy" />
        </figure>
      ))}
    </div>
  );
}

function Clients() {
  return (
    <section className="clients" id="clients" aria-labelledby="clients-title">
      <div className="texture texture-white top" aria-hidden="true" />
      <div className="clients-frame">
        <SectionTitle kicker="CLIENTS" title="合作客户" />
        <ClientLogoSphere />
      </div>
    </section>
  );
}

function SelectedWorks() {
  const { railRef, railProps, scrollRail } = useAutoScroller(0.18);
  const loopCopies = [-1, 0, 1];

  return (
    <section className="works-section" id="works" style={{ minHeight: "auto" }}>
      <div className="texture texture-left top" aria-hidden="true" />
      <div className="works-heading">
        <SectionTitle kicker="PARTIAL WORKS DISPLAY" title="部分作品展示" />
        <div className="rail-actions" aria-label="作品展廊控制">
          <button type="button" onClick={() => scrollRail(-1)} aria-label="上一组作品">
            ←
          </button>
          <button type="button" onClick={() => scrollRail(1)} aria-label="下一组作品">
            →
          </button>
        </div>
      </div>
      <div
        className="works-rail auto-rail"
        ref={railRef}
        aria-label="横向作品展廊"
        style={{ height: "58.5vw", maxHeight: "615px", minHeight: "340px" }}
        {...railProps}
      >
        {loopCopies.map((copy) => (
          <div
            className="rail-loop-set"
            data-loop-set={copy === 0 ? "base" : undefined}
            aria-hidden={copy === 0 ? undefined : true}
            key={copy}
          >
            {works.map((work, index) => (
              <figure
                className="work-card"
                style={{ height: "58.5vw", maxHeight: "615px", minHeight: "340px" }}
                key={`${copy}-${work.src}`}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <img
                  src={work.src}
                  alt={work.alt}
                  loading="eager"
                  decoding="async"
                  fetchPriority={copy === 0 && index < 5 ? "high" : "auto"}
                />
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function Bloopers() {
  const { railRef, railProps, scrollRail } = useAutoScroller(0.14);
  const loopCopies = [-1, 0, 1];

  return (
    <section className="bloopers-section" id="bloopers" style={{ minHeight: "auto" }}>
      <div className="texture texture-right bottom" aria-hidden="true" />
      <div className="works-heading">
        <SectionTitle kicker="WORK BLOOPERS" title="工作花絮" />
        <div className="rail-actions" aria-label="花絮展廊控制">
          <button type="button" onClick={() => scrollRail(-1)} aria-label="上一组花絮">
            ←
          </button>
          <button type="button" onClick={() => scrollRail(1)} aria-label="下一组花絮">
            →
          </button>
        </div>
      </div>
      <div
        className="blooper-rail auto-rail"
        ref={railRef}
        aria-label="横向工作花絮展廊"
        style={{ height: "101.4vw", maxHeight: "520px", minHeight: "320px" }}
        {...railProps}
      >
        {loopCopies.map((copy) => (
          <div
            className="rail-loop-set"
            data-loop-set={copy === 0 ? "base" : undefined}
            aria-hidden={copy === 0 ? undefined : true}
            key={copy}
          >
            {bloopers.map((item, index) => (
              <figure
                style={{ height: "101.4vw", maxHeight: "520px", minHeight: "320px" }}
                key={`${copy}-${item.src}`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading={copy === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
                <figcaption>{String(index + 1).padStart(2, "0")}</figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyWechat = () => {
    copyTextToClipboard(
      studio.wechat,
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      },
      () => setCopied(false),
    );
  };

  return (
    <aside className={`floating-contact${open ? " is-open" : ""}`} aria-label="快速联系">
      <button
        className="floating-contact-trigger"
        type="button"
        aria-expanded={open}
        aria-label="打开快速联系"
        onClick={() => setOpen((current) => !current)}
      >
        <svg
          className="chat-bubble-icon"
          viewBox="0 0 32 32"
          aria-hidden="true"
          focusable="false"
        >
          <path
            className="chat-bubble-fill"
            d="M16 4.9C9.1 4.9 3.6 9.65 3.6 15.55c0 3.1 1.58 5.9 4.14 7.88l-.66 3.88c-.08.48.43.83.86.6l3.92-2.02c1.3.38 2.7.58 4.14.58 6.9 0 12.4-4.75 12.4-10.92S22.9 4.9 16 4.9Z"
          />
          <path className="chat-bubble-cut" d="M11.25 15.95h.01M16 15.95h.01M20.75 15.95h.01" />
        </svg>
      </button>
      <div className="floating-contact-panel">
        <a href={`tel:${studio.phone}`}>
          <span>TEL</span>
          <strong>{studio.phone}</strong>
        </a>
        <button type="button" onClick={copyWechat}>
          <span>WECHAT</span>
          <strong>{studio.wechat}</strong>
          <em>{copied ? "已复制" : "复制"}</em>
        </button>
      </div>
    </aside>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || !window.IntersectionObserver) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.32 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const copyWechat = async () => {
    copyTextToClipboard(
      studio.wechat,
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      },
      () => setCopied(false),
    );
  };

  return (
    <section
      className={`contact-section${visible ? " is-visible" : ""}`}
      id="contact"
      ref={sectionRef}
    >
      <div className="contact-inner">
        <h2>喜欢您来。</h2>
        <div className="contact-list contact-details">
          <a href={`tel:${studio.phone}`}>TEL: {studio.phone}</a>
          <button type="button" onClick={copyWechat}>
            WECHAT: {studio.wechat}
            <span>{copied ? "已复制" : "复制"}</span>
          </button>
          <p>ADD: {studio.address}</p>
          <p>{studio.addressEn}</p>
        </div>
      </div>
      <p className="copyright">©BINT FILM STUDIO</p>
    </section>
  );
}

export default function App() {
  const [entered, setEntered] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashExiting, setSplashExiting] = useState(false);

  const enterSite = () => {
    if (entered || splashExiting) return;
    setSplashExiting(true);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
    window.setTimeout(() => setEntered(true), 520);
    window.setTimeout(() => setShowSplash(false), 1040);
  };

  return (
    <>
      {showSplash && <SplashCover onEnter={enterSite} exiting={splashExiting} />}
      <div className={`site-shell${entered ? " is-entered" : ""}`} aria-hidden={!entered}>
        <NavBar />
        <main>
          <About />
          <Services />
          <Clients />
          <SelectedWorks />
          <Bloopers />
          <Contact />
        </main>
      </div>
      {entered && <FloatingContact />}
    </>
  );
}
