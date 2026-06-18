/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  HelpCircle, 
  Tv, 
  Compass, 
  ChevronRight, 
  X,
  RefreshCw,
  Camera as CameraIcon,
  Layers,
  ChevronUp,
  Music,
  Volume2,
  VolumeX,
  Pause,
  Play,
  SkipForward,
  SkipBack
} from "lucide-react";
import { inkAudio, InstrumentType, TRADITIONAL_SONGS } from "./utils/audio";
import { 
  PoetData, 
  Star, 
  Nebula, 
  Particle, 
  Meteor, 
  PoetBodyState, 
  GameState 
} from "./types";

// @ts-ignore
import libaiLandscape from "./assets/images/libai_waterfall_scroll_1781142310412.png";
// @ts-ignore
import dufuLandscape from "./assets/images/dufu_landscape_1780538276729.png";
// @ts-ignore
import sushiLandscape from "./assets/images/sushi_landscape_1780538289864.png";
// @ts-ignore
import liqingzhaoLandscape from "./assets/images/liqingzhao_new_scroll_1780907335554.png";
// @ts-ignore
import xinqijiLandscape from "./assets/images/xinqiji_landscape_1780538317062.png";
// @ts-ignore
import liqingzhaoPortrait from "./assets/images/liqingzhao_portrait_new_1781138740006.png";
// @ts-ignore
import libaiPortrait from "./assets/images/libai_portrait_1781137539010.png";

const LANDSCAPE_IMAGES: Record<string, string> = {
  "李白": libaiLandscape,
  "杜甫": dufuLandscape,
  "苏轼": sushiLandscape,
  "李清照": liqingzhaoLandscape,
  "辛弃疾": xinqijiLandscape
};

const PORTRAIT_IMAGES: Record<string, string> = {
  "李清照": liqingzhaoPortrait,
  "李白": libaiPortrait
};

// Dynamic scripts helper to safely detect MediaPipe loading
declare const Hands: any;
declare const Camera: any;

