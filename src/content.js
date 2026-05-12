import coverImage from "../assets/cover/pdf-home-static.webp";
import coverLockup from "../assets/cover/yswj-lockup.png";

const clientLogoSources = Object.entries(
  import.meta.glob("../assets/client-logo-crops/logo-*.png", {
    eager: true,
    import: "default",
  }),
)
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([, src]) => src);

const clientLogoMeta = [
  { name: "长安汽车", size: 1.08, shape: "hero" },
  { name: "凤凰网", size: 0.98, shape: "wide" },
  { name: "重庆机场集团", size: 1.08, shape: "hero" },
  { name: "中国电信", size: 1.02, shape: "wide" },
  { name: "DJI", size: 1.04, shape: "wide" },
  { name: "重庆医科大学附属第二医院", size: 1.14, shape: "hero" },
  { name: "重庆大学", size: 1.06, shape: "wide" },
  { name: "宁德时代", size: 1.02, shape: "wide" },
  { name: "路虎", size: 0.98, shape: "medium" },
  { name: "NiSi", size: 0.9, shape: "medium" },
  { name: "中央广播电视总台", size: 1.1, shape: "hero" },
  { name: "SONY", size: 0.92, shape: "wide" },
  { name: "深蓝汽车", size: 1, shape: "wide" },
  { name: "极氪", size: 1, shape: "wide" },
  { name: "中国中央电视台", size: 0.96, shape: "medium" },
  { name: "中国中铁", size: 0.98, shape: "tall" },
  { name: "中国移动", size: 1, shape: "wide" },
  { name: "SanDisk", size: 0.98, shape: "wide" },
  { name: "捷豹", size: 1, shape: "wide" },
  { name: "央视频", size: 1, shape: "wide" },
  { name: "重庆日报报业集团", size: 1.04, shape: "medium" },
  { name: "重庆交通大学", size: 1.06, shape: "wide" },
  { name: "阿里云", size: 1, shape: "wide" },
];

import work01 from "../assets/works-protected/work-01.webp";
import work02 from "../assets/works-protected/work-02.webp";
import work03 from "../assets/works-protected/work-03.webp";
import work04 from "../assets/works-protected/work-04.webp";
import work05 from "../assets/works-protected/work-05.webp";
import work07 from "../assets/works-protected/work-07.webp";
import work08 from "../assets/works-protected/work-08.webp";
import work09 from "../assets/works-protected/work-09.webp";
import work10 from "../assets/works-protected/work-10.webp";
import work11 from "../assets/works-protected/work-11.webp";
import work12 from "../assets/works-protected/work-12.webp";
import work13 from "../assets/works-protected/work-13.webp";
import work14 from "../assets/works-protected/work-14.webp";
import work15 from "../assets/works-protected/work-15.webp";

import blooper01 from "../assets/bloopers-protected/blooper-01.webp";
import blooper02 from "../assets/bloopers-protected/blooper-02.webp";
import blooper03 from "../assets/bloopers-protected/blooper-03.webp";

export const studio = {
  coverImage,
  coverLockup,
  name: "BINT有神無迹影视",
  mark: "YSWJ",
  englishName: "BINT FILM STUDIO",
  wechat: "LOWLEVELFLIGHT",
  address: "重庆市南岸区南滨西路6号",
  addressEn: "NO. 6, NANBIN WEST ROAD, NAN'AN DISTRICT, CHONGQING, CHINA",
};

export const aboutLines = [
  "BINT FILM STUDIO 有神無迹影视",
  "2019年创立于重庆",
  "2023年完成专业化升级",
  "我们以“热浪吹拂 无限进步”为团队驱动力",
  "集结资深导演、摄影团队，配备先进制作设备与全流程协作资源",
  "专注为客户提供高质量的影视内容解决方案",
  "以可靠交付与创新执行力持续积累行业口碑",
  "坚持用专业态度打磨作品，助力品牌故事精准触达受众",
];

export const services = [
  "TVC广告片",
  "企业宣传片 / 产品宣传片 / 品牌宣传片",
  "纪录片 / 微电影",
  "短视频录制 / 代运营",
  "会议课程 / 直播录制",
  "AIGC制作",
  "官媒投放",
];

export const clientLogos = clientLogoSources.map((src, index) => ({
  src,
  name: clientLogoMeta[index]?.name ?? `合作客户 ${String(index + 1).padStart(2, "0")}`,
  size: clientLogoMeta[index]?.size ?? 1,
  shape: clientLogoMeta[index]?.shape ?? "wide",
}));

export const works = [
  work01,
  work02,
  work03,
  work04,
  work05,
  work07,
  work08,
  work09,
  work10,
  work11,
  work12,
  work13,
  work14,
  work15,
].map((src, index) => ({
  src,
  alt: `BINT 部分作品展示 ${String(index + 1).padStart(2, "0")}`,
}));

export const bloopers = [blooper01, blooper02, blooper03].map((src, index) => ({
  src,
  alt: `BINT 工作花絮 ${String(index + 1).padStart(2, "0")}`,
}));
