import coverImage from "../assets/cover/pdf-home.webp";
import clientsImage from "../assets/web/clients.webp";

import work01 from "../assets/works-selected/work-01.webp";
import work02 from "../assets/works-selected/work-02.webp";
import work03 from "../assets/works-selected/work-03.webp";
import work04 from "../assets/works-selected/work-04.webp";
import work05 from "../assets/works-selected/work-05.webp";
import work06 from "../assets/works-selected/work-06.webp";
import work07 from "../assets/works-selected/work-07.webp";
import work08 from "../assets/works-selected/work-08.webp";
import work09 from "../assets/works-selected/work-09.webp";
import work10 from "../assets/works-selected/work-10.webp";
import work11 from "../assets/works-selected/work-11.webp";
import work12 from "../assets/works-selected/work-12.webp";
import work13 from "../assets/works-selected/work-13.webp";
import work14 from "../assets/works-selected/work-14.webp";
import work15 from "../assets/works-selected/work-15.webp";

import blooper01 from "../assets/bloopers/blooper-01.webp";
import blooper02 from "../assets/bloopers/blooper-02.webp";
import blooper03 from "../assets/bloopers/blooper-03.webp";
import blooper04 from "../assets/bloopers/blooper-04.webp";

export const studio = {
  coverImage,
  clientsImage,
  name: "BINT有神無迹影视",
  mark: "YSWJ",
  englishName: "BINT FILM STUDIO",
  phone: "19863316862",
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

export const works = [
  work01,
  work02,
  work03,
  work04,
  work05,
  work06,
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

export const bloopers = [blooper01, blooper02, blooper03, blooper04].map((src, index) => ({
  src,
  alt: `BINT 工作花絮 ${String(index + 1).padStart(2, "0")}`,
}));