// Beautiful custom realistic star drawing routine matching poet's identity uniformly
function drawShiningStar(
  ctx: CanvasRenderingContext2D, 
  cx: number, 
  cy: number, 
  size: number, 
  pulseFactor: number, 
  name: string,
  scale: number = 1.0
) {
  const scaledSize = size * scale;
  ctx.save();

  // Draw glowing halo around it (Atmospheric scattering - realistically soft & warm gold)
  const glowRadius = scaledSize * (3.8 + pulseFactor * 1.6);
  const glowGrad = ctx.createRadialGradient(cx, cy, 2 * scale, cx, cy, glowRadius);
  glowGrad.addColorStop(0, `rgba(229, 203, 159, ${0.48 + pulseFactor * 0.12})`);
  glowGrad.addColorStop(0.35, `rgba(201, 160, 99, ${0.16 + pulseFactor * 0.04})`);
  glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  // Draw customized flare shape for each poet to make them distinct
  ctx.beginPath();
  let spikes = 8;
  let selectOuterR = (i: number, pulse: number) => scaledSize * (1.3 + pulse * 0.28);
  let selectInnerR = (i: number) => scaledSize * 0.35;

  if (name === "李白") {
    // 8-pointed dazzling celestial compass star with elegant cardinal extensions
    spikes = 8;
    selectOuterR = (i: number, pulse: number) => {
      if (i % 2 === 0) {
        return scaledSize * (1.85 + pulse * 0.45); // extra long cardinal rays
      } else {
        return scaledSize * (0.95 + pulse * 0.15); // shorter diagonal rays
      }
    };
    selectInnerR = () => scaledSize * 0.32;
  } else if (name === "杜甫") {
    // Solid, humble, stable 6-pointed star (Hexagram layout)
    spikes = 6;
    selectOuterR = (i: number, pulse: number) => scaledSize * (1.25 + pulse * 0.24);
    selectInnerR = () => scaledSize * 0.42;
  } else if (name === "苏轼") {
    // Free-spirited multi-pointed radiant sunbox star (12 spikes)
    spikes = 12;
    selectOuterR = (i: number, pulse: number) => scaledSize * (1.12 + pulse * 0.22);
    selectInnerR = () => scaledSize * 0.52;
  } else if (name === "李清照") {
    // Slim, elegant, delicate 4-pointed cross star (Feminine Diamond Star)
    spikes = 4;
    selectOuterR = (i: number, pulse: number) => scaledSize * (1.7 + pulse * 0.5);
    selectInnerR = () => scaledSize * 0.22;
  } else if (name === "辛弃疾") {
    // Sharp, powerful, bold 5-pointed martial star representing courage
    spikes = 5;
    selectOuterR = (i: number, pulse: number) => scaledSize * (1.42 + pulse * 0.3);
    selectInnerR = () => scaledSize * 0.44;
  }

  let rot = Math.PI / 2 * 3;
  const step = Math.PI / spikes;

  for (let i = 0; i < spikes; i++) {
    const outerR = selectOuterR(i, pulseFactor);
    let x = cx + Math.cos(rot) * outerR;
    let y = cy + Math.sin(rot) * outerR;
    ctx.lineTo(x, y);
    rot += step;

    const innerR = selectInnerR(i);
    x = cx + Math.cos(rot) * innerR;
    y = cy + Math.sin(rot) * innerR;
    ctx.lineTo(x, y);
    rot += step;
  }

  // Close back to the first vertex
  const initialOuterR = selectOuterR(0, pulseFactor);
  ctx.lineTo(cx, cy - initialOuterR);
  ctx.closePath();
  ctx.fillStyle = '#fffbf0';
  ctx.shadowColor = '#ffe39f';
  ctx.shadowBlur = 10;
  ctx.fill();

  // Draw center core
  ctx.beginPath();
  ctx.arc(cx, cy, scaledSize * 0.42, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = "rgba(229, 203, 159, 1.0)";
  const fontSize = Math.round(15 * Math.sqrt(scale)); // scale font slightly less aggressively using sqrt for better legibility
  ctx.font = `bold ${fontSize}px "Noto Serif SC", "SimSun", serif`;
  ctx.shadowColor = 'rgba(0, 0, 0, 1.0)';
  ctx.shadowBlur = 6;
  ctx.textAlign = 'center';
  ctx.fillText(name, cx, cy - scaledSize * 1.8 - 4);
}

const POETS: PoetData[] = [
  {
    name: "李白",
    dynasty: "唐代",
    icon: "白",
    bio: "字太白，号青莲居士。唐代伟大的浪漫主义诗人，被后人誉为“诗仙”。其诗飘逸豪放，充满奇妙的艺术想象和浪漫情怀，将盛唐气象展现得淋漓画意。",
    text: "哈哈！来者何人？既来之，何不与太白对饮三杯？\n君不见黄河之水天上来，奔流到海不复回。\n五花马千金裘，呼儿将出换美酒，与尔同销万古愁啊！",
    curtains: "君不见黄河之水天上来奔流到海不复回君不见高堂明镜悲白发朝如青丝暮成雪人生得意须尽欢莫使金樽空对月天生我材必有用千金散尽还复来",
    bubbleText: "小后生来见我，带酒了否？",
    style: { inkColor: "rgba(248, 245, 235, 0.95)", sash: "#d4af37", actionType: "drink" }
  },
  {
    name: "杜甫",
    dynasty: "唐代",
    icon: "甫",
    bio: "字子美，自号少陵野老。唐代伟大的现实主义诗人，被奉为“诗圣”，其诗被称为“诗史”。其诗沉郁顿挫，心系家国苍生，具有伟大的博爱仁厚之心。",
    text: "风流总被雨打风吹去...后世之民，可还有冻馁之忧？\n安得广厦千万间，大庇天下寒士俱欢颜！\n若能见海内清平，吾愿足矣。",
    curtains: "风急天高猿啸哀渚清沙白鸟飞回无边落木萧萧下不尽长江滚滚来万里悲秋常作客百年多病独登台艰难苦恨繁霜鬓潦倒新停浊酒杯",
    bubbleText: "小后世，外头雨疏风骤，身上可穿暖、有瓦安居否？",
    style: { inkColor: "rgba(168, 195, 215, 0.95)", sash: "#2c3e50", actionType: "gaze" }
  },
  {
    name: "苏轼",
    dynasty: "宋代",
    icon: "轼",
    bio: "字子瞻，号东坡居士。北宋杰出的文学家、书画家，豪放派词人代表。一生仕途坎坷、历经贬谪，却始终保持乐观豁达、超然物外的旷达释意。",
    text: "大江东去，浪淘尽千古风流人物！\n后生，瞧你这星舟甚是俊疾。可知江上清风与山间明月，本无常主？\n且放白鹿青崖间，偷得浮生半日闲吧！",
    curtains: "大江东去浪淘尽千古风流人物故垒西边人道是三国周郎赤壁乱石穿空惊涛拍岸卷起千堆雪羽扇纶巾谈笑间樯橹灰飞烟灭江山如画",
    bubbleText: "后生别来无恙！此间星河甚美，可带得东坡肉一饱口腹？",
    style: { inkColor: "rgba(235, 215, 185, 0.95)", sash: "#8c5b30", actionType: "recite" }
  },
  {
    name: "李清照",
    dynasty: "宋代",
    icon: "照",
    bio: "号易安居士。宋代女词人，婉约词派代表，有“千古第一才女”之称。其词前期清丽多情、清新明快，后期国破家亡、颠沛流离，转向凄苦悲怆。",
    text: "冷冷清清，怎敌他晚来风急……这漫天飞舞的星尘，可是仙界落入凡间的点点愁思？\n载不动，许多愁。试问后世闺阁，绿肥红瘦，又是几度春秋？",
    curtains: "寻寻觅觅冷冷清清凄凄惨惨戚戚乍暖还寒时候最难将息三杯两盏淡酒怎敌他晚来风急雁过也正伤心却是旧时相识满地黄花堆积",
    bubbleText: "惊起滩头鸥鹭的小友，也知晚来风急、饮半盏淡酒么？",
    style: { inkColor: "rgba(225, 205, 245, 0.95)", sash: "#6c4f77", actionType: "sniff" }
  },
  {
    name: "辛弃疾",
    dynasty: "宋代",
    icon: "疾",
    bio: "字幼安，号稼轩。南宋豪放派词人、爱国将领。一生以恢复国家中原统一为己任. 词作多抒发报国无门、英雄迟暮的万丈悲愤与壮志雄心。",
    text: "蓦然回首，那人却在，灯火阑珊处……\n想当年，金戈铁马，气吞万里如虎！后生，看你意气风发，如今神州大地可曾平定？\n了却君王天下事，赢得生前身后名。壮志未酬啊！",
    curtains: "醉里挑灯看剑梦回吹角连营八百里分麾下炙五十弦翻塞外声沙场秋点兵马作的卢飞快弓如霹雳弦惊了却君王天下事赢得生前身后名",
    bubbleText: "执短剑的少年郎！看天下意气，神州山河可曾收复完璧？",
    style: { inkColor: "rgba(240, 175, 175, 0.95)", sash: "#8b1c1c", actionType: "sword" }
  }
];

interface PoemCardViewProps {
  gameState: GameState;
  activePoet: PoetData | null;
  isUiLocked: boolean;
  useMouseFallback: boolean;
  executeEnterDialogue: () => void;
  bubbleOnly: boolean;
  setBubbleOnly: (val: boolean) => void;
  activeStarPos: { x: number; y: number } | null;
  dismissPoetCard: () => void;
}

const PoemCardView = React.memo(({
  gameState,
  activePoet,
  isUiLocked,
  useMouseFallback,
  executeEnterDialogue,
  bubbleOnly,
  setBubbleOnly,
  activeStarPos,
  dismissPoetCard
}: PoemCardViewProps) => {
  if (gameState !== "CARD" || !activePoet) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    if (!useMouseFallback) return;
    if (isUiLocked) return;
    if (bubbleOnly) {
      setBubbleOnly(false);
    } else {
      executeEnterDialogue();
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className={`absolute inset-0 z-30 flex items-center justify-center transition-colors duration-500 pointer-events-auto ${
        bubbleOnly ? "bg-transparent" : "bg-black/60 backdrop-blur-sm"
      }`}
    >
      <AnimatePresence mode="wait">
        {bubbleOnly ? (
          <motion.div
            key="bubble"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", damping: 18, stiffness: 140 }}
            style={activeStarPos ? {
              position: "absolute",
              left: `${activeStarPos.x}px`,
              top: `${activeStarPos.y - 45}px`,
              transform: "translate(-50%, -100%)"
            } : undefined}
            className="absolute w-[360px] max-w-[90vw] bg-[#fcfaf7] border-2 border-[#8c6b4f] rounded-2xl py-4 px-5 text-amber-950 shadow-[0_12px_36px_rgba(0,0,0,0.55)] flex flex-col gap-3 items-center justify-center pointer-events-auto"
          >
            {/* Elegant double-bordered CSS speech bubble tail */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[16px] border-t-[#8c6b4f] flex justify-center">
              <div className="absolute -top-[18px] w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[14px] border-t-[#fcfaf7]"></div>
            </div>

            {/* Elegant close button in the top-right corner */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                dismissPoetCard();
              }}
              className="absolute top-2.5 right-2 px-1 rounded-full text-amber-800/60 hover:text-amber-900 hover:bg-[#8c6b4f]/10 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>

            <div className="flex gap-4 items-center w-full">
              {/* Calligraphy Avatar Circle */}
              <div className="w-12 h-12 rounded-full border border-[#8c6b4f]/40 flex items-center justify-center bg-gradient-to-br from-[#fcfaf4] to-[#ebdcb9] shadow-inner shrink-0 select-none animate-[pulse_2.5s_infinite]">
                <span className="text-2xl font-calligraphy text-[#44281a]">
                  {activePoet.icon}
                </span>
              </div>

              {/* Speech bubble text content */}
              <div className="flex flex-col gap-0.5 w-full text-left pr-4">
                <span className="text-[11px] text-[#8c6b4f] font-semibold tracking-wider font-sans uppercase">
                  {activePoet.dynasty} · {activePoet.name}
                </span>
                <p className="text-[14px] font-semibold font-serif leading-relaxed text-[#2a1b10] tracking-wide">
                  “{activePoet.bubbleText || activePoet.text.split("\n")[0]}”
                </p>
              </div>
            </div>

            {useMouseFallback ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBubbleOnly(false);
                }}
                className="w-full mt-1 py-1.5 px-4 bg-[#442810] hover:bg-[#5a3617] active:bg-[#301c0a] text-[#f7eeca] rounded-lg font-heading font-semibold tracking-widest text-[#f7eeca] hover:text-white text-xs transition-colors cursor-pointer shadow-md text-center"
              >
                【点击鼠标】展开诗词生平画卷
              </button>
            ) : (
              <div className="w-full text-center text-[10px] text-amber-800/80 animate-pulse font-sans border-t border-dashed border-[#8c6b4f]/20 pt-2.5 bg-transparent">
                <span>👌 【在镜前比划 👌 OK 手势并保持】开启千年画幻卷</span>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="scroll"
            initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateX: -20 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative w-[650px] max-w-[90vw] bg-gradient-to-br from-[#fdf6e2] to-[#ead9be] border-l-[18px] border-r-[18px] border-[#553518] shadow-[0_0_50px_rgba(0,0,0,0.95)] rounded-md py-8 px-10 text-amber-950"
          >
            {/* Elegant close button in the top-right corner */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                dismissPoetCard();
              }}
              className="absolute top-3 right-4 px-1.5 py-1.5 rounded-full text-amber-800/60 hover:text-amber-900 hover:bg-[#553518]/10 transition-colors cursor-pointer"
              title="关闭 (Close)"
              id="close-scroll-view-btn"
            >
              <X size={16} />
            </button>

            <div className="absolute top-1.5 right-12 text-amber-900/40 text-xs tracking-widest pointer-events-none select-none font-sans">
              ANCIENT SCROLL ENGRAVING
            </div>

            {/* Scroll Content header */}
            <div className="border-b-2 border-dashed border-amber-900/20 pb-4 mb-5 flex flex-col gap-1">
              <span className="text-xs font-semibold text-amber-800 tracking-[0.2em] uppercase font-sans">
                ✧ 于墨色星轨中邂逅古贤 ✧
              </span>
              <div className="flex items-center gap-4">
                <h2 className="text-4xl font-heading font-bold text-[#351e06] tracking-widest">
                  {activePoet.name}
                </h2>
                <span className="bg-[#442810] text-[#f7eeca] text-xs font-semibold px-2 py-0.5 rounded tracking-wider">
                  {activePoet.dynasty}
                </span>
              </div>
            </div>

            {/* Bio block with calligraphic avatar */}
            <div className="flex gap-6 mb-6">
              <div className="w-24 h-32 border border-amber-900/30 rounded flex items-center justify-center bg-gradient-to-br from-[#fdfbf6] to-[#efe2c7] shadow-inner shrink-0 select-none">
                <span className="text-5xl font-calligraphy text-[#44281a]">
                  {activePoet.icon}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sm leading-relaxed text-[#2a1b10] text-justify font-serif">
                  {activePoet.bio}
                </p>
              </div>
            </div>

            {/* Gesture Instructions action bar */}
            <div className="border-t border-dashed border-[#553518]/30 pt-5 mt-4 text-center min-h-[50px]">
              {isUiLocked ? (
                <div className="flex items-center justify-center gap-2 text-red-800/80 font-semibold animate-pulse">
                  <span>⏳ 正在展开宣纸，加载诗魂历史印记...</span>
                </div>
              ) : (
                <motion.div 
                  initial={{ scale: 0.98 }}
                  animate={{ scale: [0.98, 1.02, 0.98] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="text-md text-amber-900 font-heading font-medium tracking-wide">
                    是否与其开启跨越千年的星空会晤？
                  </span>
                  <button
                    onClick={executeEnterDialogue}
                    className="mt-3 py-2 px-8 bg-[#442810] hover:bg-[#5a3617] active:bg-[#301c0a] text-[#f7eeca] rounded font-heading font-bold tracking-[0.15em] transition-all shadow-md cursor-pointer text-sm"
                  >
                    {useMouseFallback ? "【点击鼠标】进入诗画幻境" : "【在镜前比划 👌 OK 手势】进入诗画幻境"}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.gameState === nextProps.gameState &&
    prevProps.isUiLocked === nextProps.isUiLocked &&
    prevProps.useMouseFallback === nextProps.useMouseFallback &&
    prevProps.bubbleOnly === nextProps.bubbleOnly &&
    prevProps.activePoet?.name === nextProps.activePoet?.name
  );
});

interface PoemDialogueBoxProps {
  gameState: GameState;
  activePoet: PoetData | null;
  useMouseFallback: boolean;
  dialogueLocked: boolean;
  executeCloseDialogue: () => void;
}

const InkTypewriterText = React.memo(({ text }: { text: string }) => {
  return (
    <span key={text} className="inline-block font-serif tracking-widest leading-loose">
      <style>{`
        @keyframes inkTypewriterFade {
          0% {
            opacity: 0;
            filter: blur(8px);
            transform: translateY(3px) scale(0.92);
          }
          100% {
            opacity: 1;
            filter: blur(0px);
            transform: translateY(0px) scale(1);
          }
        }
        .ink-char {
          display: inline-block;
          opacity: 0;
          animation: inkTypewriterFade 0.20s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
      {text.split("").map((char, index) => {
        if (char === "\n") {
          return <br key={index} />;
        }
        return (
          <span
            key={index}
            className="ink-char"
            style={{
              animationDelay: `${index * 10}ms`,
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
});

const PoemDialogueBox = React.memo(({
  gameState,
  activePoet,
  useMouseFallback,
  dialogueLocked,
  executeCloseDialogue
}: PoemDialogueBoxProps) => {
  if (gameState !== "DIALOGUE" || !activePoet) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.8 } }}
      className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-[85%] max-w-[850px] ${
        activePoet.name === "李清照" ? "bg-[#120f18]/10 px-6 py-3.5 gap-1.5" : "bg-[#120f18]/96 px-6 py-6 gap-3"
      } border-2 border-amber-500/60 rounded-md z-30 pointer-events-auto flex flex-col shadow-2xl shadow-black/80`}
    >
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
        <span className="text-lg font-heading font-bold text-amber-200 tracking-wider">
          {activePoet.name} <span className="text-xs text-amber-400 font-sans">（{activePoet.dynasty}）</span>
        </span>
        <span className="text-xs text-emerald-400 tracking-widest font-sans uppercase animate-pulse-slow">
          {dialogueLocked ? "• 诗圣显圣酝酿中 •" : "• 宿星神晤中 •"}
        </span>
      </div>

      <div className={`text-xl leading-relaxed text-[#fdf4dd] font-serif tracking-widest py-2 whitespace-pre-wrap ${
        activePoet.name === "李清照" ? "min-h-[60px]" : "min-h-[120px]"
      }`}>
        「 <InkTypewriterText text={activePoet.text} /> 」
      </div>

      <div className="border-t border-amber-500/10 pt-3 flex justify-between items-center text-xs text-amber-400/70">
        {useMouseFallback ? (
          <button
            onClick={() => executeCloseDialogue()}
            disabled={dialogueLocked}
            className={`px-4 py-1.5 border rounded transition-colors ${
              dialogueLocked 
                ? "bg-zinc-800/30 border-zinc-700/50 text-zinc-500 cursor-not-allowed" 
                : "bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-100 cursor-pointer"
            }`}
          >
            {dialogueLocked 
              ? "⏳ 字迹酝酿中，请稍候..." 
              : "🖐️🖐️ 【点击鼠标】展开诗词生平画卷"
            }
          </button>
        ) : (
          <span className="flex items-center gap-1.5">
            {dialogueLocked 
              ? "⏳ 墨彩挥毫写就中...请静赏绝美文字动画" 
              : "🖐️🖐️ 【在镜前比划 🖐️🖐️ 双手张开并保持】展开宣纸诗魂古卷"
            }
          </span>
        )}
        <span className="font-mono text-amber-500/40">
          Action: {activePoet.style.actionType.toUpperCase()}
        </span>
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.gameState === nextProps.gameState &&
    prevProps.useMouseFallback === nextProps.useMouseFallback &&
    prevProps.dialogueLocked === nextProps.dialogueLocked &&
    prevProps.activePoet?.name === nextProps.activePoet?.name &&
    prevProps.activePoet?.text === nextProps.activePoet?.text
  );
});

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // Preloaded landscape images
  const landscapeImagesRef = useRef<Record<string, HTMLImageElement>>({});
  const poetPortraitsRef = useRef<Record<string, HTMLImageElement>>({});
  const keyedPortraitCanvasesRef = useRef<Record<string, HTMLCanvasElement>>({});
  useEffect(() => {
    const images: Record<string, HTMLImageElement> = {};
    Object.entries(LANDSCAPE_IMAGES).forEach(([name, src]) => {
      const img = new Image();
      img.src = src;
      images[name] = img;
    });
    landscapeImagesRef.current = images;

    // Preload and chroma-key portraits to extract characters from white background
    const portraits: Record<string, HTMLImageElement> = {};
    Object.entries(PORTRAIT_IMAGES).forEach(([name, src]) => {
      const pImg = new Image();
      pImg.src = src;
      pImg.crossOrigin = "anonymous";
      const performChromaKey = () => {
        const offscreen = document.createElement("canvas");
        const w = pImg.naturalWidth || pImg.width || 750;
        const h = pImg.naturalHeight || pImg.height || 1000;
        offscreen.width = w;
        offscreen.height = h;
        const oCtx = offscreen.getContext("2d");
        if (oCtx) {
          oCtx.drawImage(pImg, 0, 0);
          try {
            const imgData = oCtx.getImageData(0, 0, w, h);
            const data = imgData.data;

            if (name === "李清照") {
              // BFS boundary flood fill to remove background ONLY, keeping her original white dress/book unmodified
              const visited = new Uint8Array(w * h);
              const queue: number[] = [];
              const pushPixel = (x: number, y: number) => {
                const idx = y * w + x;
                if (idx >= 0 && idx < w * h && !visited[idx]) {
                  visited[idx] = 1;
                  queue.push(idx);
                }
              };
              // Initialize queue with all boundary pixels
              for (let x = 0; x < w; x++) {
                pushPixel(x, 0);
                pushPixel(x, h - 1);
              }
              for (let y = 0; y < h; y++) {
                pushPixel(0, y);
                pushPixel(w - 1, y);
              }

              let head = 0;
              while (head < queue.length) {
                const idx = queue[head++];
                const x = idx % w;
                const y = Math.floor(idx / w);
                const i = idx * 4;

                // Clear watermarks in the bottom-right corner area
                if (x > w * 0.8 && y > h * 0.92) {
                  data[i + 3] = 0;
                  if (x > 0) pushPixel(x - 1, y);
                  if (x < w - 1) pushPixel(x + 1, y);
                  if (y > 0) pushPixel(x, y - 1);
                  if (y < h - 1) pushPixel(x, y + 1);
                  continue;
                }

                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const maxVal = Math.max(r, g, b);
                const minVal = Math.min(r, g, b);
                const diff = maxVal - minVal;

                // Background criteria: near-white and low saturation
                if (minVal > 210 && diff < 25) {
                  data[i + 3] = 0;
                  if (x > 0) pushPixel(x - 1, y);
                  if (x < w - 1) pushPixel(x + 1, y);
                  if (y > 0) pushPixel(x, y - 1);
                  if (y < h - 1) pushPixel(x, y + 1);
                }
              }
            } else {
              for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                
                // Map 1D index to 2D coordinates to accurately remove the watermark at the bottom right corner
                const pixelIdx = i / 4;
                const pxX = pixelIdx % w;
                const pxY = Math.floor(pixelIdx / w);
                
                // Clear bottom-right watermark (anything below 92% height and right of 80% width)
                if (pxX > w * 0.8 && pxY > h * 0.92) {
                  data[i + 3] = 0;
                  continue;
                }

                const maxVal = Math.max(r, g, b);
                const minVal = Math.min(r, g, b);
                const diff = maxVal - minVal;

                // Watercolor paper background check: high brightness & low saturation (neutral white/cream)
                if (minVal > 195 && diff < 25) {
                  // If extremely bright, make it fully transparent. Otherwise, fade it smoothly.
                  let ratio = 1.0;
                  if (minVal > 240) {
                    ratio = 0.0;
                  } else {
                    ratio = (240 - minVal) / (240 - 195);
                  }
                  data[i + 3] = Math.max(0, Math.min(255, Math.floor(data[i + 3] * ratio)));
                }
              }
            }
            oCtx.putImageData(imgData, 0, 0);
            keyedPortraitCanvasesRef.current[name] = offscreen;
          } catch (e) {
            console.warn("Unable to perform local chroma-keying due to canvas context security", e);
          }
        }
      };

      if (pImg.complete) {
        performChromaKey();
      } else {
        pImg.onload = performChromaKey;
      }
      portraits[name] = pImg;
    });
    poetPortraitsRef.current = portraits;
  }, []);
  
  // App States
  const [gameState, setGameState] = useState<GameState>("INTRO");
  const [activePoet, setActivePoet] = useState<PoetData | null>(null);
  const [activeStarPos, setActiveStarPos] = useState<{ x: number; y: number } | null>(null);
  const [isUiLocked, setIsUiLocked] = useState(false);
  const [travelCooldown, setTravelCooldown] = useState(false);
  const [hudMessage, setHudMessage] = useState("正在唤醒水墨星尘引擎...");
  const [cameraActive, setCameraActive] = useState(false);
  const [hasWebcamError, setHasWebcamError] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [useMouseFallback, setUseMouseFallback] = useState(false);
  const [isCameraPermissionGranted, setIsCameraPermissionGranted] = useState(false);
  const [dialogueLocked, setDialogueLocked] = useState(false);

  // Traditional Chinese Music State Managers
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicPreset, setMusicPreset] = useState<InstrumentType>('flute');
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [lastPluckedNote, setLastPluckedNote] = useState<string>("");
  const [musicMode, setMusicMode] = useState<'song' | 'ambient'>('song');
  const [currentSongTitle, setCurrentSongTitle] = useState("《高山流水》");
  const [currentSongNoteTag, setCurrentSongNoteTag] = useState("巍");
  const [currentSongNoteIdx, setCurrentSongNoteIdx] = useState(0);
  const [songIndex, setSongIndex] = useState(2);

  useEffect(() => {
    // Sync shared audio plucking notifier to state for real-time ink display
    inkAudio.onNotePlucked = (note) => {
      setLastPluckedNote(note);
    };

    // Sync song note sequencing triggers to state
    inkAudio.onSongNotePlayed = (songTitle, noteTag, noteIdx) => {
      setCurrentSongTitle(songTitle);
      setCurrentSongNoteTag(noteTag);
      setCurrentSongNoteIdx(noteIdx);
    };

    // Sync default config
    inkAudio.setVolume(musicVolume);
    inkAudio.setPreset(musicPreset);
    inkAudio.setPlayMode(musicMode);
    inkAudio.setCurrentSongIdx(songIndex);

    return () => {
      inkAudio.destroy();
    };
  }, []);

  const dismissPoetCard = () => {
    setGameState("TRAVEL");
    setActivePoet(null);
    setActiveStarPos(null);
  };

  const handleNextSong = () => {
    const nextIdx = (songIndex + 1) % TRADITIONAL_SONGS.length;
    setSongIndex(nextIdx);
    inkAudio.setCurrentSongIdx(nextIdx);
    const nextSong = TRADITIONAL_SONGS[nextIdx];
    setCurrentSongTitle(nextSong.title);
    setCurrentSongNoteIdx(0);
    setHudMessage(`🎵 琴师弄弦，已转入名曲：${nextSong.title} (${nextSong.composer})`);
  };

  const handlePrevSong = () => {
    const prevIdx = (songIndex - 1 + TRADITIONAL_SONGS.length) % TRADITIONAL_SONGS.length;
    setSongIndex(prevIdx);
    inkAudio.setCurrentSongIdx(prevIdx);
    const prevSong = TRADITIONAL_SONGS[prevIdx];
    setCurrentSongTitle(prevSong.title);
    setCurrentSongNoteIdx(0);
    setHudMessage(`🎵 琴师弄弦，已转入名曲：${prevSong.title} (${prevSong.composer})`);
  };

  const handleToggleMode = () => {
    const newMode = musicMode === 'song' ? 'ambient' : 'song';
    setMusicMode(newMode);
    inkAudio.setPlayMode(newMode);
    if (newMode === 'ambient') {
      setHudMessage(`✨ 已开启【星海听风】环境冥想，星光宇宙律动随心流动...`);
    } else {
      const activeSong = TRADITIONAL_SONGS[songIndex];
      setCurrentSongTitle(activeSong.title);
      setHudMessage(`🎵 已开启【古曲品吟】模式，正在雅奏 ${activeSong.title}...`);
    }
  };
  const [bubbleOnly, setBubbleOnly] = useState<boolean>(true);

  // Graphics variables refs for canvas access to bypass stale state closures
  const bubbleOnlyRef = useRef<boolean>(true);
  
  const changeBubbleOnly = (val: boolean) => {
    setBubbleOnly(val);
    bubbleOnlyRef.current = val;
  };

  const starsRef = useRef<Star[]>([]);
  const nebulasRef = useRef<Nebula[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const meteorRef = useRef<Meteor>({
    x: 0, y: 0, targetX: 0, targetY: 0, vx: 0, vy: 0, radius: 8, trail: []
  });
  const poetBodyRef = useRef<PoetBodyState>({
    x: 0, y: 0, scale: 0, targetScale: 1.0, alpha: 0, animTime: 0, fadeOutStage: false
  });
  const warpSpeedRef = useRef<number>(1);
  const isWarpingRef = useRef<boolean>(false);
  const travelCooldownRef = useRef<boolean>(false);
  const stateRef = useRef<GameState>("INTRO");
  const activePoetRef = useRef<PoetData | null>(null);
  const isUiLockedRef = useRef<boolean>(false);
  const consecutiveFistFramesRef = useRef<number>(0);
  const consecutiveOkFramesRef = useRef<number>(0);
  const consecutiveDoubleOpenFramesRef = useRef<number>(0);
  const consecutiveOpenFramesRef = useRef<number>(0);
  const dialogueLockRef = useRef<boolean>(false);

  // Stale closure bypass refs for MediaPipe callback
  const executeEnterDialogueRef = useRef<() => void>(() => {});
  const executeCloseDialogueRef = useRef<(isImmediate?: boolean) => void>(() => {});

  const triggerDialogueLock = (locked: boolean) => {
    setDialogueLocked(locked);
    dialogueLockRef.current = locked;
  };

  // Synchronize state value to mutable ref for high speed animation loop access
  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    activePoetRef.current = activePoet;
  }, [activePoet]);

  useEffect(() => {
    travelCooldownRef.current = travelCooldown;
  }, [travelCooldown]);

  useEffect(() => {
    isUiLockedRef.current = isUiLocked;
  }, [isUiLocked]);

  // Synchronize dynamic function closures to prevent stale event handlers in MediaPipe handsInstance
  useEffect(() => {
    executeEnterDialogueRef.current = executeEnterDialogue;
    executeCloseDialogueRef.current = executeCloseDialogue;
  });

  // Generate romantic starry background and poets constellations
  const initEngine = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    // 1. Generate multi-layered drifting gas nebulae
    const nebulaColors = [
      'rgba(26, 18, 52, 0.22)',  // Dark amethyst
      'rgba(12, 32, 58, 0.2)',   // Starbound blue
      'rgba(46, 28, 22, 0.14)',  // Amber glow
      'rgba(10, 38, 38, 0.16)'   // Teal nebula
    ];
    const initialNebulas: Nebula[] = [];
    for (let i = 0; i < 6; i++) {
      initialNebulas.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 250 + 150,
        color: nebulaColors[i % nebulaColors.length],
        angle: Math.random() * Math.PI * 2,
        speed: 0.001 + Math.random() * 0.002
      });
    }
    nebulasRef.current = initialNebulas;

    // 2. Generate twinkling stars (deep romantic background)
    const initialStars: Star[] = [];
    for (let i = 0; i < 400; i++) {
      const depth = Math.random();
      initialStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: depth * 1.5 + 0.3,
        alpha: Math.random(),
        speed: 0.003 + Math.random() * 0.008,
        depth: depth,
        isPoet: false,
        offset: Math.random() * 100
      });
    }

    // 3. Position Poet constellations in a stellar ink-wash horizon (Middle-to-lower portion of the screen, completely clear of the prompt panel)
    POETS.forEach((poet, index) => {
      const cw = canvas.width;
      const ch = canvas.height;
      // Distribute stars evenly horizontally across the gorgeous cosmic scene (spanning from 12% to 88% width)
      const segmentW = (cw * 0.76) / (POETS.length - 1 || 1);
      const x = cw * 0.12 + segmentW * index;
      
      // Position vertically in the middle-to-lower section, slightly shifted up to guarantee vertical distance from the player
      const y = ch * 0.50 + Math.sin(index * 1.5) * (ch * 0.08) + (index % 2 === 0 ? 15 : -15);

      // Unique sizes (radii) representing each poet's celestial characteristics
      let initialRadius = 12;
      if (poet.name === "李白") {
        initialRadius = 16;  // Radiant romantic giant star
      } else if (poet.name === "杜甫") {
        initialRadius = 11;  // Grounded realistic stable star
      } else if (poet.name === "苏轼") {
        initialRadius = 13.5; // Dynamic whimsical star
      } else if (poet.name === "李清照") {
        initialRadius = 9.5;  // Delicate feminine diamond-cross star
      } else if (poet.name === "辛弃疾") {
        initialRadius = 15;   // Broad martial heroic star
      }

      initialStars.push({
        x: x,
        y: y,
        radius: initialRadius, // Star core size indicator
        alpha: 1,
        speed: 0,
        depth: 0.1,
        isPoet: true,
        poetData: poet,
        pulse: Math.random() * 10,
        offset: index
      });
    });

    starsRef.current = initialStars;

    // Setup player cursor meteor
    meteorRef.current = {
      x: canvas.width / 2,
      y: canvas.height * 0.88, // Positioned lower on the screen to avoid any accidental start touch
      targetX: canvas.width / 2,
      targetY: canvas.height * 0.88,
      vx: 0,
      vy: 0,
      radius: 8,
      trail: []
    };
  };

  // Safe window resizing observer
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      initEngine();
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial setup

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Set up standard MediaPipe Hands model tracking
  useEffect(() => {
    if (!isCameraPermissionGranted) return;

    let activeCamera: any = null;
    let fallbackTimer: NodeJS.Timeout;

    const startMediaPipe = async () => {
      if (!videoRef.current || typeof window === 'undefined') return;

      const mpHands = (window as any).Hands;

      if (!mpHands) {
        // Scripts might still be loading, retry in a second
        fallbackTimer = setTimeout(startMediaPipe, 1000);
        return;
      }

      try {
        const handsInstance = new mpHands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`
        });

        handsInstance.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.70,
          minTrackingConfidence: 0.70
        });

        handsInstance.onResults((results: any) => {
          const lastState = stateRef.current;
          
          // Clean state mismatch limits
          if (lastState !== "CARD") {
            consecutiveFistFramesRef.current = 0;
            consecutiveOkFramesRef.current = 0;
            consecutiveDoubleOpenFramesRef.current = 0;
          }
          if (lastState !== "DIALOGUE") consecutiveOpenFramesRef.current = 0;

          if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            // Decelerate exit debouncing if hand is completely out of frame to prevent abrupt disconnection triggers
            consecutiveOpenFramesRef.current = 0; 
            return;
          }

          // Highly accurate and rotation-invariant distance calculations
          const getDistance = (p1: any, p2: any) => {
            return Math.sqrt(
              Math.pow(p1.x - p2.x, 2) + 
              Math.pow(p1.y - p2.y, 2) + 
              Math.pow((p1.z || 0) - (p2.z || 0), 2)
            );
          };

          const evaluateHand = (lms: any) => {
            const pSz = getDistance(lms[0], lms[9]);
            const rIdx = getDistance(lms[8], lms[5]) / pSz;
            const rMid = getDistance(lms[12], lms[9]) / pSz;
            const rRng = getDistance(lms[16], lms[13]) / pSz;
            const rPnk = getDistance(lms[20], lms[17]) / pSz;

            const isIndexFld = rIdx < 0.52;
            const isMiddleFld = rMid < 0.52;
            const isRingFld = rRng < 0.52;
            const isPinkyFld = rPnk < 0.52;

            const fldCount = [isIndexFld, isMiddleFld, isRingFld, isPinkyFld].filter(Boolean).length;
            const fist = fldCount >= 3 && rMid < 0.48 && rRng < 0.48;

            const thbIndexDist = getDistance(lms[4], lms[8]);
            const dThbIndex = thbIndexDist / pSz;
            const isThbIndexTouching = dThbIndex < 0.28;

            const isMidExt = rMid > 0.72;
            const isRngExt = rRng > 0.72;
            const isPnkExt = rPnk > 0.62;
            const okExtCount = [isMidExt, isRngExt, isPnkExt].filter(Boolean).length;
            const ok = isThbIndexTouching && okExtCount >= 2;

            const open = fldCount <= 2 && rIdx > 0.58 && rMid > 0.58 && rRng > 0.58;

            return { isFist: fist, isOk: ok, isOpenHand: open, foldedCount: fldCount };
          };

          const numHands = results.multiHandLandmarks.length;
          const analyzedHands = results.multiHandLandmarks.map((lms: any) => evaluateHand(lms));

          const landmarks = results.multiHandLandmarks[0];
          const primaryAnalysis = analyzedHands[0];
          
          const isFist = primaryAnalysis.isFist;
          const isOk = primaryAnalysis.isOk;
          const isOpen = primaryAnalysis.isOpenHand;
          const foldedCount = primaryAnalysis.foldedCount;

          const isDoubleOpen = numHands >= 2 && analyzedHands[0].isOpenHand && analyzedHands[1].isOpenHand;

          // Smooth coordinate mapping using index 9 (palm center)
          const palmX = (1 - landmarks[9].x) * window.innerWidth;
          const palmY = landmarks[9].y * window.innerHeight;

          // Update position variables
          if (lastState === "TRAVEL") {
            if (travelCooldownRef.current) {
               setHudMessage("✨ 星河轨道重组中，请静候...");
            } else {
               setHudMessage("🖐️ 驾驭手掌：操控流星御空穿梭中");
               meteorRef.current.targetX = palmX;
               meteorRef.current.targetY = palmY;
            }
          } else if (lastState === "CARD" && !isUiLockedRef.current) {
            if (isOk) {
              consecutiveOkFramesRef.current = Math.min(4, consecutiveOkFramesRef.current + 1);
              consecutiveDoubleOpenFramesRef.current = 0;
              setHudMessage(`👌 检测到 OK 手势...正在开启诗画时空画卷 (${consecutiveOkFramesRef.current}/4)`);
              if (consecutiveOkFramesRef.current >= 4) {
                consecutiveOkFramesRef.current = 0;
                setHudMessage("👌 OK 手势确认！开启时空会晤与千年诗画幻境！");
                executeEnterDialogueRef.current();
              }
            } else {
              consecutiveOkFramesRef.current = Math.max(0, consecutiveOkFramesRef.current - 1);
              if (consecutiveOkFramesRef.current > 0) {
                setHudMessage(`👌 请保持 OK 手势... (${consecutiveOkFramesRef.current}/4)`);
              } else {
                setHudMessage("👌 请在镜前比划【👌 OK 手势】开启诗画幻境、与古贤隔空对饮");
              }
              consecutiveDoubleOpenFramesRef.current = 0;
            }
          } else if (lastState === "CURTAIN") {
            setHudMessage("✨ 时空之门正在开启中...");
          } else if (lastState === "DIALOGUE") {
            if (dialogueLockRef.current) {
              consecutiveDoubleOpenFramesRef.current = 0;
              setHudMessage("💬 古贤降临，字韵氤氲：请静赏大诗家之绝句徐徐吟诵写就...");
            } else {
              if (isDoubleOpen) {
                consecutiveDoubleOpenFramesRef.current = 0;
                setHudMessage("🖐️🖐️ 双手张开成功！宣纸古轴卷轴开启...");
                executeCloseDialogueRef.current(true);
              } else {
                consecutiveDoubleOpenFramesRef.current = 0;
                setHudMessage("💬 与古贤隔空神晤：在镜前比划并保持【🖐️🖐️ 双手张开】即可打开古卷，观其生平");
              }
            }
          } else if (lastState === "WARPING") {
            const poetBody = poetBodyRef.current;
            if (poetBody && poetBody.fadeOutStage && poetBody.lqSequence === "pause") {
              const selectFist = isFist || foldedCount >= 3;
              if (selectFist) {
                setHudMessage("✊ 检测到握拳！卷轴收拢，起航飞向星海！");
                poetBody.lqSequence = "fold_close";
              } else {
                setHudMessage("📜 诗画古卷已展...请在镜前【✊ 比划握拳手势】或【轻点任意处】合上卷轴、重返流星之旅");
              }
            } else {
              setHudMessage("🚀 正穿越万重星河，遁入大罗仙境...");
            }
          }
        });

        // Use native getUserMedia for maximum reliability within iframes
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 320, height: 240, facingMode: "user" } 
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await new Promise((resolve) => {
            videoRef.current!.onloadedmetadata = () => resolve(true);
          });
          
          try {
            await videoRef.current.play();
          } catch (playErr) {
            console.warn("Video play triggered user event catch:", playErr);
          }
          
          let captureActive = true;
          activeCamera = { stop: () => { captureActive = false; stream.getTracks().forEach(t => t.stop()); } };

          const processFrame = async () => {
            if (!captureActive) return;
            try {
              if (videoRef.current && videoRef.current.readyState >= 2) {
                await handsInstance.send({ image: videoRef.current });
              }
            } catch (frameErr) {
              console.error("MediaPipe processed frame failed internally:", frameErr);
              // Set fallback to protect user layout stability and prevent thread locks
              setHasWebcamError(true);
              setUseMouseFallback(true);
              setHudMessage("💻 摄像头侦测到安全沙箱限制，已平滑切换至【优雅鼠标模式】");
              return; // Stop animation loop to save browser overhead
            }
            requestAnimationFrame(processFrame);
          };
          processFrame();
          
          setCameraActive(true);
          setUseMouseFallback(false);
          setHudMessage("✨ 水墨星尘引擎唤醒成功！请张开手掌对准摄像头操控流星");
        } else {
          throw new Error("Video element not found");
        }
      } catch (err) {
        console.warn("Camera/MediaPipe initiation issue. Falling back to mouse controls.", err);
        setHasWebcamError(true);
        setUseMouseFallback(true);
        setHudMessage("💻 摄像头未能启动。已切换至【优雅鼠标交互】：点击或滑动唤醒水墨宿星");
      }
    };

    startMediaPipe();

    return () => {
      clearTimeout(fallbackTimer);
      if (activeCamera) {
        activeCamera.stop();
      }
    };
  }, [isCameraPermissionGranted]);

  // Dialogue transitions: Trigger active poet card
  const triggerPoetCard = (poet: PoetData, starX?: number, starY?: number) => {
    setGameState("CARD");
    setActivePoet(poet);
    if (starX !== undefined && starY !== undefined) {
      setActiveStarPos({ x: starX, y: starY });
    } else {
      setActiveStarPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
    setIsUiLocked(true);
    changeBubbleOnly(true);
    poetBodyRef.current.fadeOutStage = false;

    // Celestial star hit chime chords
    inkAudio.pluck(523.25, 'star', 2.0); // C5 chime
    setTimeout(() => inkAudio.pluck(659.25, 'star', 1.8), 100); // E5 chime
    setTimeout(() => inkAudio.pluck(783.99, 'star', 1.8), 200); // G5 chime

    // Open scroll (卷轴) with brief loading delay to mimic ink spreading
    setTimeout(() => {
      setIsUiLocked(false);
    }, 1200);
  };

  // Dialogue transitions: Entering Ink-curtain sequence
  const executeEnterDialogue = () => {
    setGameState("CURTAIN");
    particlesRef.current = [];
    triggerDialogueLock(true); // Lock exits safely for high-end text animation preservation
    
    const poet = activePoet;
    
    // Initial position of poet body silhouette
    poetBodyRef.current = {
      x: poet?.name === "李清照" ? -150 : window.innerWidth / 2,
      targetX: window.innerWidth / 2,
      y: window.innerHeight * 0.40,
      scale: poet?.name === "李清照" ? 1.0 : 0.1,
      targetScale: 1.0,
      alpha: 0,
      animTime: 0,
      fadeOutStage: false,
      lqSequence: "idle",
      lqUnfoldRatio: 0.0,
      lqPauseFrames: 30,
      lqPoetHidden: false
    };

    if (!poet) return;

    // Trigger beautiful traditional Chinese instrument cascade tailored to the poet style!
    inkAudio.triggerOpeningCascade(poet.style.actionType as any);

    // Trigger individual custom entrance structures as specified!
    if (poet.name === "辛弃疾") {
      // 辛弃疾: Solid vertical lines of poem characters forming a solid curtain that splits left and right
      const cols = 24;
      const rows = 15;
      const centerCol = cols / 2;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      // Ensure he is fully faded initially behind the curtain
      poetBodyRef.current.alpha = -0.1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < Math.floor(cols); c++) {
          const char = poet.curtains[(r * cols + c) % poet.curtains.length];
          const x = (c / Math.max(1, cols - 1)) * screenW;
          const y = (r / Math.max(1, rows - 1)) * screenH;
          const side = c < centerCol ? "left" : "right";

          particlesRef.current.push({
            id: Math.random(),
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            size: 20 + Math.random() * 8,
            char: char,
            life: Math.random() * 50 + 150, // Slight variation to make it feel natural
            maxLife: 200,
            color: poet.style.inkColor,
            type: "curtain",
            originalX: x,
            side: side as "left" | "right"
          });
        }
      }
    } 
    else if (poet.name === "李白") {
      // 李白: Waterfall of characters appearing in the middle
      poetBodyRef.current.scale = 0.05; // Make him start small and scale up (walk out effect)
      poetBodyRef.current.targetScale = 1.0;
      
      const screenW = window.innerWidth;
      for (let i = 0; i < 60; i++) {
        particlesRef.current.push({
          id: Math.random(),
          x: screenW / 2 + (Math.random() - 0.5) * 80, // Concentrated in the middle
          y: Math.random() * -600,
          vx: (Math.random() - 0.5) * 0.5,
          vy: 8 + Math.random() * 6,
          size: 16 + Math.random() * 10,
          char: poet.curtains[Math.floor(Math.random() * poet.curtains.length)],
          life: 200,
          maxLife: 200,
          color: "rgba(240, 246, 255, 0.95)",
          type: "waterfall"
        });
      }
    } 
    else if (poet.name === "苏轼") {
      // 苏轼: Constellation of whirling golden orbital characters that revolve around him
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const cx = screenW / 2;
      const cy = screenH * 0.55;
      
      poetBodyRef.current.alpha = 0; // no delay

      for (let i = 0; i < 100; i++) {
        const targetRadius = 60 + Math.random() * 320;
        const initialRadius = 10 + Math.random() * 20; // start from center!
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.02 + Math.random() * 0.04;
        
        particlesRef.current.push({
          id: Math.random(),
          x: cx + Math.cos(angle) * initialRadius,
          y: cy + Math.sin(angle) * initialRadius,
          vx: speed, // Treat vx as orbital speed (dTheta)
          vy: initialRadius, // Treat vy as CURRENT radius
          size: 16 + Math.random() * 10,
          char: poet.curtains[i % poet.curtains.length],
          life: 250,
          maxLife: 250,
          color: "rgba(235, 215, 185, 0.9)",
          type: "orbit",
          angle: angle,
          targetRadius: targetRadius
        });
      }
    } 
    else if (poet.name === "李清照") {
      // 李清照: 满屏文字雨 (Text rain from above)
      poetBodyRef.current.x = window.innerWidth / 2;
      poetBodyRef.current.targetX = window.innerWidth / 2;
      poetBodyRef.current.scale = 0.5; // Starts scaled up in center
      poetBodyRef.current.alpha = -0.1; // Gentle fade in

      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const dropCount = 100;

      for (let i = 0; i < dropCount; i++) {
        particlesRef.current.push({
          id: Math.random(),
          x: Math.random() * screenW,
          y: Math.random() * -screenH * 1.5, // staggered starting points above screen
          vx: (Math.random() - 0.5) * 0.4,
          vy: 6 + Math.random() * 5, // raining speed
          size: 26 + Math.random() * 12,
          char: poet.curtains[Math.floor(Math.random() * poet.curtains.length)],
          life: 300,
          maxLife: 300,
          color: "rgba(180, 160, 230, 0.72)",
          type: "rain"
        });
      }
    } 
    else if (poet.name === "杜甫") {
      // 杜甫: Birds of characters (flying poem bird flocks)
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      
      poetBodyRef.current.scale = 0.5; // Initial normal size, delayed alpha
      poetBodyRef.current.targetScale = 1.0;
      poetBodyRef.current.alpha = -0.2; // Delay poet body so birds cross first!

      const flockSize = 6; // MORE flocks!
      
      for (let f = 0; f < flockSize; f++) {
        const startX = -100 - (f * 120); // Faster staggered entry
        const startY = screenH * 0.5 - (f * 60) + (Math.random() * 120);
        const chars = ["风", "急", "天", "高", "飞", "鸟", "回", "清", "沙", "白", "无", "边"];
        
        for (let i = 0; i < 8; i++) {
          particlesRef.current.push({
            id: Math.random(),
            x: startX - (i * 35),
            y: startY + (Math.sin(i * 0.8) * 25),
            vx: 12.5 + Math.random() * 4, // extremely fast horizontal sweeping speed
            vy: -1.5, // slight rising speed
            size: 24 + Math.random() * 8, // larger birds
            char: chars[Math.floor(Math.random() * chars.length)],
            life: 300,
            maxLife: 300,
            color: "rgba(180, 210, 230, 0.9)",
            type: "bird",
            wingPhase: Math.random() * Math.PI * 2, // wing waving state
            originalX: i * 25 // wing offsets
          });
        }
      }
    }

    // Transition to dialogue screen after sequence is halfway complete
    setTimeout(() => {
      setGameState("DIALOGUE");
      
      // Keep safety lock active for typewriter calligraphy length to prevent accidental dismissal during animation
      const animTypeTime = Math.max(300, (poet.text.length || 20) * 10 + 200);
      setTimeout(() => {
        triggerDialogueLock(false);
      }, animTypeTime);
    }, 200);
  };
  
  // Dialogue transitions: Exit cascade / farewell
  const executeCloseDialogue = (isImmediate: boolean = false) => {
    if (dialogueLockRef.current) return; // Prevent premature closes
    if ((stateRef.current !== "DIALOGUE" && stateRef.current !== "CURTAIN") || poetBodyRef.current.fadeOutStage) {
      return;
    }
    
    poetBodyRef.current.fadeOutStage = true;
    
    // Unified interactive scroll timeline initialization for ALL poets:
    poetBodyRef.current.lqPoetHidden = true;
    poetBodyRef.current.lqSequence = "unfold";
    poetBodyRef.current.lqUnfoldRatio = 0.0;
    poetBodyRef.current.scrollTextProgress = 0.0;
    poetBodyRef.current.lingerFrames = 400; // Large linger frames bank since we pause indefinitely!

    if (activePoetRef.current?.name === "李清照") {
      const birdsList = [];
      const numBirds = 3 + Math.floor(Math.random() * 2); // 3 to 4 birds is perfect to keep the composition elegant and clean
      for (let i = 0; i < numBirds; i++) {
        birdsList.push({
          x: 350 + i * 55 + Math.random() * 30, // staggered start from bottom-right (X near 350 to 500)
          y: 200 + Math.random() * 60, // bottom-right water level (Y near 200 to 260)
          vx: -1.3 - Math.random() * 0.5, // moving slowly and gracefully to the left
          vy: -0.4 - Math.random() * 0.4, // moving upwards
          scale: 0.45 + Math.random() * 0.35, // realistic gull sizes (scale relative to scroll factor s)
          wingAngle: Math.random() * Math.PI * 2,
          isFlappingUp: Math.random() > 0.5,
          speed: 0.05 + Math.random() * 0.04
        });
      }
      poetBodyRef.current.lqBirds = birdsList;
    }
    
    setGameState("WARPING"); // Change state instantly to block duplicate triggers
    
    // Clear curtain and all other text particles, keeping only inkDust, meteor and star trails to let the poet dissolve cleanly
    particlesRef.current = particlesRef.current.filter(p => p.type === "meteor" || p.type === "starTrail" || p.type === "inkDust");
  };

  // Main animation frame handler
  useEffect(() => {
    let animFrameId: number;
    
    const tick = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animFrameId = requestAnimationFrame(tick);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animFrameId = requestAnimationFrame(tick);
        return;
      }

      const cw = canvas.width;
      const ch = canvas.height;

      // Ensure state parameters are fully accessible inside the closure
      const currentGState = stateRef.current;

      // 1. Draw elegant dark-horizon ink gradient
      const bgGrad = ctx.createRadialGradient(
        cw / 2, ch / 2, 8, 
        cw / 2, ch / 2, Math.max(cw, ch)
      );
      bgGrad.addColorStop(0, '#060515'); // Soft stellar indigo
      bgGrad.addColorStop(0.5, '#020208'); // Charcoal ink
      bgGrad.addColorStop(1, '#000000'); // Perfect void outer margins
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, cw, ch);

      // 2. Render drifting, breathing nebulae
      nebulasRef.current.forEach(neb => {
        neb.angle += neb.speed;
        const driftX = Math.cos(neb.angle) * 30;
        const driftY = Math.sin(neb.angle) * 30;

        ctx.save();
        ctx.beginPath();
        const nebGrad = ctx.createRadialGradient(
          neb.x + driftX, neb.y + driftY, 5,
          neb.x + driftX, neb.y + driftY, neb.radius
        );
        nebGrad.addColorStop(0, neb.color);
        nebGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = nebGrad;
        ctx.arc(neb.x + driftX, neb.y + driftY, neb.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Spontaneous shooting stars in deep background space
      if (Math.random() < 0.015) {
        particlesRef.current.push({
          id: Math.random(),
          x: Math.random() * cw * 0.8,
          y: Math.random() * ch * 0.3,
          vx: 8 + Math.random() * 8,
          vy: 2 + Math.random() * 3,
          size: 1.5 + Math.random() * 2,
          char: "✦",
          life: 40,
          maxLife: 40,
          color: "rgba(255, 255, 255, 0.75)",
          type: "starTrail"
        });
      }

      // 3. Constellations lines connecting the poet stars
      const poetsStars = starsRef.current.filter(s => s.isPoet);
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < poetsStars.length - 1; i++) {
        const s1 = poetsStars[i];
        const s2 = poetsStars[i + 1];
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
      }
      ctx.strokeStyle = "rgba(201, 160, 99, 0.12)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 8]);
      ctx.stroke();
      ctx.restore();

      // Constellation linkage to tracking cursor
      if (currentGState === "TRAVEL") {
        ctx.save();
        poetsStars.forEach(poetStar => {
          const dist = Math.hypot(meteorRef.current.x - poetStar.x, meteorRef.current.y - poetStar.y);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(meteorRef.current.x, meteorRef.current.y);
            ctx.lineTo(poetStar.x, poetStar.y);
            ctx.strokeStyle = `rgba(229, 203, 159, ${(1 - dist/180) * 0.25})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        });
        ctx.restore();
      }

      // Speed warp space flight visualizer
      let isWarping = isWarpingRef.current;
      let warpSpeed = warpSpeedRef.current;

      if (isWarping) {
        warpSpeedRef.current += 1.8;
        if (warpSpeedRef.current > 32) {
          isWarpingRef.current = false;
          setGameState("TRAVEL");
          warpSpeedRef.current = 1;
          
          let pIndex = 0;
          starsRef.current.forEach((star) => {
            if (star.isPoet) {
              // Position poet stars strictly and evenly across the middle-to-lower section, slightly shifted up
              const segmentW = (cw * 0.76) / POETS.length;
              const x = cw * 0.12 + segmentW * pIndex + Math.random() * (segmentW * 0.4);
              const y = ch * 0.46 + Math.random() * (ch * 0.20);

              star.x = x;
              star.y = y;
              pIndex++;
            }
          });

          meteorRef.current.x = cw / 2;
          meteorRef.current.y = ch * 0.88; // Positioned lower on the screen to avoid any accidental start touch
          meteorRef.current.targetX = cw / 2;
          meteorRef.current.targetY = ch * 0.88;
          meteorRef.current.vx = 0;
          meteorRef.current.vy = 0;

          setTravelCooldown(true);
          setTimeout(() => {
            setTravelCooldown(false);
          }, 700);
        }
      }

      // 4. Draw stars and poets (Star design transformed into highly romantic sparkles)
      starsRef.current.forEach((star) => {
        if (star.isPoet) {
          // Dynamic scrolling when shifting state/space
          if (isWarping) {
            star.x -= warpSpeedRef.current * 1.8;
            if (star.x < -80) star.x = cw + Math.random() * 200;
          } else if (currentGState === "TRAVEL") {
            const factor = meteorRef.current.vx * 0.015;
            star.x -= factor * 0.25;
            if (star.x < -40) star.x = cw + 40;
            if (star.x > cw + 40) star.x = -40;

            // Deflect poet stars so they never drift or linger behind/underneath the floating prompt scroll
            const minX = cw / 2 - 320;
            const maxX = cw / 2 + 320;
            const minY = ch * 0.12;
            const maxY = ch * 0.44;
            if (star.x > minX && star.x < maxX && star.y > minY && star.y < maxY) {
              const yCenter = (minY + maxY) / 2;
              if (star.y < yCenter) {
                star.y -= 2.2;
                if (star.y < 50) star.y = 50;
              } else {
                star.y += 2.2;
                if (star.y > ch - 120) star.y = ch - 120;
              }
            }
          }

          if (star.pulse !== undefined) {
            star.pulse += 0.045;
            const sizeFactor = Math.sin(star.pulse);
            const name = star.poetData ? star.poetData.name : "星宿";

            // Calculate dynamic scaling based on proximity to the player's meteor/cursor
            let starExtraScale = 1.0;
            if (currentGState === "TRAVEL" && !isWarping) {
              const distanceToMeteor = Math.hypot(meteorRef.current.x - star.x, meteorRef.current.y - star.y);
              if (distanceToMeteor < 180) {
                const t = 1 - (distanceToMeteor / 180);
                // Quadratic curve for a more satisfying and explosive physical feel near the center
                starExtraScale = 1.0 + Math.pow(t, 1.8) * 1.5; 
              }
            }

            drawShiningStar(ctx, star.x, star.y, star.radius, sizeFactor, name, starExtraScale);

            // Collide detect of tracking cursor to trigger poet detail (triggers when player star touches the poet's glow range)
            if (currentGState === "TRAVEL" && !isWarping && !travelCooldownRef.current) {
              const distance = Math.hypot(meteorRef.current.x - star.x, meteorRef.current.y - star.y);
              const dynamicGlowRadius = star.radius * starExtraScale * (3.8 + sizeFactor * 1.6);
              if (distance < dynamicGlowRadius) {
                if (star.poetData) triggerPoetCard(star.poetData, star.x, star.y);
              }
            }
          }
        } 
        else {
          // Standard background stars
          // Twinkle alpha dynamically centered on asynchronous offset sine wave
          star.alpha = 0.15 + Math.sin(Date.now() * 0.001 * star.speed * 8 + star.offset) * 0.55;

          if (currentGState === "TRAVEL" || isWarping) {
            const factor = isWarping ? warpSpeedRef.current : meteorRef.current.vx * 0.02;
            star.x -= factor * star.depth;
            if (star.x < 0) star.x = cw;
            if (star.x > cw) star.x = 0;
          }

          ctx.beginPath();
          if (isWarping) {
            // Streaming space flight tail
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star.x + warpSpeedRef.current * star.depth * 3.5, star.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${star.alpha * 0.45})`;
            ctx.lineWidth = star.radius;
            ctx.stroke();
          } else {
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * 0.75})`;
            ctx.fill();
          }
        }
      });

      // 5. Update and Draw interactive cursor (Meteor)
      if (currentGState === "TRAVEL" && !isWarping) {
        const meteor = meteorRef.current;
        meteor.vx += (meteor.targetX - meteor.x) * 0.04;
        meteor.vy += (meteor.targetY - meteor.y) * 0.04;
        meteor.vx *= 0.82;
        meteor.vy *= 0.82;
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;

        // Continuous tail particles emitter
        if (Math.random() < 0.75) {
          particlesRef.current.push({
            id: Math.random(),
            x: meteor.x,
            y: meteor.y,
            vx: -meteor.vx * 0.15 + (Math.random() - 0.5) * 1.5,
            vy: -meteor.vy * 0.15 + (Math.random() - 0.5) * 1.5,
            size: Math.random() * 4.5 + 1.5,
            char: "✧",
            life: 25,
            maxLife: 25,
            color: "rgba(180, 220, 255, 0.8)",
            type: "meteor"
          });
        }

        // Calculate dynamic scaling for the meteor based on proximity to any poet star
        let meteorExtraScale = 1.0;
        const poetsStarsList = starsRef.current.filter(s => s.isPoet);
        let minStarDist = 999999;
        poetsStarsList.forEach(poetStar => {
          const d = Math.hypot(meteor.x - poetStar.x, meteor.y - poetStar.y);
          if (d < minStarDist) {
            minStarDist = d;
          }
        });
        if (minStarDist < 180) {
          const t = 1 - (minStarDist / 180);
          meteorExtraScale = 1.0 + Math.pow(t, 1.8) * 1.5; // beautiful scaling matching the star expansion
        }

        // Render main meteor sparkle element
        ctx.save();
        const baseR = (8 + Math.sin(Date.now() * 0.008) * 1.5) * meteorExtraScale;
        const radialGlow = ctx.createRadialGradient(meteor.x, meteor.y, 1, meteor.x, meteor.y, baseR * 3);
        radialGlow.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        radialGlow.addColorStop(0.4, 'rgba(201, 160, 99, 0.4)');
        radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radialGlow;
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, baseR * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, baseR * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#c9a063';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      }

      // 6. Spawn/Animate custom poet entry structures!
      if (activePoet) {
        const poet = activePoet;

        // Continuous generators during active sequences (Curtain or Dialogue)
        if (poet.name === "李白" && (currentGState === "CURTAIN" || currentGState === "DIALOGUE")) {
          // Continuously spawn cascading waterfall letters
          if (Math.random() < 0.35) {
            particlesRef.current.push({
              id: Math.random(),
              x: cw / 2 + (Math.random() - 0.5) * 180,
              y: -20,
              vx: (Math.random() - 0.5) * 1.2,
              vy: 7 + Math.random() * 5,
              size: 16 + Math.random() * 10,
              char: poet.curtains[Math.floor(Math.random() * poet.curtains.length)],
              life: 140,
              maxLife: 140,
              color: "rgba(240, 245, 255, 0.85)",
              type: "waterfall"
            });
          }
        }
        else if (poet.name === "李清照" && (currentGState === "CURTAIN" || currentGState === "DIALOGUE")) {
          // Keep water drifting, occasionally spawn new floating river letters to left side
          if (Math.random() < 0.1) {
            particlesRef.current.push({
              id: Math.random(),
              x: -30,
              y: ch * 0.72 + Math.sin(Date.now() * 0.002) * 20,
              vx: 1.4, // float rightwards
              vy: 0,
              size: 22 + Math.random() * 10,
              char: poet.curtains[Math.floor(Math.random() * poet.curtains.length)],
              life: 220,
              maxLife: 220,
              color: "rgba(180, 160, 230, 0.68)",
              type: "river",
              angle: Math.random() * Math.PI
            });
          }
        }
      }

      // Evaluate and render individual active particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.life--;

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        // Apply custom movement equations based on particle types
        if (p.type === "starTrail") {
          p.x += p.vx;
          p.y += p.vy;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.life / p.maxLife})`;
          ctx.fill();
        } 
        else if (p.type === "meteor") {
          p.x += p.vx;
          p.y += p.vy;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } 
        else if (p.type === "waterfall") {
          // Waterfall tumbling downward
          p.x += p.vx;
          p.y += p.vy;

          // Hit imaginary pedestal limit (let's hit at ch * 0.48 where the poet's feet/boat roughly is)
          const hitHeight = ch * 0.65;
          if (p.y >= hitHeight) {
            
            // Spawn 2-4 word splashes
            const splashCount = 2 + Math.floor(Math.random() * 2);
            for (let s = 0; s < splashCount; s++) {
              particlesRef.current.push({
                id: Math.random(),
                x: p.x,
                y: hitHeight,
                vx: (Math.random() - 0.5) * 6,
                vy: -3 - Math.random() * 5,
                size: p.size * 0.6,
                char: activePoet?.curtains[Math.floor(Math.random() * activePoet.curtains.length)] || "水",
                life: 35,
                maxLife: 35,
                color: "rgba(180, 215, 255, 0.9)",
                type: "splash"
              });
            }

            // Loop and recycle the particle back to top
            if ((currentGState === "CURTAIN" || currentGState === "DIALOGUE") && !poetBodyRef.current.fadeOutStage) {
              p.y = -100 - Math.random() * 200;
              p.x = cw / 2 + (Math.random() - 0.5) * 80;
            } else {
              p.life = 0; // Let it die
            }
          } else {
            // Draw plunging poetry characters
            ctx.save();
            ctx.fillStyle = `rgba(240, 246, 255, ${Math.min(1, p.life / 20) * 0.8})`;
            ctx.font = `bold ${p.size}px serif`;
            ctx.shadowColor = "rgba(120, 180, 255, 0.5)";
            ctx.shadowBlur = 6;
            ctx.fillText(p.char, p.x, p.y);
            ctx.restore();
          }
        } 
        else if (p.type === "splash") {
          // Bounce splashes of waterfall characters
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.25; // gravity pull

          ctx.save();
          ctx.fillStyle = `rgba(200, 225, 255, ${p.life / p.maxLife})`;
          ctx.font = `bold ${p.size}px serif`;
          ctx.fillText(p.char, p.x, p.y);
          ctx.restore();
        } 
        else if (p.type === "curtain") {
          // 辛弃疾: Text curtains pulling open
          if (currentGState === "CURTAIN" || currentGState === "DIALOGUE" || currentGState === "WARPING" || poetBodyRef.current.fadeOutStage) {
            // Pull horizontal vectors based on side
            if (p.originalX !== undefined) {
              // start pulling after life < 150 (since maxLife is 200, gives a sub-second delay)
              if (p.life < 150 || currentGState === "DIALOGUE") {
                const targetSideW = p.side === "left" ? -150 : cw + 150;
                p.x += (targetSideW - p.x) * 0.12; // smooth pull open
                p.y += (ch * 0.5 - p.y) * 0.005; // converge slightly vertically
              }
            }
          }
          
          ctx.save();
          ctx.fillStyle = `rgba(240, 180, 180, ${Math.min(1, p.life / 15) * 0.85})`;
          ctx.font = `bold ${p.size}px serif`;
          ctx.shadowColor = "rgba(120, 20, 20, 0.4)";
          ctx.shadowBlur = 4;
          ctx.fillText(p.char, p.x, p.y);
          ctx.restore();
        }
        else if (p.type === "orbit") {
          // 苏轼: Galaxies of orbits rotating around center
          const cx = cw / 2;
          const cy = ch * 0.55;

          if (p.angle !== undefined && p.vy !== undefined && p.vx !== undefined) {
            // Increments phase angle
            p.angle += p.vx * 1.2; // vx stores angular velocity
            
            if (p.targetRadius !== undefined) {
              // Animate radius towards target
              p.vy += (p.targetRadius - p.vy) * 0.12;
            }

            // Gently compress/breathe orbital radius values over time
            let currentRadius = p.vy;
            if (currentGState === "DIALOGUE") {
              // Expand spirally outward or condense elegantly
              p.vy += Math.sin(Date.now() * 0.001) * 0.35;
            } else if (currentGState === "WARPING" || poetBodyRef.current.fadeOutStage) {
              // Expand orbits outwards rapidly during departures
              p.vy += 22.0;
            }

            p.x = cx + Math.cos(p.angle) * currentRadius;
            p.y = cy + Math.sin(p.angle) * currentRadius;
          }

          ctx.save();
          ctx.fillStyle = `rgba(235, 215, 185, ${Math.min(1, p.life / 15) * 0.75})`;
          ctx.font = `bold ${p.size}px serif`;
          ctx.fillText(p.char, p.x, p.y);
          ctx.restore();
        }
        else if (p.type === "rain") {
          // 李清照: Full screen rain
          p.x += p.vx;
          p.y += p.vy;

          if (p.y > ch + 40 && !poetBodyRef.current.fadeOutStage) {
            p.y = -40 - Math.random() * 200;
            p.x = Math.random() * cw;
            p.life = p.maxLife; // keep raining
          }

          ctx.save();
          ctx.fillStyle = p.color;
          ctx.font = `${p.size}px serif`;
          ctx.fillText(p.char, p.x, p.y);
          ctx.restore();
          
          if (currentGState === "WARPING" || poetBodyRef.current.fadeOutStage) {
            p.life -= 8; // Disappear when leaving
          } else {
            p.life = Math.max(p.life, 50); // persistent during dialogue
          }
        }
        else if (p.type === "bird") {
          // 杜甫: Character bird flight physics
          p.x += p.vx;
          p.y += p.vy;

          if (p.wingPhase !== undefined) {
            p.wingPhase += 0.18;
            // Wing beat offset modifying vector height slightly
            p.y += Math.sin(p.wingPhase) * 1.5;
          }

          ctx.save();
          ctx.fillStyle = `rgba(180, 210, 230, ${Math.min(1, p.life / 20) * 0.9})`;
          ctx.font = `bold ${p.size}px serif`;
          ctx.fillText(p.char, p.x, p.y);
          ctx.restore();

          // Continuous feathers / ink dust trails
          if (Math.random() < 0.15) {
            particlesRef.current.push({
              id: Math.random(),
              x: p.x,
              y: p.y,
              vx: (Math.random() - 0.5) * 1,
              vy: Math.random() * 0.5,
              size: p.size * 0.4,
              char: "·",
              life: 30,
              maxLife: 30,
              color: "rgba(168, 195, 215, 0.5)",
              type: "inkDust"
            });
          }
        }
        else if (p.type === "inkDust") {
          // Drifting ink particles
          p.x += p.vx;
          p.y += p.vy;
          const ratio = p.life / p.maxLife;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * ratio, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(201, 160, 99, ${ratio * 0.7})`;
          ctx.fill();
        }
      }

      // Draw specialized Canopy Boat (蓬船) for 李清照
      if (activePoet && activePoet.name === "李清照" && (currentGState === "CURTAIN" || currentGState === "DIALOGUE" || currentGState === "WARPING" || poetBodyRef.current.fadeOutStage)) {
        ctx.save();
        
        const poetBody = poetBodyRef.current;
        const s = Math.max(0.1, poetBody.scale);
        
        // Use poet's current X and Y for the boat
        const boatX = poetBody.x;
        const boatY = poetBody.y + 115 * s + Math.sin(Date.now() * 0.001) * 3 * s;

        ctx.globalAlpha = poetBody.lqPoetHidden ? 0.0 : Math.max(0, Math.min(1, poetBody.alpha));

        ctx.strokeStyle = "rgba(201, 160, 99, 0.7)";
        ctx.lineWidth = 3;
        ctx.fillStyle = "rgba(15, 12, 22, 0.92)";
        
        // Draw elegant vector canopy boat
        ctx.beginPath();
        ctx.moveTo(boatX - 80, boatY);
        ctx.quadraticCurveTo(boatX, boatY + 22, boatX + 80, boatY); // hull bottom
        ctx.lineTo(boatX + 50, boatY - 10);
        
        // Cabin hood curve
        ctx.quadraticCurveTo(boatX, boatY - 26, boatX - 55, boatY - 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Little lantern swinging in wind
        const latX = boatX + 45;
        const latY = boatY - 6;
        const swing = Math.sin(Date.now() * 0.0015) * 6;
        ctx.beginPath();
        ctx.moveTo(latX, latY);
        ctx.lineTo(latX + swing, latY + 15);
        ctx.strokeStyle = "rgba(229, 203, 159, 0.8)";
        ctx.lineWidth = 2.0;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(latX + swing, latY + 19, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(229, 203, 159, 0.9)";
        ctx.shadowColor = "#ffe39f";
        ctx.shadowBlur = 8;
        ctx.fill();

        ctx.restore();
      }

      // 7. Render dynamic Silhouette for active Poet ("updateAndDrawInkPoet")
      if ((currentGState === "CURTAIN" || currentGState === "DIALOGUE" || currentGState === "WARPING" || poetBodyRef.current.fadeOutStage) && activePoet) {
        const poetBody = poetBodyRef.current;
        poetBody.animTime += 0.025;

        if (poetBody.fadeOutStage) {
          if (poetBody.lingerFrames !== undefined && poetBody.lingerFrames > 0) {
            poetBody.lingerFrames--;
            
            // Unified scroll interactive timeline for ALL poets:
            if (poetBody.lqSequence === "unfold") {
              poetBody.lqUnfoldRatio = Math.min(1.0, (poetBody.lqUnfoldRatio || 0) + 0.04);
              
              // Keep targetScale constant at 1.0 during active scroll unfolding/unrolling!
              poetBody.targetScale = 1.0;
              
              if (poetBody.lqUnfoldRatio >= 1.0) {
                poetBody.lqSequence = "zoom";
                poetBody.lqZoomRatio = 0.0;
              }
            } else if (poetBody.lqSequence === "zoom") {
              poetBody.lqZoomRatio = Math.min(1.0, (poetBody.lqZoomRatio || 0) + 0.035);
              
              // Scale up dynamically to fill the screen
              const fullScreenScale = Math.max(cw / 460, ch / 280) * 1.03;
              // Transition targetScale towards fully filling the screen
              poetBody.targetScale = 1.0 + (fullScreenScale - 1.0) * poetBody.lqZoomRatio;
              
              if (poetBody.lqZoomRatio >= 1.0) {
                poetBody.lqSequence = "pause";
                poetBody.scrollTextProgress = 0.0; // Reset text reveal progress
              }
            } else if (poetBody.lqSequence === "pause") {
              // Stay in "pause" indefinitely until user clenches fist (再握拳) or clicks!
              // Prevent count-down of lingerFrames to keep the scroll on-screen
              poetBody.lingerFrames = Math.max(poetBody.lingerFrames, 200);
              
              // Typewriter text printing progress reveals characters one by one
              const POET_CALLIGRAPHY: Record<string, string[]> = {
                "李白": ["君不见黄河之水天上来", "奔流到海不复回"],
                "杜甫": ["安得广厦千万间", "大庇天下寒士俱欢颜"],
                "苏轼": ["江上清风与山间明月", "本无常主闲者便是主人"],
                "李清照": ["争渡争渡", "惊起一滩鸥鹭"],
                "辛弃疾": ["金戈铁马", "气吞万里如虎"],
              };
              const lines = POET_CALLIGRAPHY[activePoet.name] || [];
              const totalChars = lines.reduce((acc, line) => acc + line.length, 0);

              poetBody.scrollTextProgress = Math.min(
                totalChars + 6, // extra count budget to fade in the Cinnabar Red seal stamp fully
                (poetBody.scrollTextProgress || 0) + 0.18 // ~1 character every 5-6 frames
              );
            } else if (poetBody.lqSequence === "fold_close") {
              // "再次握拳卷轴闭合，缩，消失"
              // Instantly clip the huge duration buffer of lingerFrames to expedite state resolution
              if (poetBody.lingerFrames > 12) {
                poetBody.lingerFrames = 12;
              }
              // fold close: unrolls back to 0 (accelerated significantly)
              poetBody.lqUnfoldRatio = Math.max(0.0, (poetBody.lqUnfoldRatio || 0) - 0.16);
              // shrink: targetScale shrinks rapidly to 0
              poetBody.targetScale = Math.max(0.0, poetBody.targetScale - 0.16);
              // fadeout: alpha dissolves to 0
              poetBody.alpha = Math.max(0.0, poetBody.alpha - 0.18);
              
              // Spume a few pretty ink starbursts as it vanishes!
              if (Math.random() < 0.4) {
                particlesRef.current.push({
                  id: Math.random(),
                  x: poetBody.x + (Math.random() - 0.5) * 80 * poetBody.scale,
                  y: poetBody.y + (Math.random() - 0.5) * 80 * poetBody.scale,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4 - 1,
                  size: Math.random() * 3 + 1,
                  char: "·",
                  life: 40,
                  maxLife: 40,
                  color: "rgba(229, 203, 159, 0.65)",
                  type: "inkDust"
                });
              }

              if (poetBody.alpha < 0.05 || poetBody.lqUnfoldRatio <= 0.01) {
                poetBody.lingerFrames = 0; // terminates the animation loop
              }
            }
            
            // Unify poet dissolving animation (let silhouette dissolve instantly when scroll begins)
            if (poetBody.innerPoetScale === undefined) poetBody.innerPoetScale = 1.0;
            if (poetBody.innerPoetAlpha === undefined) poetBody.innerPoetAlpha = 1.0;
            poetBody.innerPoetScale += (0.01 - poetBody.innerPoetScale) * 0.18;
            poetBody.innerPoetAlpha += (0.0 - poetBody.innerPoetAlpha) * 0.18;

            // Center position and scale up smoothly
            poetBody.targetX = cw / 2;
            poetBody.x += (poetBody.targetX - poetBody.x) * 0.15;
            poetBody.y += ((ch / 2 + 35 * poetBody.scale) - poetBody.y) * 0.15;
            const easeFactor = poetBody.lqSequence === "fold_close" ? 0.38 : 0.12;
            poetBody.scale += (poetBody.targetScale - poetBody.scale) * easeFactor;
          } else {
            poetBody.alpha = 0;
          }

          // Spawn swirling ink dust representation
          if (activePoet.name !== "李清照") {
            if (Math.random() < 0.15) { // reduced rate slightly to avoid distracting from vertical scroll calligraphy
              particlesRef.current.push({
                id: Math.random(),
                x: poetBody.x + (Math.random() - 0.5) * 150 * poetBody.scale,
                y: poetBody.y + (Math.random() - 0.5) * 200 * poetBody.scale,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                size: Math.random() * 4 + 1.5,
                char: "·",
                life: 50,
                maxLife: 50,
                color: "rgba(201, 160, 99, 0.45)",
                type: "inkDust"
              });
            }
          }

          // Complete closing boundary transitions safely
          if ((poetBody.lingerFrames === undefined || poetBody.lingerFrames <= 0) && (poetBody.alpha < 0.05 || poetBody.scale < 0.1)) {
            poetBody.fadeOutStage = false;
            isWarpingRef.current = true;
            warpSpeedRef.current = 1;
            setGameState("WARPING");
            
            // Defer active poet clean closure to guarantee zero null renders
            setTimeout(() => {
              setActivePoet(null);
            }, 60);
          }
        } else {
          // Keep invisible during CURTAIN phase, fade in during DIALOGUE!
          const targetAlpha = currentGState === "DIALOGUE" ? 1.0 : 0.0;
          poetBody.scale += (poetBody.targetScale - poetBody.scale) * 0.25;
          poetBody.alpha += (targetAlpha - poetBody.alpha) * 0.25;
          poetBody.innerPoetScale = 1.0;
          poetBody.innerPoetAlpha = 1.0;
        }

        // Safe vector-drawing shield
        if (activePoet) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, Math.min(1, poetBody.alpha));
          const breathing = Math.sin(poetBody.animTime) * 4.5;
          
          if (!poetBody.fadeOutStage && currentGState !== "WARPING") {
            poetBody.targetX = cw / 2;
            if (activePoet.name === "李清照") {
               poetBody.x += (poetBody.targetX - poetBody.x) * 0.025;
               poetBody.y = ch * 0.42;
            } else {
               poetBody.x = cw / 2;
               poetBody.y = ch * 0.38;
            }
          }
          
          const pX = poetBody.x;
          const pY = poetBody.y + (activePoet.name === "李清照" ? Math.sin(Date.now() * 0.001) * 3 : 0);
          const s = poetBody.scale;
          let lAlpha = 0.0;
          if (poetBody.fadeOutStage) {
            if (poetBody.lqSequence === "unfold" || poetBody.lqSequence === "zoom" || poetBody.lqSequence === "pause") {
              lAlpha = poetBody.lqUnfoldRatio !== undefined ? poetBody.lqUnfoldRatio : 1.0;
            } else if (poetBody.lqSequence === "fold_close" || poetBody.lqSequence === "fade") {
              lAlpha = poetBody.lqUnfoldRatio !== undefined ? poetBody.lqUnfoldRatio : 0.0;
            }
          } else {
            lAlpha = 0.0; // Hide scroll background behind the silhouette during normal dialogue
          }

          const currentPoetImg = landscapeImagesRef.current[activePoet.name];
          if (currentPoetImg && lAlpha > 0.01) {
            ctx.save();
            let isCustomRun = (poetBody.lqSequence !== "fold_close" && poetBody.lqSequence !== "fade");
            ctx.globalAlpha = isCustomRun 
              ? 1.0 
              : lAlpha * Math.max(0, Math.min(1.0, poetBody.alpha));

            const imgW = 460 * s;
            const imgH = 280 * s;

            // Compute dynamic width for unfolding effect
            const currentImgW = imgW * lAlpha;

            const imgX = pX - imgW / 2;
            const imgY = pY - imgH / 2 - 35 * s;

            const bx = pX - currentImgW / 2 - 16 * s;
            const by = imgY - 16 * s;
            const bw = currentImgW + 32 * s;
            const bh = imgH + 32 * s;

            // Outer backing scroll parchment
            ctx.shadowColor = "rgba(229, 203, 159, 0.35)";
            ctx.shadowBlur = 30 * s;
            
            ctx.fillStyle = "rgba(10, 8, 14, 0.94)"; // Dark charcoal silk background
            ctx.strokeStyle = "rgba(229, 203, 159, 0.45)";
            ctx.lineWidth = 2.5 * s;

            ctx.beginPath();
            ctx.rect(bx, by, bw, bh);
            ctx.fill();
            ctx.stroke();

            // Inner gold frame line
            ctx.strokeStyle = "rgba(229, 203, 159, 0.75)";
            ctx.lineWidth = 1 * s;
            ctx.strokeRect(pX - currentImgW / 2 - 6 * s, imgY - 6 * s, currentImgW + 12 * s, imgH + 12 * s);
            
            // Classical scroll Left & Right handles (wood knobs)
            ctx.fillStyle = "rgba(120, 95, 65, 0.95)";
            ctx.strokeStyle = "rgba(229, 203, 159, 0.45)";
            ctx.lineWidth = 1 * s;
            // Left handle
            ctx.fillRect(bx - 6 * s, by - 4 * s, 6 * s, bh + 8 * s);
            ctx.strokeRect(bx - 6 * s, by - 4 * s, 6 * s, bh + 8 * s);
            // Right handle
            ctx.fillRect(bx + bw, by - 4 * s, 6 * s, bh + 8 * s);
            ctx.strokeRect(bx + bw, by - 4 * s, 6 * s, bh + 8 * s);

            // Clip context to only show all inner components within the unrolled area
            ctx.save();
            ctx.beginPath();
            ctx.rect(pX - currentImgW / 2, imgY, currentImgW, imgH);
            ctx.clip();

            // Draw landscape image
            ctx.drawImage(currentPoetImg, imgX, imgY, imgW, imgH);

            // Overlay soft radial ink-mist mask
            const imgRadialGrad = ctx.createRadialGradient(
              pX, pY - 35 * s, 80 * s,
              pX, pY - 35 * s, imgW * 0.55
            );
            imgRadialGrad.addColorStop(0, "rgba(6, 5, 21, 0.0)");
            imgRadialGrad.addColorStop(0.65, "rgba(6, 5, 21, 0.2)");
            imgRadialGrad.addColorStop(1, "rgba(6, 5, 21, 0.9)");
            ctx.fillStyle = imgRadialGrad;
            ctx.fillRect(imgX, imgY, imgW, imgH);

            // --- Elegant ink-wash waterfall and river animation for Li Bai ---
            if (activePoet.name === "李白") {
              ctx.save();
              
              // 1. Draw Waterfall Filaments (瀑布流莹 - multiple vertical water flow channels on the mountain clefts)
              const channels = [
                { baseX: 60, speedMult: 1.05, widthMult: 1.1, baseOpacity: 0.38 },
                { baseX: 70, speedMult: 1.25, widthMult: 0.9, baseOpacity: 0.44 },
                { baseX: 77, speedMult: 1.15, widthMult: 1.2, baseOpacity: 0.35 },
                { baseX: 85, speedMult: 0.95, widthMult: 0.8, baseOpacity: 0.48 }
              ];
              
              channels.forEach((chan) => {
                const flowTime = Date.now() * 0.004 * chan.speedMult;
                
                // Draw Base Shimmering Stream
                ctx.beginPath();
                for (let y = 105; y <= 204; y += 3) {
                  const wAngle = (y * 0.12) - flowTime;
                  const xOffset = Math.sin(y * 0.06) * 1.6 + Math.sin(wAngle) * 0.85;
                  const finalX = chan.baseX + xOffset;
                  
                  const sx = imgX + finalX * s;
                  const sy = imgY + y * s;
                  if (y === 105) ctx.moveTo(sx, sy);
                  else ctx.lineTo(sx, sy);
                }
                ctx.strokeStyle = `rgba(255, 255, 255, ${chan.baseOpacity})`;
                ctx.lineWidth = 1.35 * chan.widthMult * s;
                ctx.stroke();

                // Draw Faster Highlighter Thread
                ctx.beginPath();
                const fastFlowTime = Date.now() * 0.006 * chan.speedMult;
                for (let y = 105; y <= 204; y += 4) {
                  const wAngle = (y * 0.18) - fastFlowTime;
                  const xOffset = Math.sin(y * 0.06) * 1.6 + Math.sin(wAngle) * 0.6;
                  const finalX = chan.baseX + xOffset;
                  
                  const sx = imgX + finalX * s;
                  const sy = imgY + y * s;
                  if (y === 105) ctx.moveTo(sx, sy);
                  else ctx.lineTo(sx, sy);
                }
                ctx.strokeStyle = `rgba(240, 248, 255, ${chan.baseOpacity * 0.65})`;
                ctx.lineWidth = 0.7 * s;
                ctx.stroke();
              });

              // 2. Draw Waterfall Bottom Splashes & Evaporating Mist (叠溪飞雾)
              // This overlay matches the hazy, misty cloud feeling of traditional landscape paintings
              for (let m = 0; m < 7; m++) {
                const mAngle = (Date.now() * 0.0016 + m * (Math.PI / 3.5)) % Math.PI;
                const progress = mAngle / Math.PI; // 0 to 1 loop
                const mx = 56 + m * 6.5 + Math.sin(progress * 4) * 3;
                const my = 208 - progress * 13;
                
                const sx = imgX + mx * s;
                const sy = imgY + my * s;
                const r = (4 + progress * 8.5) * s;
                
                const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
                const alpha = (1.0 - progress) * 0.16;
                grad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.95})`);
                grad.addColorStop(0.45, `rgba(245, 248, 255, ${alpha * 0.6})`);
                grad.addColorStop(1, "rgba(255, 255, 255, 0.0)");
                
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(sx, sy, r, 0, Math.PI * 2);
                ctx.fill();
              }

              // 3. Draw Placid Rapids & Meandering Currents (碧波微澜)
              // Curves flowing along the lower mountain ravines
              const riverFlows = [
                { yStart: 206, yEnd: 218, xStart: 50, xEnd: 135, amp: 2.2, freq: 0.08 },
                { yStart: 212, yEnd: 226, xStart: 55, xEnd: 155, amp: 2.8, freq: 0.06 },
                { yStart: 219, yEnd: 236, xStart: 45, xEnd: 175, amp: 3.4, freq: 0.05 },
                { yStart: 228, yEnd: 244, xStart: 48, xEnd: 185, amp: 2.6, freq: 0.04 },
                { yStart: 238, yEnd: 252, xStart: 58, xEnd: 195, amp: 1.8, freq: 0.05 }
              ];

              riverFlows.forEach((flow, idx) => {
                ctx.beginPath();
                const flowTime = Date.now() * 0.0016 + idx * 1.8;
                const startX = flow.xStart;
                const endX = flow.xEnd;
                
                for (let rx = startX; rx <= endX; rx += 4) {
                  const p = (rx - startX) / (endX - startX);
                  const baseY = flow.yStart + (flow.yEnd - flow.yStart) * p;
                  const rAngle = (rx * flow.freq) - flowTime;
                  const yOffset = Math.sin(rAngle) * flow.amp;
                  const finalY = baseY + yOffset;
                  
                  const sx = imgX + rx * s;
                  const sy = imgY + finalY * s;
                  if (rx === startX) ctx.moveTo(sx, sy);
                  else ctx.lineTo(sx, sy);
                }
                
                // Dynamic undulating strokes aligning with ink contours
                ctx.strokeStyle = `rgba(235, 243, 255, ${0.14 + Math.sin(Date.now() * 0.0014 + idx) * 0.05})`;
                ctx.lineWidth = 1.3 * s;
                ctx.stroke();
                
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.26 + Math.sin(Date.now() * 0.0012 - idx) * 0.07})`;
                ctx.lineWidth = 0.6 * s;
                ctx.stroke();
              });

              ctx.restore();
            }

            // --- Elegant realistic white hand-drawn gulls (鸥鸟) for Li Qingzhao ---
            if (activePoet.name === "李清照" && poetBody.lqBirds) {
              poetBody.lqBirds.forEach((bird) => {
                // Update coordinates slowly for peaceful, gliding flight
                bird.x += bird.vx;
                bird.y += bird.vy;
                bird.wingAngle += bird.speed;
                if (bird.wingAngle > Math.PI * 2) {
                  bird.wingAngle -= Math.PI * 2;
                }

                // Smooth looping: Reset to the water level at the bottom-right
                // before reaching the central portrait (X ~ 230) and vertical scroll text (X < 100)
                if (bird.x < 130 || bird.y < 15) {
                  bird.x = 450 + Math.random() * 60;
                  bird.y = 210 + Math.random() * 55;
                  bird.vx = -1.2 - Math.random() * 0.5;
                  bird.vy = -0.4 - Math.random() * 0.4;
                  bird.scale = 0.45 + Math.random() * 0.35;
                }

                // Render dynamic opacity to completely avoid overlapping text or center portrait
                let opacity = 1.0;
                if (bird.x < 240) {
                  // Gently dissolve before reaching the centered silhouette space (between X=240 and 140)
                  opacity = Math.max(0.0, (bird.x - 140) / 100);
                }
                if (bird.x > 440) {
                  // Fade in gently as it emerges from the right scroll edge
                  opacity *= Math.max(0.0, 1.0 - (bird.x - 440) / 40);
                }
                if (bird.y < 65) {
                  // Dissolve peacefully near the top frame
                  opacity *= Math.max(0.0, (bird.y - 15) / 50);
                }

                if (opacity > 0.02) {
                  // Convert to viewport coordinate frame
                  const bx = imgX + bird.x * s;
                  const by = imgY + bird.y * s;
                  const bs = s * bird.scale;

                  ctx.save();
                  // Apply composite opacity that respects the overall scroll unrolling alpha
                  ctx.globalAlpha = (ctx.globalAlpha || 1.0) * opacity;

                  // Translate and rotate so the gull naturally faces its flight path direction
                  ctx.translate(bx, by);
                  const flightAngle = Math.atan2(bird.vy, bird.vx);
                  ctx.rotate(flightAngle);

                  // 1. Draw solid, polished white body silhouette (gull abdomen and chest)
                  ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
                  ctx.beginPath();
                  ctx.moveTo(-16 * bs, 0); // Tailtip
                  ctx.quadraticCurveTo(-11 * bs, 2.2 * bs, -6 * bs, 2.8 * bs); // Soft tail feather flair
                  ctx.quadraticCurveTo(0 * bs, 3.8 * bs, 7 * bs, 2.2 * bs); // Full sleek chest
                  ctx.quadraticCurveTo(12 * bs, 0 * bs, 16 * bs, -0.6 * bs); // Throat to Head
                  ctx.quadraticCurveTo(10 * bs, -3.2 * bs, 3 * bs, -2.2 * bs); // Back of head
                  ctx.quadraticCurveTo(-4 * bs, -1 * bs, -11 * bs, -0.5 * bs); // Graceful spine back
                  ctx.closePath();
                  ctx.fill();

                  // 2. Realistic Silver-Grey Mantle (背羽 - distinctive red-billed gull feature)
                  ctx.fillStyle = "rgba(206, 211, 222, 0.92)"; // Soft slate grey for classical ink aesthetics
                  ctx.beginPath();
                  ctx.moveTo(-11 * bs, -0.5 * bs);
                  ctx.quadraticCurveTo(-4 * bs, -1 * bs, 3 * bs, -2 * bs);
                  ctx.quadraticCurveTo(0 * bs, 1.5 * bs, -6 * bs, 1.8 * bs);
                  ctx.quadraticCurveTo(-9 * bs, 1.2 * bs, -11 * bs, -0.5 * bs);
                  ctx.closePath();
                  ctx.fill();

                  // Subtle calligraphic graphite outline to enrich drawing detail
                  ctx.strokeStyle = "rgba(45, 41, 51, 0.38)";
                  ctx.lineWidth = 0.55 * bs;
                  ctx.stroke();

                  // 3. Tucked Red Feet (红足 - folded close under the belly during flight)
                  ctx.strokeStyle = "rgba(224, 34, 34, 0.95)";
                  ctx.lineWidth = 0.9 * bs;
                  ctx.beginPath();
                  ctx.moveTo(-6 * bs, 1.8 * bs);
                  ctx.lineTo(-9 * bs, 2.5 * bs); // leg shaft
                  ctx.lineTo(-10.5 * bs, 2.2 * bs); // tucked visual web
                  ctx.stroke();

                  // 4. Vibrant Crimson Beak (红嘴 - sharp, slightly curved seabird gullet beak)
                  ctx.fillStyle = "rgba(224, 34, 34, 0.98)";
                  ctx.beginPath();
                  ctx.moveTo(13 * bs, -1.1 * bs);
                  ctx.quadraticCurveTo(17 * bs, -1.4 * bs, 20.5 * bs, -0.8 * bs); // sharp red tip
                  ctx.quadraticCurveTo(16 * bs, 0.5 * bs, 12 * bs, 0.6 * bs);
                  ctx.closePath();
                  ctx.fill();

                  // 5. Small black eye and the signature Winter Ear Patch (黑斑)
                  // Red-billed gulls have a distinct dark/black circular patch right behind the eyes
                  ctx.fillStyle = "rgba(35, 30, 40, 0.92)";
                  ctx.beginPath();
                  ctx.arc(10.5 * bs, -1.3 * bs, 0.45 * bs, 0, Math.PI * 2); // Eye
                  ctx.fill();

                  ctx.fillStyle = "rgba(45, 41, 51, 0.55)";
                  ctx.beginPath();
                  ctx.arc(7.5 * bs, -1.0 * bs, 0.7 * bs, 0, Math.PI * 2); // Red-billed gull ear spot
                  ctx.fill();

                  // 6. Soft brush belly shadow to present dimensional depth
                  ctx.fillStyle = "rgba(160, 155, 175, 0.28)";
                  ctx.beginPath();
                  ctx.moveTo(-10 * bs, 0.6 * bs);
                  ctx.quadraticCurveTo(-2 * bs, 2.4 * bs, 6 * bs, 1.2 * bs);
                  ctx.quadraticCurveTo(1 * bs, -0.5 * bs, -7 * bs, -0.2 * bs);
                  ctx.closePath();
                  ctx.fill();

                  // --- Realistic Double-Jointed Flapping Motion ---
                  const theta = bird.wingAngle;
                  const wingArc = Math.sin(theta);        // Primary vertical stroke cycle (-1 to 1)
                  const wingBend = Math.cos(theta);       // Secondary drag-reducing flex cycle
                  
                  // Active forward/backward sweeping (X sweeps 4.5bs forward on downstroke)
                  const strokeSweep = wingArc * 2.5;      
                  const tipLag = -wingBend * 1.5;         // Tip lags behind during joint bending

                  // 7. Left Wing (pointing to -Y side, local upper wing)
                  // Shoulder joint at (1*bs, -1*bs)
                  const leftElbowX = (-1.2 + wingArc * 1.0) * bs;
                  const leftElbowY = (-6.5 + wingArc * 1.8) * bs;
                  const leftWristX = (2.2 + strokeSweep + wingBend * 1.2) * bs;
                  const leftWristY = (-15.5 + wingArc * 6.5) * bs;
                  const leftTipX = (-7.5 + strokeSweep + tipLag * 1.8) * bs;
                  const leftTipY = (-27.5 + wingArc * 11.5) * bs;

                  ctx.beginPath();
                  ctx.moveTo(1 * bs, -1 * bs); // Shoulder
                  ctx.quadraticCurveTo(leftElbowX, leftElbowY, leftWristX, leftWristY); // Arm
                  ctx.quadraticCurveTo((leftWristX + leftTipX)/2 - 1.2*bs, (leftWristY + leftTipY)/2 - 1.2*bs, leftTipX, leftTipY); // Primaries
                  ctx.quadraticCurveTo(leftWristX - 3.8 * bs, leftWristY + 2.8 * bs, leftElbowX - 4.8 * bs, leftElbowY + 3.8 * bs); // Trailing Edge
                  ctx.quadraticCurveTo(-4 * bs, -3.2 * bs, 1 * bs, -1 * bs);
                  ctx.closePath();
                  ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
                  ctx.fill();

                  // Soft grey undertone on upper wing secondaries to mimic shading
                  ctx.fillStyle = "rgba(220, 224, 235, 0.72)";
                  ctx.beginPath();
                  ctx.moveTo(0 * bs, -1.2 * bs);
                  ctx.lineTo(leftElbowX, leftElbowY);
                  ctx.lineTo(leftWristX - 2.5 * bs, leftWristY + 1.8 * bs);
                  ctx.lineTo(leftElbowX - 4 * bs, leftElbowY + 3 * bs);
                  ctx.closePath();
                  ctx.fill();

                  ctx.strokeStyle = "rgba(45, 41, 51, 0.35)";
                  ctx.lineWidth = 0.55 * bs;
                  ctx.stroke();

                  // High-realism black wingtips (primary flight tips) with white "Mirrors"
                  ctx.save();
                  ctx.beginPath();
                  ctx.moveTo(leftWristX, leftWristY);
                  ctx.quadraticCurveTo((leftWristX + leftTipX)/2 - 1.2*bs, (leftWristY + leftTipY)/2 - 1.2*bs, leftTipX, leftTipY);
                  ctx.quadraticCurveTo(leftWristX - 3.8 * bs, leftWristY + 2.8 * bs, leftWristX, leftWristY);
                  ctx.closePath();
                  ctx.clip(); // Restrict black tips to the outer primary feathers only
                  
                  ctx.fillStyle = "rgba(24, 22, 26, 0.95)";
                  ctx.beginPath();
                  ctx.arc(leftTipX, leftTipY, 7.5 * bs, 0, Math.PI * 2);
                  ctx.fill();

                  // Distinctive "white mirror" spot on the outermost primaries
                  ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
                  ctx.beginPath();
                  ctx.arc(leftTipX + 1.8 * bs, leftTipY + 1.8 * bs, 1.2 * bs, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.restore();

                  // Left wing feather shaft and secondary details
                  ctx.strokeStyle = "rgba(40, 35, 45, 0.22)";
                  ctx.lineWidth = 0.45 * bs;
                  ctx.beginPath();
                  ctx.moveTo(leftWristX - 1.5 * bs, leftWristY + 1.5 * bs);
                  ctx.lineTo(leftWristX - 4 * bs, leftWristY + 3.5 * bs);
                  ctx.moveTo(leftElbowX - 1.5 * bs, leftElbowY + 1.5 * bs);
                  ctx.lineTo(leftElbowX - 3.5 * bs, leftElbowY + 4 * bs);
                  ctx.stroke();

                  // 8. Right Wing (pointing to +Y side, local lower wing, mirrored)
                  const rightElbowX = (-1.2 + wingArc * 1.0) * bs;
                  const rightElbowY = (6.5 - wingArc * 1.8) * bs;
                  const rightWristX = (2.2 + strokeSweep + wingBend * 1.2) * bs;
                  const rightWristY = (15.5 - wingArc * 6.5) * bs;
                  const rightTipX = -7.5 + strokeSweep + tipLag * 1.8 * bs;
                  const rightTipY = (27.5 - wingArc * 11.5) * bs;

                  ctx.beginPath();
                  ctx.moveTo(1 * bs, 1 * bs); // Shoulder
                  ctx.quadraticCurveTo(rightElbowX, rightElbowY, rightWristX, rightWristY);
                  ctx.quadraticCurveTo((rightWristX + rightTipX)/2 - 1.2*bs, (rightWristY + rightTipY)/2 + 1.2*bs, rightTipX, rightTipY);
                  ctx.quadraticCurveTo(rightWristX - 3.8 * bs, rightWristY - 2.8 * bs, rightElbowX - 4.8 * bs, rightElbowY - 3.8 * bs);
                  ctx.quadraticCurveTo(-4 * bs, 3.2 * bs, 1 * bs, 1 * bs);
                  ctx.closePath();
                  ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
                  ctx.fill();

                  // Soft grey undertone on right wing secondaries
                  ctx.fillStyle = "rgba(220, 224, 235, 0.72)";
                  ctx.beginPath();
                  ctx.moveTo(0 * bs, 1.2 * bs);
                  ctx.lineTo(rightElbowX, rightElbowY);
                  ctx.lineTo(rightWristX - 2.5 * bs, rightWristY - 1.8 * bs);
                  ctx.lineTo(rightElbowX - 4 * bs, rightElbowY - 3 * bs);
                  ctx.closePath();
                  ctx.fill();

                  ctx.strokeStyle = "rgba(45, 41, 51, 0.35)";
                  ctx.lineWidth = 0.55 * bs;
                  ctx.stroke();

                  // Black wingtips with white spots for Right Wing
                  ctx.save();
                  ctx.beginPath();
                  ctx.moveTo(rightWristX, rightWristY);
                  ctx.quadraticCurveTo((rightWristX + rightTipX)/2 - 1.2*bs, (rightWristY + rightTipY)/2 + 1.2*bs, rightTipX, rightTipY);
                  ctx.quadraticCurveTo(rightWristX - 3.8 * bs, rightWristY - 2.8 * bs, rightWristX, rightWristY);
                  ctx.closePath();
                  ctx.clip();
                  
                  ctx.fillStyle = "rgba(24, 22, 26, 0.95)";
                  ctx.beginPath();
                  ctx.arc(rightTipX, rightTipY, 7.5 * bs, 0, Math.PI * 2);
                  ctx.fill();

                  // White mirror spot
                  ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
                  ctx.beginPath();
                  ctx.arc(rightTipX + 1.8 * bs, rightTipY - 1.8 * bs, 1.2 * bs, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.restore();

                  // Right wing feather shaft detail lines
                  ctx.strokeStyle = "rgba(40, 35, 45, 0.22)";
                  ctx.lineWidth = 0.45 * bs;
                  ctx.beginPath();
                  ctx.moveTo(rightWristX - 1.5 * bs, rightWristY - 1.5 * bs);
                  ctx.lineTo(rightWristX - 4 * bs, rightWristY - 3.5 * bs);
                  ctx.moveTo(rightElbowX - 1.5 * bs, rightElbowY - 1.5 * bs);
                  ctx.lineTo(rightElbowX - 3.5 * bs, rightElbowY - 4 * bs);
                  ctx.stroke();

                  ctx.restore();
                }
              });
            }

            // --- Elegant vertical Chinese calligraphy poetry inscription ---
            const POET_CALLIGRAPHY: Record<string, string[]> = {
              "李白": ["君不见黄河之水天上来", "奔流到海不复回"],
              "杜甫": ["安得广厦千万间", "大庇天下寒士俱欢颜"],
              "苏轼": ["江上清风与山间明月", "本无常主闲者便是主人"],
              "李清照": ["争渡争渡", "惊起一滩鸥鹭"],
              "辛弃疾": ["金戈铁马", "气吞万里如虎"],
            };

            const lines = POET_CALLIGRAPHY[activePoet.name] || [];
            ctx.save();
            ctx.font = `bold ${14 * s}px "Noto Serif SC", "SimSun", serif`;
            ctx.textAlign = "center"; // Align cleanly inside the vertical columns

            let globalCharIdx = 0;
            lines.forEach((lineText, lineIdx) => {
              // Right-to-left layout columns (convert imgX start into relative col placements)
              const colX = imgX + 32 * s + (lines.length - 1 - lineIdx) * 24 * s;
              for (let i = 0; i < lineText.length; i++) {
                const char = lineText[i];
                const charY = imgY + 42 * s + i * 18.5 * s;
                
                // Calculate discrete fade-in alpha for each character based on scroll text progress
                const charProgress = poetBody.scrollTextProgress || 0;
                const charAge = charProgress - globalCharIdx;
                globalCharIdx++;
                
                if (charAge > 0) {
                  const charAlpha = Math.min(1.0, charAge);
                  ctx.save();
                  ctx.fillStyle = `rgba(229, 203, 159, ${0.85 * charAlpha})`; // Gold-ink style with partial alpha support
                  ctx.shadowColor = `rgba(0, 0, 0, ${0.85 * charAlpha})`;
                  ctx.shadowBlur = 4 * s;
                  ctx.fillText(char, colX, charY);
                  ctx.restore();
                }
              }
            });

            // Draw a cute red seal (印章) below the last character of the last line
            if (lines.length > 0) {
              const lastLine = lines[lines.length - 1];
              const sealColIdx = lines.length - 1;
              const sealX = imgX + 32 * s + (lines.length - 1 - sealColIdx) * 24 * s;
              const sealY = imgY + 42 * s + lastLine.length * 18.5 * s + 8 * s;

              const totalChars = lines.reduce((acc, line) => acc + line.length, 0);
              const sealProgress = (poetBody.scrollTextProgress || 0) - totalChars;

              if (sealProgress > 0) {
                const sealAlpha = Math.min(1.0, sealProgress * 0.4); // Typewrite complete -> seal stamp fades in Cinnabar Red
                ctx.save();
                ctx.fillStyle = `rgba(180, 40, 40, ${0.95 * sealAlpha})`; // Cinnabar Red
                ctx.fillRect(sealX - 6 * s, sealY, 13 * s, 13 * s);
                
                ctx.strokeStyle = `rgba(229, 203, 159, ${0.6 * sealAlpha})`;
                ctx.lineWidth = 0.5 * s;
                ctx.strokeRect(sealX - 6 * s, sealY, 13 * s, 13 * s);

                ctx.fillStyle = `rgba(229, 203, 159, ${1.0 * sealAlpha})`;
                ctx.font = `bold ${8 * s}px "Noto Serif SC", "SimSun", serif`;
                ctx.fillText("印", sealX, sealY + 9.5 * s);
                ctx.restore();
              }
            }
            ctx.restore(); // restores typography save

            ctx.restore(); // restores clip context save

            ctx.restore(); // restores landscape top-level save
          }


          // Dynamic nesting: Let the poet silhouette fade and scale down within the landscape frame first!
          {
            ctx.save();
            const ips = poetBody.innerPoetScale !== undefined ? poetBody.innerPoetScale : 1.0;
            const ipa = poetBody.innerPoetAlpha !== undefined ? poetBody.innerPoetAlpha : 1.0;
            const s = poetBody.scale * ips;
            const isPoetHidden = poetBody.lqPoetHidden || poetBody.lbPoetHidden;
            ctx.globalAlpha = isPoetHidden ? 0.0 : Math.max(0, Math.min(1.0, poetBody.alpha * ipa));

            // Drawing glowing ink-halo corona around him/her (only if not Li Qingzhao, to avoid unrequested backdrops/modifications)
            if (activePoet.name !== "李清照") {
              const aura = ctx.createRadialGradient(
                pX, pY - 30 * s, 10 * s,
                pX, pY - 10 * s, 140 * s
              );
              aura.addColorStop(0, activePoet.style.inkColor);
              aura.addColorStop(0.35, "rgba(20, 15, 30, 0.25)");
              aura.addColorStop(1, "rgba(0, 0, 0, 0)");
              ctx.fillStyle = aura;
              ctx.beginPath();
              ctx.arc(pX, pY - 20 * s, 140 * s, 0, Math.PI * 2);
              ctx.fill();
            }

          const keyedPortrait = keyedPortraitCanvasesRef.current[activePoet.name];
          const rawPortrait = poetPortraitsRef.current[activePoet.name];
          if (keyedPortrait || rawPortrait) {
            const drawable = keyedPortrait || rawPortrait;
            const naturalW = drawable.width || drawable.naturalWidth || 1;
            const naturalH = drawable.height || drawable.naturalHeight || 1;
            const aspectRatio = naturalW / naturalH;

            // Draw the portrait directly on the stage with transparency
            const pH = 260 * s;
            const pW = pH * aspectRatio;
            const px = pX - pW / 2;
            const py = pY - pH / 2 + 10 * s + breathing * 0.4;

            ctx.save();
            ctx.drawImage(drawable, px, py, pW, pH);
            ctx.restore();
          } else {
            // Render physical Chinese Scholar Silhouette robe using quadratic curve strings
            ctx.fillStyle = activePoet.style.inkColor;
            ctx.beginPath();
            ctx.moveTo(pX - 44 * s, pY + 115 * s);
            ctx.bezierCurveTo(
              pX - 55 * s + breathing, pY + 15 * s,
              pX - 28 * s, pY - 45 * s,
              pX, pY - 65 * s
            );
            ctx.bezierCurveTo(
              pX + 28 * s, pY - 45 * s,
              pX + 55 * s - breathing, pY + 15 * s,
              pX + 44 * s, pY + 115 * s
            );
            ctx.closePath();
            ctx.fill();

            // Elegant traditional sash/ribbon tying at the waist
            ctx.strokeStyle = activePoet.style.sash;
            ctx.lineWidth = 4 * s;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(pX - 20 * s, pY + 18 * s + breathing * 0.4);
            ctx.quadraticCurveTo(
              pX + breathing, pY + 25 * s,
              pX + 20 * s, pY + 18 * s + breathing * 0.4
            );
            ctx.stroke();

            // Scholar top knot/hair hat (冠帽) vector curves
            ctx.fillStyle = "rgba(18, 14, 25, 0.95)";
            ctx.beginPath();
            ctx.arc(pX, pY - 82 * s + breathing * 0.2, 16 * s, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = activePoet.style.inkColor;
            ctx.lineWidth = 2 * s;
            ctx.stroke();
          }

          ctx.restore(); // Matching the nested poet silhouette save()
          }
          ctx.restore(); // Matching the main outer save()
        }
      }

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [activePoet]);

  // Dynamic Mouse control fallback in developer views / no capture modes
  const handleMouseMove = (e: React.MouseEvent) => {
    if (stateRef.current === "TRAVEL" && !travelCooldownRef.current) {
      meteorRef.current.targetX = e.clientX;
      meteorRef.current.targetY = e.clientY;
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // If we are wandering the star system, let user strum the celestial strings!
    if (stateRef.current === "TRAVEL") {
      inkAudio.init();
      inkAudio.playRandomPentatonic(musicPreset, Math.random() > 0.6 ? "high" : "medium");
    }

    // If the scroll is open and paused, clicking should trigger folding closed!
    const poetBody = poetBodyRef.current;
    if (poetBody && poetBody.fadeOutStage && poetBody.lqSequence === "pause") {
      setHudMessage("✊ 收到轻点！卷轴收拢，起航飞向星海！");
      poetBody.lqSequence = "fold_close";
      return;
    }

    if (useMouseFallback || hasWebcamError) {
      if (stateRef.current === "CARD" && !isUiLockedRef.current) {
        if (bubbleOnlyRef.current) {
          changeBubbleOnly(false);
          isUiLockedRef.current = true;
          setTimeout(() => {
            isUiLockedRef.current = false;
          }, 1200);
        } else {
          executeEnterDialogue();
        }
      } else if (stateRef.current === "DIALOGUE" || stateRef.current === "CURTAIN") {
        executeCloseDialogue();
      }
    } else {
      // If camera is working but user still wants to use mouse click to dismiss, allow it
      if (stateRef.current === "DIALOGUE" || stateRef.current === "CURTAIN") {
        executeCloseDialogue();
      }
    }
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-[#030208] text-[#e5cb9f] font-serif select-none"
      onMouseMove={handleMouseMove}
    >
      {/* 1. Main visual Canvas space */}
      <canvas 
        id="starCanvas" 
        ref={canvasRef} 
        onClick={handleCanvasClick}
        className="absolute top-0 left-0 w-full h-full block z-10 cursor-crosshair"
      />

      {/* 2. Top Header HUD with high-end Chinese Calligraphy title */}
      <header className="absolute top-6 left-6 z-30 pointer-events-none select-none flex flex-col gap-1 max-w-sm">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 border border-amber-500/40 p-2 rounded-full backdrop-blur-md">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <h1 className="text-3xl tracking-[0.25em] font-heading text-amber-100 font-bold drop-shadow-md">
            星遇诗客
          </h1>
        </div>
        <p className="text-xs text-amber-200/50 uppercase tracking-[0.2em] font-sans pl-1">
          Ink Poetry Constellation System
        </p>
      </header>

      {/* 2.5 INTRO SCREEN - Camera Permission Request */}
      <AnimatePresence>
        {gameState === "INTRO" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#050409]/95 backdrop-blur-xl"
          >
            {/* Elegant Calligraphic Background Pattern Decoration */}
            <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative flex flex-col items-center max-w-xl text-center gap-6 p-8 md:p-10 border border-amber-500/20 rounded-2xl bg-[#0d0a0f]/80 shadow-[0_0_120px_rgba(217,119,6,0.12)] max-h-[90vh] overflow-y-auto custom-scrollbar pointer-events-auto">
              
              {/* Outer classic corner decoration lines */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-600/40" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-600/40" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-600/40" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-600/40" />

              <div className="flex flex-col items-center gap-1 mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500/50">✦</span>
                  <p className="text-xs uppercase tracking-[0.3em] font-sans text-amber-500/70 font-bold">
                    Ink Poetry Constellation System
                  </p>
                  <span className="text-amber-500/50">✦</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-heading text-amber-100 tracking-[0.25em] font-extrabold drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] mt-2">
                  星遇诗客
                </h2>
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent my-3" />
              </div>

              {/* Poetry Quote Box for atmospheric elevation */}
              <div className="relative py-6 px-10 border-l border-r border-amber-600/20 bg-amber-950/5 rounded-sm my-1 flex flex-col items-center gap-3">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                <p className="text-lg md:text-xl text-amber-200/95 font-serif tracking-[0.25em] leading-relaxed select-none text-center">
                  醉后不知天在水，
                  <br className="my-1" />
                  满船清梦压星河。
                </p>
                <span className="text-[10px] text-amber-500/40 tracking-wider">— 唐温如 ·《题龙阳县歌》—</span>
              </div>

              {/* Thematic Storytelling / High Concept introduction */}
              <div className="text-amber-200/90 font-serif leading-relaxed text-sm text-justify px-4 flex flex-col gap-3.5 border-t border-b border-amber-500/10 py-6 bg-amber-950/10 rounded-lg">
                <p className="indent-8">
                  本系统融汇千载水墨气象与无边数字星尘，凝铸为一曲名士重逢之歌。世间每一次灵犀相交，皆是旷代宿命的群星闪烁。
                </p>
                <p className="indent-8">
                  利用端侧高精确度<strong className="text-amber-400 font-medium">骨骼肢体关节追踪</strong>，本系统将您的真实双手化作重构宇宙乾坤的灵犀画笔。在镜前伸展单手可以开启诗画幻境与文字幕布，张开双手即可展开古卷。收叠时，只需在镜前比划握拳即可收叠卷轴，重入漫天星野。让我们拂去时光积尘，同李太白、杜子美等旷代诗家遁入一场超越时空的水墨群星幻境。
                </p>
              </div>

              {/* Privacy protection guarantee (Local execution) */}
              <p className="text-[11px] text-amber-500/50 leading-relaxed max-w-md font-sans">
                🛡️ 本装置基于纯前端神经网络执行。所有面部、手骨骼运算皆在您的端侧浏览器内瞬间完成，不进行任何图像数据上传，大可安心感悟。
              </p>
              
              {/* Interaction Call to Actions */}
              <div className="flex flex-col gap-3 w-full mt-2">
                <button
                  onClick={() => {
                    setIsCameraPermissionGranted(true);
                    setGameState("TRAVEL");
                    setHudMessage("正在请求摄像头权限...");
                    // Begin immersive traditional music
                    inkAudio.start();
                    setMusicPlaying(true);
                  }}
                  className="group relative w-full py-4 bg-gradient-to-r from-amber-900/45 via-amber-800/80 to-amber-900/45 text-amber-100 font-bold rounded-lg border border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:shadow-[0_0_40px_rgba(245,158,11,0.3)] hover:border-amber-400 hover:text-white transition-all duration-300 scale-100 hover:scale-[1.01] active:scale-[0.99] tracking-[0.2em] flex justify-center items-center gap-2 cursor-pointer"
                >
                  <CameraIcon className="w-5 h-5 text-amber-400 group-hover:animate-pulse" /> 
                  「 执子之手 · 拂尘观澜 」
                </button>
                <button
                  onClick={() => {
                    setUseMouseFallback(true);
                    setGameState("TRAVEL");
                    setHudMessage("已采用鼠标点击交互模式");
                    // Begin immersive traditional music
                    inkAudio.start();
                    setMusicPlaying(true);
                  }}
                  className="text-xs text-amber-600/60 hover:text-amber-400 tracking-[0.1em] transition-colors py-1 cursor-pointer font-serif flex items-center justify-center gap-1.5"
                >
                  <span>无摄像头/不便开启？一念灵犀 · 启用鼠标纯享版 💻</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Elegant Controls Info Trigger */}
      <button 
        onClick={() => setShowInfo(!showInfo)}
        className="absolute top-6 right-6 z-40 bg-zinc-900/80 hover:bg-amber-950/80 transition-colors border border-amber-500/30 text-amber-100 p-2.5 rounded-full shadow-lg shadow-black/60 pointer-events-auto"
        title="交互说明 Help"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {/* 3. Guide Overlays (Constellation Instruction Modal) */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-20 right-6 w-80 bg-[#120f18]/95 border-2 border-amber-500/40 rounded-lg p-5 z-40 flex flex-col gap-4 text-sm font-serif shadow-2xl shadow-black pointer-events-auto"
          >
            <div className="flex justify-between items-center border-b border-amber-500/20 pb-2">
              <span className="text-amber-100 font-bold flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400 animate-spin" />
                星河寻仙指引
              </span>
              <button 
                onClick={() => setShowInfo(false)}
                className="text-amber-200/50 hover:text-amber-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3 leading-relaxed text-amber-200/80">
              <p>于漫天唯美的浪漫星空中穿梭。操控中央的<strong>金光流星</strong>，撞击闪耀着金黄色光斑的诗仙宿星。</p>
              
              <div className="border border-amber-500/10 bg-amber-500/5 p-2 rounded text-xs gap-2 flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span><strong>一、御空巡航</strong>：张开手掌，对准右下角摄像头镜头，滑动控制流星飞行；或使用鼠标游历。</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span><strong>二、唤醒诗仙</strong>：宿星相撞后卷轴开启，在镜前<strong>紧握拳头 ✊</strong> 或鼠标点击，冲入墨境。</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  <span><strong>三、古今拜别</strong>：对话结束时，<strong>张开手掌 🖐️</strong> 或鼠标点击，作别消散，化星轨飞速离去。</span>
                </div>
              </div>

              <div className="text-xs text-amber-500/70 border-t border-amber-500/10 pt-2 flex flex-col gap-1">
                <span>✦ 李白：墨彩文字瀑布（水花四溢）</span>
                <span>✦ 杜甫：灵动文字飞鸟（羽动凡尘）</span>
                <span>✦ 苏轼：环绕画圈星云（天演轨道）</span>
                <span>✦ 李清照：诗香雅致长河（行舟载思）</span>
                <span>✦ 辛弃疾：词境金错重门（门帘拉开）</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                setUseMouseFallback(!useMouseFallback);
                setHudMessage(useMouseFallback ? 
                  "✨ 已关闭鼠标调试模式，全力启用 MediaPipe 摄像头追踪！" : 
                  "💻 已启用鼠标强制调试，可快速点击点击撞星入画"
                );
              }}
              className="w-full text-center py-1.5 bg-amber-500/10 hover:bg-amber-500/20 active:bg-amber-500/30 border border-amber-500/30 text-amber-100 rounded text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              {useMouseFallback ? "切换至摄像头追踪" : "切换为鼠标交互模式"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main State Floating Instructions (Cosmic themed container fitted perfectly to the text) */}
      <AnimatePresence>
        {gameState === "TRAVEL" && !activePoet && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-2.5 w-fit px-8 py-4 bg-[#120f18]/85 border border-amber-500/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_25px_rgba(245,158,11,0.2)] backdrop-blur-md text-center max-w-[95vw] z-20"
          >
            <div className="text-amber-500/60 tracking-[0.4em] font-sans text-[10px] sm:text-xs pb-1 border-b border-amber-500/10 w-full text-center font-semibold">
              VOYAGE THROUGH TIME
            </div>
            <div className="text-xl sm:text-2xl font-heading text-amber-100 font-bold tracking-widest flex items-center gap-3 pt-1">
              <span className="text-amber-400 animate-pulse">✨</span>
              请于镜头前张开手掌
              <span className="text-amber-400 animate-pulse">✨</span>
            </div>
            <div className="text-amber-200/50 text-xs sm:text-sm tracking-widest font-serif mt-1 animate-pulse font-medium">
              [ 拦截宿星流星，唤醒千古风流 ]
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Scroll detail view card (流派卷轴 📖) */}
      <AnimatePresence>
        <PoemCardView 
          gameState={gameState}
          activePoet={activePoet}
          isUiLocked={isUiLocked}
          useMouseFallback={useMouseFallback}
          executeEnterDialogue={executeEnterDialogue}
          bubbleOnly={bubbleOnly}
          setBubbleOnly={changeBubbleOnly}
          activeStarPos={activeStarPos}
          dismissPoetCard={dismissPoetCard}
        />
      </AnimatePresence>

      {/* 5. Subtitle Dialogue interface */}
      <AnimatePresence>
        <PoemDialogueBox 
          gameState={gameState}
          activePoet={activePoet}
          useMouseFallback={useMouseFallback}
          dialogueLocked={dialogueLocked}
          executeCloseDialogue={executeCloseDialogue}
        />
      </AnimatePresence>

      {/* 6. Static Tracking Camera window in Bottom Right corner */}
      <section className="absolute bottom-6 right-6 z-30 flex flex-col items-end gap-2.5">
        
        {/* Dynamic hand gesture HUD readout */}
        <div className="bg-[#0e0c15]/90 border border-amber-500/50 text-amber-100 px-4 py-2 rounded-md text-xs tracking-wider shadow-lg shadow-black/70 flex items-center gap-2 font-serif select-none max-w-sm">
          <Layers className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>{hudMessage}</span>
        </div>

        {/* Real-time capture video render */}
        <div className="relative w-[210px] h-[155px] border-2 border-amber-500/60 rounded overflow-hidden shadow-2xl bg-black shadow-amber-500/10">
          <video 
            id="webcam" 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
          
          {/* Aesthetic Scanner Overlay line */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/3 to-transparent bg-[length:200%_200%] pointer-events-none" />
          
          {/* Unloaded/Error Captcha readouts */}
          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-center p-3 gap-2">
              <CameraIcon className="w-6 h-6 text-amber-500/60 animate-pulse" />
              <span className="text-[10px] text-amber-200/50">正在侦测手势设备...</span>
              <span className="text-[9px] text-zinc-500 leading-normal">如无摄像头，可双击切换【鼠标调试模式】</span>
            </div>
          )}
        </div>
      </section>

      {/* 5.5 Traditional Chinese Study - Floating Music Widget (水墨琴斋) */}
      <div className="absolute bottom-14 left-6 z-40 bg-[#0c0a12]/95 border border-amber-500/35 rounded-xl p-2.5 shadow-[0_0_20px_rgba(245,158,11,0.12)] backdrop-blur-md text-[10px] font-serif text-amber-200/90 w-[260px] pointer-events-auto select-none flex flex-col gap-2 transition-all duration-300 hover:border-amber-400/80" id="music-widget-container">
        
        {/* Title and Active String Indicators */}
        <div className="flex items-center justify-between border-b border-amber-500/10 pb-1.5">
          <div className="flex items-center gap-1.5">
            <div className={`p-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full ${musicPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }}>
              <Music className="w-3 h-3 text-amber-400" />
            </div>
            <span className="font-bold tracking-widest text-[#fdf6e2] font-heading text-xs">水墨琴斋</span>
          </div>
          <div className="flex items-center gap-1">
            {lastPluckedNote && (
              <span className="text-[8px] bg-amber-950/70 text-amber-400 border border-amber-500/20 px-0.5 py-0.2 rounded font-sans tracking-wide">
                {lastPluckedNote}
              </span>
            )}
            <span className={`w-1 h-1 rounded-full ${musicPlaying ? 'bg-amber-400 animate-ping' : 'bg-zinc-600'}`} />
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-1 p-0.5 bg-black/40 rounded-md border border-zinc-900">
          <button
            onClick={() => {
              if (musicMode !== 'song') handleToggleMode();
            }}
            className={`py-0.5 rounded text-[9px] font-heading cursor-pointer transition-all text-center ${
              musicMode === 'song'
                ? "bg-amber-950/45 text-amber-300 font-bold border border-amber-500/25"
                : "text-zinc-500 hover:text-amber-300"
            }`}
          >
            古曲品吟 (Songs)
          </button>
          <button
            onClick={() => {
              if (musicMode !== 'ambient') handleToggleMode();
            }}
            className={`py-0.5 rounded text-[9px] font-heading cursor-pointer transition-all text-center ${
              musicMode === 'ambient'
                ? "bg-amber-950/45 text-amber-300 font-bold border border-amber-500/25"
                : "text-zinc-500 hover:text-amber-300"
            }`}
          >
            本源律动 (Ambient)
          </button>
        </div>

        {/* Song Selector and Live Scroll Track */}
        {musicMode === 'song' ? (
          <div className="flex flex-col gap-1 bg-black/25 border border-amber-950/20 rounded-lg p-1.5">
            {/* Song Meta Deck */}
            <div className="flex items-center justify-between gap-0.5">
              <button
                onClick={handlePrevSong}
                className="p-1 hover:text-amber-400 hover:bg-amber-950/20 rounded cursor-pointer transition-colors"
                title="上一首 (Previous)"
              >
                <SkipBack className="w-3 h-3" />
              </button>

              <div className="flex flex-col items-center justify-center text-center flex-1">
                <span className="font-bold text-amber-100 tracking-wider text-[10px] font-heading">
                  {currentSongTitle}
                </span>
                <span className="text-[8px] text-zinc-500 font-sans mt-0.5">
                  {TRADITIONAL_SONGS[songIndex].composer} · {TRADITIONAL_SONGS[songIndex].bpm} BPM
                </span>
              </div>

              <button
                onClick={handleNextSong}
                className="p-1 hover:text-amber-400 hover:bg-amber-950/20 rounded cursor-pointer transition-colors"
                title="下一首 (Next)"
              >
                <SkipForward className="w-3 h-3" />
              </button>
            </div>

            {/* Song Description */}
            <p className="text-[8px] text-amber-200/40 text-center font-sans italic leading-tight px-1 border-t border-amber-500/5 pt-1">
              {TRADITIONAL_SONGS[songIndex].description}
            </p>

            {/* Interactive Calligraphic Scroll */}
            <div className="relative py-1 bg-[#09070e] border border-amber-500/10 rounded overflow-hidden flex items-center justify-center h-8 px-1 mt-0.5">
              {/* Fade filters side-ends */}
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-[#09070e] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-[#09070e] to-transparent z-10 pointer-events-none" />
              
              {/* Note scrollway container */}
              <div 
                className="flex items-center gap-1.5 transition-transform duration-300"
                style={{
                  transform: `translateX(calc(50% - ${(currentSongNoteIdx * 21) + 10}px))`
                }}
              >
                {TRADITIONAL_SONGS[songIndex].notes.map((note, idx) => {
                  const isActive = idx === currentSongNoteIdx;
                  return (
                    <div
                      key={idx}
                      className={`w-5 h-5 flex items-center justify-center rounded text-[9px] font-heading font-bold transition-all shrink-0 ${
                        isActive
                          ? "bg-amber-500/20 border border-amber-500 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.4)] scale-110"
                          : "text-zinc-600 border border-transparent"
                      }`}
                    >
                      {note.tag}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Ambient Mode */
          <div className="flex flex-col gap-1 bg-black/25 border border-amber-950/20 rounded-lg p-1.5 justify-center items-center text-center py-2">
            <Sparkles className="w-3 h-3 text-amber-500/40 animate-pulse" />
            <span className="font-heading text-amber-200/80 text-[10px] mt-0.5">星海幽居 · 雨林风弦</span>
            <span className="text-[8px] text-zinc-500 leading-tight max-w-[190px]">
              自适应太空五声宫商律动，以 1.8s 至 5s 间隔徐徐飘散悠怨回响，静护心气。
            </span>
          </div>
        )}

        {/* Lower deck - Instrument Selection, Volume, and Manual Pluck */}
        <div className="flex flex-col gap-1.5 bg-black/40 border border-zinc-900 rounded-lg p-1.5 font-sans">
          
          {/* Main Controls - Play/Pause and Preset Selections */}
          <div className="flex items-center gap-2">
            {/* Play/Pause control with Ink Wash ring visualizer */}
            <button
              onClick={() => {
                const res = inkAudio.togglePlay();
                setMusicPlaying(res);
                if (res) {
                  setHudMessage(musicMode === 'song' ? `🎵 鼓瑟抚琴，传统名曲：${TRADITIONAL_SONGS[songIndex].title} 音韵回声幽幽响起...` : "✨ 鼓琴听息，星罗环境音韵缈缈升起...");
                } else {
                  setHudMessage("🔇 已休止琴乐，水墨归于沉静");
                }
              }}
              className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all cursor-pointer shrink-0 shadow-lg ${
                musicPlaying 
                  ? "bg-amber-500/15 border-amber-400 text-amber-300 hover:bg-amber-500/25 shadow-[0_0_10px_rgba(245,158,11,0.15)]" 
                  : "bg-stone-900 border-zinc-700 text-zinc-500 hover:text-amber-400 hover:border-amber-500/50"
              }`}
              title={musicPlaying ? "停歇雅乐 (Pause)" : "品赏雅乐 (Play)"}
            >
              {musicPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 pl-0.5" />}
            </button>

            {/* Instrument Presets (Guzheng, Guqin, Flute) */}
            <div className="flex flex-col gap-0.5 flex-1">
              <span className="text-[8px] text-zinc-500 tracking-wider font-sans uppercase">器乐声相 (Timbre)</span>
              <div className="grid grid-cols-3 gap-0.5">
                {[
                  { id: 'guzheng', name: '古筝' },
                  { id: 'guqin', name: '古琴' },
                  { id: 'flute', name: '新笛' }
                ].map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      const id = preset.id as InstrumentType;
                      inkAudio.setPreset(id);
                      setMusicPreset(id);
                      // play random welcome pluck
                      inkAudio.playRandomPentatonic(id, 'medium');
                      setHudMessage(`🎵 乐器音律已调谐为：【${preset.name}】`);
                    }}
                    className={`py-0.5 rounded text-[9px] transition-all cursor-pointer text-center font-heading border ${
                      musicPreset === preset.id
                        ? "bg-amber-950/60 border-amber-400 text-amber-300 font-bold shadow-[0_0_8px_rgba(245,158,11,0.15)]"
                        : "bg-black/40 border-zinc-900 text-zinc-500 hover:text-amber-300 hover:border-zinc-800"
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Volume bar & Manual Pluck interactive area */}
          <div className="flex items-center justify-between text-[9px] text-zinc-500 border-t border-zinc-900 pt-1.5">
            <div className="flex items-center gap-1 select-none">
              <span className="cursor-pointer text-zinc-400 hover:text-amber-400 transition-colors" onClick={() => {
                const newVol = musicVolume === 0 ? 0.35 : 0;
                inkAudio.setVolume(newVol);
                setMusicVolume(newVol);
              }}>
                {musicVolume === 0 ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </span>
              <input 
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={musicVolume}
                onChange={(e) => {
                  const vol = parseFloat(e.target.value);
                  inkAudio.setVolume(vol);
                  setMusicVolume(vol);
                }}
                className="w-16 accent-amber-500 cursor-pointer h-0.5 rounded bg-zinc-800"
              />
            </div>
            
            {/* Play Manual plucks button */}
            <button
              onClick={() => {
                inkAudio.init();
                inkAudio.playRandomPentatonic(musicPreset, Math.random() > 0.65 ? 'high' : 'medium');
              }}
              className="text-[8px] text-amber-500 hover:text-amber-300 hover:border-amber-400 transition-all cursor-pointer font-serif tracking-widest border border-amber-500/25 px-1.5 py-0.2 rounded bg-amber-500/5 active:bg-amber-500/20"
              title="拨动琴弦 (Strum)"
            >
              拨 弦
            </button>
          </div>

        </div>

      </div>

      {/* Subtle Bottom Credit Info */}
      <footer className="absolute bottom-6 left-6 z-20 pointer-events-none text-[10px] text-amber-200/35 tracking-[0.2em] font-sans">
        CRAFTED VIA AI STUDIO · LANDSCAPE POETRY
      </footer>
    </div>
  );
}
