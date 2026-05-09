import { useEffect, useRef, useState } from "react";
import {
  aboutLines,
  bloopers,
  services,
  studio,
  works,
} from "./content.js";

function SplashCover({ onEnter, exiting }) {
  const coverRef = useRef(null);

  const updatePointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const shiftX = (x - 50) / 50;
    const shiftY = (y - 50) / 50;

    coverRef.current?.style.setProperty("--spot-x", `${x}%`);
    coverRef.current?.style.setProperty("--spot-y", `${y}%`);
    coverRef.current?.style.setProperty("--shift-x", shiftX.toFixed(3));
    coverRef.current?.style.setProperty("--shift-y", shiftY.toFixed(3));
  };

  const resetPointer = () => {
    coverRef.current?.style.setProperty("--spot-x", "50%");
    coverRef.current?.style.setProperty("--spot-y", "52%");
    coverRef.current?.style.setProperty("--shift-x", "0");
    coverRef.current?.style.setProperty("--shift-y", "0");
  };

  return (
    <section
      ref={coverRef}
      className={`splash-cover${exiting ? " is-exiting" : ""}`}
      aria-label="BINT Film Studio 进入封面"
      onClick={onEnter}
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
    >
      <img src={studio.coverImage} alt="" aria-hidden="true" />
      <div className="arri-frame" aria-hidden="true">
        <div className="arri-topline">
          <span className="record-dot" />
          <span>REC</span>
          <span>YSWJ / BINT FILM STUDIO</span>
          <span>00:00:00:00</span>
        </div>
        <div className="arri-safe-frame" />
        <div className="arri-crosshair" />
        <div className="arri-bottomline">
          <span>ALEXA 35</span>
          <span>4.6K OPEN GATE</span>
          <span>25 FPS</span>
          <span>180.0°</span>
          <span>EI 800</span>
          <span>WB 5600K</span>
        </div>
      </div>
      <div className="cover-scanline" aria-hidden="true" />
      <button
        className="enter-button"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onEnter();
        }}
      >
        进入官网 <span>Enter Site</span>
      </button>
    </section>
  );
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false);

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
        <a href="#about">关于</a>
        <a href="#services">业务</a>
        <a href="#clients">客户</a>
        <a href="#works">作品</a>
        <a href="#bloopers">花絮</a>
        <a href="#contact">联系</a>
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
        {aboutLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <p className="studio-line">以山城为原点 用影像创造价值</p>
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

function Clients() {
  return (
    <section className="clients" id="clients" aria-labelledby="clients-title">
      <div className="texture texture-white top" aria-hidden="true" />
      <SectionTitle kicker="CLIENTS" title="合作客户" />
      <div className="client-image">
        <img src={studio.clientsImage} alt="BINT Film Studio 合作客户标识墙" loading="lazy" />
      </div>
      <p className="copyright">©BINT FILM STUDIO</p>
    </section>
  );
}

function SelectedWorks() {
  const railRef = useRef(null);

  const scrollRail = (direction) => {
    railRef.current?.scrollBy({
      left: direction * Math.max(railRef.current.clientWidth * 0.82, 360),
      behavior: "smooth",
    });
  };

  return (
    <section className="works-section" id="works">
      <div className="texture texture-left top" aria-hidden="true" />
      <div className="works-heading">
        <SectionTitle kicker="PARTIAL WORKS DISPLAY" title="部分作品展示" align="left" />
        <div className="rail-actions" aria-label="作品展廊控制">
          <button type="button" onClick={() => scrollRail(-1)} aria-label="上一组作品">
            ←
          </button>
          <button type="button" onClick={() => scrollRail(1)} aria-label="下一组作品">
            →
          </button>
        </div>
      </div>
      <div className="works-rail" ref={railRef} aria-label="横向作品展廊">
        {works.map((work, index) => (
          <figure className="work-card" key={work.src}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <img src={work.src} alt={work.alt} loading="lazy" />
          </figure>
        ))}
      </div>
    </section>
  );
}

function Bloopers() {
  return (
    <section className="bloopers-section" id="bloopers">
      <div className="texture texture-right bottom" aria-hidden="true" />
      <SectionTitle kicker="WORK BLOOPERS" title="工作花絮" />
      <div className="blooper-grid">
        {bloopers.map((item, index) => (
          <figure key={item.src}>
            <img src={item.src} alt={item.alt} loading="lazy" />
            <figcaption>{String(index + 1).padStart(2, "0")}</figcaption>
          </figure>
        ))}
      </div>
      <p className="copyright">©BINT FILM STUDIO</p>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);

  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText(studio.wechat);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner">
        <h2>喜欢您来。</h2>
        <div className="contact-list">
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
    if (entered) return;
    setEntered(true);
    setSplashExiting(true);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
    window.setTimeout(() => setShowSplash(false), 560);
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
    </>
  );
}
