import React from 'react';
import { ColoringPage } from '../types';

// Helper for clickable SVG parts
const createPart = (
  id: string,
  Tag: 'path' | 'circle' | 'ellipse' | 'rect' | 'polygon',
  props: React.SVGProps<SVGElement>,
  fills: Record<string, string>,
  onSectionClick: (id: string) => void,
  _defaultFill: string = '#FFFFFF'
) => {
  // First objective is always 100% colourless (#FFFFFF) line-art so players add colours to it
  const currentFill = fills[id] || '#FFFFFF';
  return React.createElement(Tag, {
    ...props,
    key: id,
    id: `part-${id}`,
    fill: currentFill,
    stroke: '#1e293b',
    strokeWidth: props.strokeWidth !== undefined ? props.strokeWidth : 3.5,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      onSectionClick(id);
    },
    className: 'cursor-pointer transition-colors duration-150 hover:brightness-95 active:scale-[0.99] origin-center',
  });
};

export const COLORING_PAGES: ColoringPage[] = [
  {
    id: 'dino',
    title: 'Happy Dinosaur',
    category: 'animals',
    description: 'A friendly dinosaur playing under the warm sun with a gentle volcano!',
    viewBox: '0 0 800 600',
    thumbnailSvg: '🦕',
    renderSvg: (fills, onSectionClick) => (
      <g>
        {/* Background Sky - Colourless, ready for player to color */}
        {createPart('sky', 'rect', { x: 2, y: 2, width: 796, height: 596, strokeWidth: 3 }, fills, onSectionClick)}
        
        {/* Sun & Rays */}
        {createPart('sun', 'circle', { cx: 120, cy: 110, r: 50 }, fills, onSectionClick)}
        {createPart('sun-ray1', 'path', { d: 'M120,35 L120,50' }, fills, onSectionClick)}
        {createPart('sun-ray2', 'path', { d: 'M120,170 L120,185' }, fills, onSectionClick)}
        {createPart('sun-ray3', 'path', { d: 'M45,110 L60,110' }, fills, onSectionClick)}
        {createPart('sun-ray4', 'path', { d: 'M180,110 L195,110' }, fills, onSectionClick)}
        {createPart('sun-ray5', 'path', { d: 'M68,58 L78,68' }, fills, onSectionClick)}
        {createPart('sun-ray6', 'path', { d: 'M162,152 L172,162' }, fills, onSectionClick)}
        {createPart('sun-ray7', 'path', { d: 'M68,162 L78,152' }, fills, onSectionClick)}
        {createPart('sun-ray8', 'path', { d: 'M162,68 L172,58' }, fills, onSectionClick)}

        {/* Clouds */}
        {createPart('cloud1', 'path', { d: 'M550,100 a30,30 0 0,1 50,-10 a35,35 0 0,1 60,10 a30,30 0 0,1 30,30 a20,20 0 0,1 -10,20 l-120,0 a25,25 0 0,1 -10,-50 z' }, fills, onSectionClick)}
        {createPart('cloud2', 'path', { d: 'M260,80 a25,25 0 0,1 40,-8 a30,30 0 0,1 50,8 a25,25 0 0,1 25,25 l-110,0 a20,20 0 0,1 -5,-25 z' }, fills, onSectionClick)}

        {/* Distant Mountains / Volcano */}
        {createPart('mountain-back', 'polygon', { points: '620,480 710,240 800,480' }, fills, onSectionClick)}
        {createPart('volcano-body', 'polygon', { points: '640,480 695,280 725,280 780,480' }, fills, onSectionClick)}
        {createPart('volcano-lava', 'path', { d: 'M695,280 Q710,295 725,280 Q730,265 710,260 Q690,265 695,280 Z' }, fills, onSectionClick)}
        {createPart('smoke1', 'circle', { cx: 710, cy: 235, r: 18 }, fills, onSectionClick)}
        {createPart('smoke2', 'circle', { cx: 728, cy: 200, r: 24 }, fills, onSectionClick)}

        {/* Rolling Hills Ground */}
        {createPart('hill-far', 'path', { d: 'M-10,480 Q250,380 500,460 T810,440 L810,600 L-10,600 Z' }, fills, onSectionClick)}
        {createPart('ground', 'path', { d: 'M-10,500 Q200,470 480,520 T810,490 L810,600 L-10,600 Z' }, fills, onSectionClick)}

        {/* Dinosaur Back Spikes */}
        {createPart('spike1', 'polygon', { points: '320,180 340,130 365,175' }, fills, onSectionClick)}
        {createPart('spike2', 'polygon', { points: '375,175 400,120 425,185' }, fills, onSectionClick)}
        {createPart('spike3', 'polygon', { points: '435,190 460,135 485,210' }, fills, onSectionClick)}
        {createPart('spike4', 'polygon', { points: '495,220 515,170 535,245' }, fills, onSectionClick)}
        {createPart('spike5', 'polygon', { points: '545,260 565,220 580,285' }, fills, onSectionClick)}

        {/* Dinosaur Body & Tail */}
        {createPart('dino-body', 'path', { d: 'M250,220 C250,150 340,150 360,200 C440,180 560,240 600,320 C640,400 580,420 540,390 C500,420 440,430 360,420 C320,420 280,390 260,340 Z' }, fills, onSectionClick)}
        
        {/* Legs */}
        {createPart('leg-back-left', 'path', { d: 'M300,390 L290,490 Q305,505 330,490 L340,400 Z' }, fills, onSectionClick)}
        {createPart('leg-back-right', 'path', { d: 'M460,390 L460,490 Q475,505 500,490 L495,400 Z' }, fills, onSectionClick)}
        {createPart('leg-front-left', 'path', { d: 'M330,395 L320,505 Q340,520 370,505 L375,410 Z' }, fills, onSectionClick)}
        {createPart('leg-front-right', 'path', { d: 'M430,405 L420,510 Q440,525 470,510 L465,415 Z' }, fills, onSectionClick)}

        {/* Dino Head & Neck */}
        {createPart('dino-head', 'path', { d: 'M270,300 C250,260 210,250 180,220 C150,190 150,120 200,100 C260,80 300,120 290,170 C280,210 300,260 310,290 Z' }, fills, onSectionClick)}
        
        {/* Belly Patch */}
        {createPart('dino-belly', 'path', { d: 'M320,320 C330,260 380,260 400,290 C410,340 380,410 320,400 Z' }, fills, onSectionClick)}

        {/* Spots on Dino */}
        {createPart('spot1', 'circle', { cx: 430, cy: 260, r: 16 }, fills, onSectionClick)}
        {createPart('spot2', 'circle', { cx: 470, cy: 300, r: 18 }, fills, onSectionClick)}
        {createPart('spot3', 'circle', { cx: 510, cy: 350, r: 14 }, fills, onSectionClick)}
        {createPart('spot4', 'circle', { cx: 370, cy: 230, r: 12 }, fills, onSectionClick)}

        {/* Facial details */}
        {createPart('dino-eye-outer', 'circle', { cx: 215, cy: 130, r: 18 }, fills, onSectionClick)}
        <circle cx="218" cy="130" r="8" fill="#1e293b" />
        <circle cx="221" cy="127" r="3" fill="#ffffff" />
        {/* Cheek Blush */}
        {createPart('dino-cheek', 'circle', { cx: 240, cy: 155, r: 10 }, fills, onSectionClick)}
        {/* Smile */}
        <path d="M190,165 Q210,185 230,170" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
        {/* Cute Little Tooth */}
        <polygon points="205,172 212,182 216,171" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />

        {/* Flower on Ground */}
        {createPart('flower-stem', 'path', { d: 'M150,530 Q155,490 150,460' }, fills, onSectionClick)}
        {createPart('flower-petal1', 'circle', { cx: 135, cy: 450, r: 14 }, fills, onSectionClick)}
        {createPart('flower-petal2', 'circle', { cx: 165, cy: 450, r: 14 }, fills, onSectionClick)}
        {createPart('flower-petal3', 'circle', { cx: 150, cy: 435, r: 14 }, fills, onSectionClick)}
        {createPart('flower-petal4', 'circle', { cx: 150, cy: 465, r: 14 }, fills, onSectionClick)}
        {createPart('flower-center', 'circle', { cx: 150, cy: 450, r: 9 }, fills, onSectionClick)}
      </g>
    ),
  },
  {
    id: 'deep-sea',
    title: 'Ocean Adventure',
    category: 'animals',
    description: 'A cheerful blue whale and underwater friends exploring the coral reef!',
    viewBox: '0 0 800 600',
    thumbnailSvg: '🐳',
    renderSvg: (fills, onSectionClick) => (
      <g>
        {/* Ocean Background - Colourless canvas */}
        {createPart('ocean-bg', 'rect', { x: 2, y: 2, width: 796, height: 596, strokeWidth: 3 }, fills, onSectionClick)}

        {/* Seabed Sandy floor */}
        {createPart('seabed', 'path', { d: 'M-10,510 Q200,480 400,520 T810,500 L810,600 L-10,600 Z' }, fills, onSectionClick)}

        {/* Seaweed */}
        {createPart('seaweed1', 'path', { d: 'M60,550 Q40,460 70,390 Q90,320 60,260 Q40,330 55,420 Q65,490 70,550 Z' }, fills, onSectionClick)}
        {createPart('seaweed2', 'path', { d: 'M95,560 Q125,480 100,410 Q85,340 110,290 Q95,360 110,430 Q115,500 105,560 Z' }, fills, onSectionClick)}
        {createPart('seaweed3', 'path', { d: 'M730,550 Q750,460 720,380 Q700,310 730,240 Q710,320 735,410 Q740,490 740,550 Z' }, fills, onSectionClick)}

        {/* Coral Plants */}
        {createPart('coral1', 'path', { d: 'M660,540 C640,480 650,440 670,430 C690,440 680,480 700,450 C715,465 700,510 710,540 Z' }, fills, onSectionClick)}
        {createPart('coral2', 'path', { d: 'M140,550 C130,490 145,460 160,450 C175,465 170,500 185,480 C195,495 185,530 190,550 Z' }, fills, onSectionClick)}

        {/* Water Spout / Fountain */}
        {createPart('spout-left', 'path', { d: 'M350,170 C330,120 280,100 240,110 C270,120 300,150 330,180 Z' }, fills, onSectionClick)}
        {createPart('spout-center', 'path', { d: 'M350,170 C350,90 340,60 360,50 C370,70 370,110 360,170 Z' }, fills, onSectionClick)}
        {createPart('spout-right', 'path', { d: 'M360,170 C380,120 430,100 470,110 C440,120 410,150 380,180 Z' }, fills, onSectionClick)}

        {/* Big Whale Body & Tail */}
        {createPart('whale-tail-top', 'path', { d: 'M620,290 C660,250 710,240 730,220 C710,270 680,295 640,305 Z' }, fills, onSectionClick)}
        {createPart('whale-tail-bottom', 'path', { d: 'M620,310 C660,340 710,360 730,380 C710,335 680,315 640,305 Z' }, fills, onSectionClick)}
        {createPart('whale-body', 'path', { d: 'M220,330 C200,240 280,180 370,180 C500,180 620,260 640,305 C620,350 500,430 370,430 C270,430 230,380 220,330 Z' }, fills, onSectionClick)}
        
        {/* Whale Belly */}
        {createPart('whale-belly', 'path', { d: 'M250,360 C300,420 420,430 500,390 C460,360 370,350 250,360 Z' }, fills, onSectionClick)}
        {/* Belly Grooves */}
        <path d="M290,375 Q360,395 440,385" fill="none" stroke="#1e293b" strokeWidth="3" />
        <path d="M330,395 Q380,410 460,395" fill="none" stroke="#1e293b" strokeWidth="3" />

        {/* Whale Flipper */}
        {createPart('whale-fin', 'path', { d: 'M360,350 C380,390 410,415 440,420 C420,390 410,365 390,340 Z' }, fills, onSectionClick)}

        {/* Whale Eye & Face */}
        {createPart('whale-eye', 'circle', { cx: 280, cy: 260, r: 15 }, fills, onSectionClick)}
        <circle cx="282" cy="260" r="7" fill="#1e293b" />
        <circle cx="285" cy="257" r="3" fill="#ffffff" />
        {/* Whale Cheek Blush */}
        {createPart('whale-blush', 'circle', { cx: 295, cy: 290, r: 12 }, fills, onSectionClick)}
        {/* Whale Smile */}
        <path d="M250,290 Q270,320 310,295" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />

        {/* Cute Little Jellyfish */}
        {createPart('jelly-cap', 'path', { d: 'M140,220 C140,170 200,170 200,220 Z' }, fills, onSectionClick)}
        {createPart('jelly-tentacle1', 'path', { d: 'M150,220 Q145,260 155,290' }, fills, onSectionClick)}
        {createPart('jelly-tentacle2', 'path', { d: 'M170,220 Q175,265 168,295' }, fills, onSectionClick)}
        {createPart('jelly-tentacle3', 'path', { d: 'M190,220 Q185,260 195,290' }, fills, onSectionClick)}
        <circle cx="160" cy="205" r="4" fill="#1e293b" />
        <circle cx="180" cy="205" r="4" fill="#1e293b" />
        <path d="M166,212 Q170,218 174,212" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

        {/* Friendly Starfish on Sand */}
        {createPart('starfish', 'polygon', { points: '240,510 255,535 285,535 260,555 270,580 240,565 210,580 220,555 195,535 225,535' }, fills, onSectionClick)}
        <circle cx="235" cy="545" r="3" fill="#1e293b" />
        <circle cx="245" cy="545" r="3" fill="#1e293b" />
        <path d="M237,552 Q240,556 243,552" fill="none" stroke="#1e293b" strokeWidth="2" />

        {/* Floating Bubbles */}
        {createPart('bubble1', 'circle', { cx: 480, cy: 120, r: 16 }, fills, onSectionClick)}
        {createPart('bubble2', 'circle', { cx: 520, cy: 90, r: 24 }, fills, onSectionClick)}
        {createPart('bubble3', 'circle', { cx: 550, cy: 140, r: 12 }, fills, onSectionClick)}
        {createPart('bubble4', 'circle', { cx: 180, cy: 380, r: 14 }, fills, onSectionClick)}
        {createPart('bubble5', 'circle', { cx: 200, cy: 420, r: 20 }, fills, onSectionClick)}
      </g>
    ),
  },
  {
    id: 'rocket',
    title: 'Space Explorer',
    category: 'space',
    description: 'Blast off in a cool rocket ship visiting Saturn, the Moon, and cute aliens!',
    viewBox: '0 0 800 600',
    thumbnailSvg: '🚀',
    renderSvg: (fills, onSectionClick) => (
      <g>
        {/* Space Background - Colourless canvas ready for player to color */}
        {createPart('space-bg', 'rect', { x: 2, y: 2, width: 796, height: 596, strokeWidth: 3 }, fills, onSectionClick)}

        {/* Moon */}
        {createPart('moon', 'circle', { cx: 120, cy: 120, r: 60 }, fills, onSectionClick)}
        {createPart('crater1', 'circle', { cx: 100, cy: 100, r: 12 }, fills, onSectionClick)}
        {createPart('crater2', 'circle', { cx: 135, cy: 130, r: 16 }, fills, onSectionClick)}
        {createPart('crater3', 'circle', { cx: 140, cy: 90, r: 8 }, fills, onSectionClick)}

        {/* Saturn Planet with Rings */}
        {createPart('planet-body', 'circle', { cx: 680, cy: 160, r: 50 }, fills, onSectionClick)}
        {createPart('planet-ring-back', 'ellipse', { cx: 680, cy: 160, rx: 85, ry: 22, transform: 'rotate(-25 680 160)' }, fills, onSectionClick)}
        
        {/* Stars */}
        {createPart('star1', 'polygon', { points: '300,70 306,85 322,85 309,95 314,110 300,100 286,110 291,95 278,85 294,85' }, fills, onSectionClick)}
        {createPart('star2', 'polygon', { points: '520,60 525,72 538,72 527,80 531,92 520,84 509,92 513,80 502,72 515,72' }, fills, onSectionClick)}
        {createPart('star3', 'polygon', { points: '720,440 726,455 742,455 729,465 734,480 720,470 706,480 711,465 698,455 714,455' }, fills, onSectionClick)}
        {createPart('star4', 'polygon', { points: '140,480 145,492 158,492 147,500 151,512 140,504 129,512 133,500 122,492 135,492' }, fills, onSectionClick)}

        {/* Rocket Thruster Flames */}
        {createPart('flame-outer', 'path', { d: 'M365,420 L400,530 L435,420 Z' }, fills, onSectionClick)}
        {createPart('flame-mid', 'path', { d: 'M375,420 L400,500 L425,420 Z' }, fills, onSectionClick)}
        {createPart('flame-inner', 'path', { d: 'M385,420 L400,470 L415,420 Z' }, fills, onSectionClick)}

        {/* Rocket Engine Nozzle */}
        {createPart('rocket-nozzle', 'polygon', { points: '360,420 375,400 425,400 440,420' }, fills, onSectionClick)}

        {/* Left and Right Rocket Fins */}
        {createPart('fin-left', 'path', { d: 'M340,320 L270,390 Q290,410 340,400 Z' }, fills, onSectionClick)}
        {createPart('fin-right', 'path', { d: 'M460,320 L530,390 Q510,410 460,400 Z' }, fills, onSectionClick)}

        {/* Rocket Fuselage Main Body */}
        {createPart('rocket-body', 'path', { d: 'M400,120 C450,200 470,320 460,400 L340,400 C330,320 350,200 400,120 Z' }, fills, onSectionClick)}
        
        {/* Rocket Nose Cone */}
        {createPart('rocket-nose', 'path', { d: 'M400,120 C425,160 440,190 445,210 L355,210 C360,190 375,160 400,120 Z' }, fills, onSectionClick)}

        {/* Porthole Window Outer Frame */}
        {createPart('window-frame', 'circle', { cx: 400, cy: 280, r: 45 }, fills, onSectionClick)}
        {createPart('window-glass', 'circle', { cx: 400, cy: 280, r: 35 }, fills, onSectionClick)}
        
        {/* Smiling Astronaut Puppy inside window - player can color face & ears! */}
        {createPart('astro-face', 'ellipse', { cx: 400, cy: 285, rx: 20, ry: 18 }, fills, onSectionClick)}
        {createPart('astro-ear-l', 'ellipse', { cx: 383, cy: 275, rx: 5, ry: 10 }, fills, onSectionClick)}
        {createPart('astro-ear-r', 'ellipse', { cx: 417, cy: 275, rx: 5, ry: 10 }, fills, onSectionClick)}
        {/* Eyes & Nose */}
        <circle cx="393" cy="283" r="3" fill="#1e293b" />
        <circle cx="407" cy="283" r="3" fill="#1e293b" />
        <ellipse cx="400" cy="288" rx="3" ry="2" fill="#1e293b" />
        <path d="M397,291 Q400,295 403,291" fill="none" stroke="#1e293b" strokeWidth="1.5" />

        {/* Cute Friendly Alien in UFO - player can color alien! */}
        {createPart('ufo-dome', 'path', { d: 'M230,320 C230,290 270,290 270,320 Z' }, fills, onSectionClick)}
        {createPart('alien-head', 'circle', { cx: 250, cy: 305, r: 8 }, fills, onSectionClick)}
        <circle cx="250" cy="303" r="3" fill="#1e293b" />
        <circle cx="251" cy="302" r="1" fill="#ffffff" />
        {createPart('ufo-saucer', 'ellipse', { cx: 250, cy: 325, rx: 35, ry: 10 }, fills, onSectionClick)}
        {createPart('ufo-light1', 'circle', { cx: 230, cy: 326, r: 3 }, fills, onSectionClick)}
        {createPart('ufo-light2', 'circle', { cx: 250, cy: 328, r: 3 }, fills, onSectionClick)}
        {createPart('ufo-light3', 'circle', { cx: 270, cy: 326, r: 3 }, fills, onSectionClick)}
      </g>
    ),
  },
  {
    id: 'unicorn',
    title: 'Magical Unicorn',
    category: 'fantasy',
    description: 'A magical unicorn with a rainbow mane, sparkling horn, and fluffy clouds!',
    viewBox: '0 0 800 600',
    thumbnailSvg: '🦄',
    renderSvg: (fills, onSectionClick) => (
      <g>
        {/* Sky Background - Colourless canvas */}
        {createPart('unicorn-sky', 'rect', { x: 2, y: 2, width: 796, height: 596, strokeWidth: 3 }, fills, onSectionClick)}

        {/* Rainbow Arches */}
        {createPart('rainbow-arch1', 'path', { d: 'M-20,380 A350,350 0 0,1 680,380 L650,380 A320,320 0 0,0 10,380 Z' }, fills, onSectionClick)}
        {createPart('rainbow-arch2', 'path', { d: 'M10,380 A320,320 0 0,1 650,380 L620,380 A290,290 0 0,0 40,380 Z' }, fills, onSectionClick)}
        {createPart('rainbow-arch3', 'path', { d: 'M40,380 A290,290 0 0,1 620,380 L590,380 A260,260 0 0,0 70,380 Z' }, fills, onSectionClick)}
        {createPart('rainbow-arch4', 'path', { d: 'M70,380 A260,260 0 0,1 590,380 L560,380 A230,230 0 0,0 100,380 Z' }, fills, onSectionClick)}
        {createPart('rainbow-arch5', 'path', { d: 'M100,380 A230,230 0 0,1 560,380 L530,380 A200,200 0 0,0 130,380 Z' }, fills, onSectionClick)}

        {/* Fluffy Clouds beneath rainbow */}
        {createPart('ucloud-left', 'path', { d: 'M-30,440 a40,40 0 0,1 70,-15 a50,50 0 0,1 80,10 a40,40 0 0,1 40,35 l-190,0 z' }, fills, onSectionClick)}
        {createPart('ucloud-right', 'path', { d: 'M520,440 a40,40 0 0,1 70,-15 a50,50 0 0,1 80,10 a40,40 0 0,1 40,35 l-190,0 z' }, fills, onSectionClick)}

        {/* Magical Stars floating */}
        {createPart('ustar1', 'polygon', { points: '180,100 185,115 200,115 188,125 192,140 180,130 168,140 172,125 160,115 175,115' }, fills, onSectionClick)}
        {createPart('ustar2', 'polygon', { points: '640,120 645,135 660,135 648,145 652,160 640,150 628,160 632,145 620,135 635,135' }, fills, onSectionClick)}
        {createPart('ustar3', 'polygon', { points: '540,70 544,82 556,82 546,90 550,102 540,94 530,102 534,90 524,82 536,82' }, fills, onSectionClick)}

        {/* Unicorn Horn */}
        {createPart('horn', 'polygon', { points: '345,180 320,80 370,165' }, fills, onSectionClick)}
        <line x1="337" y1="140" x2="355" y2="135" stroke="#1e293b" strokeWidth="2.5" />
        <line x1="332" y1="160" x2="362" y2="152" stroke="#1e293b" strokeWidth="2.5" />

        {/* Mane strands behind head */}
        {createPart('mane1', 'path', { d: 'M400,180 C440,160 480,200 450,250 C430,240 410,210 400,180 Z' }, fills, onSectionClick)}
        {createPart('mane2', 'path', { d: 'M420,240 C470,230 500,280 470,330 C450,310 430,270 420,240 Z' }, fills, onSectionClick)}
        {createPart('mane3', 'path', { d: 'M430,310 C490,300 510,360 470,410 C450,380 440,340 430,310 Z' }, fills, onSectionClick)}
        {createPart('mane4', 'path', { d: 'M420,380 C470,390 480,450 430,480 C420,440 420,410 420,380 Z' }, fills, onSectionClick)}

        {/* Unicorn Body & Legs */}
        {createPart('unicorn-body', 'path', { d: 'M340,340 C340,320 370,320 400,350 C460,350 560,360 580,430 C590,480 540,510 480,490 L340,490 Z' }, fills, onSectionClick)}
        {createPart('leg-front', 'path', { d: 'M340,480 L330,570 L370,570 L380,480 Z' }, fills, onSectionClick)}
        {createPart('hoof-front', 'rect', { x: 330, y: 550, width: 40, height: 20 }, fills, onSectionClick)}

        {createPart('leg-back', 'path', { d: 'M480,480 L470,570 L510,570 L520,480 Z' }, fills, onSectionClick)}
        {createPart('hoof-back', 'rect', { x: 470, y: 550, width: 40, height: 20 }, fills, onSectionClick)}

        {/* Fluffy Unicorn Tail */}
        {createPart('tail1', 'path', { d: 'M580,430 C640,420 670,470 650,520 C620,500 590,470 580,430 Z' }, fills, onSectionClick)}
        {createPart('tail2', 'path', { d: 'M590,460 C640,480 660,540 620,570 C600,530 590,490 590,460 Z' }, fills, onSectionClick)}

        {/* Unicorn Head & Neck */}
        {createPart('unicorn-neck', 'path', { d: 'M340,340 L350,240 L420,260 L400,380 Z' }, fills, onSectionClick)}
        {createPart('unicorn-head', 'path', { d: 'M380,180 C390,160 370,140 330,170 C280,170 230,220 230,250 C230,280 270,300 320,290 C360,280 390,240 380,180 Z' }, fills, onSectionClick)}

        {/* Unicorn Ear */}
        {createPart('unicorn-ear-outer', 'polygon', { points: '365,160 385,115 395,165' }, fills, onSectionClick)}
        {createPart('unicorn-ear-inner', 'polygon', { points: '372,155 385,125 390,158' }, fills, onSectionClick)}

        {/* Face details */}
        {/* Sleeping/Happy Curled Eye with Lashes */}
        <path d="M295,225 Q310,240 325,225" fill="none" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
        <line x1="300" y1="233" x2="294" y2="242" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        <line x1="310" y1="235" x2="310" y2="246" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        <line x1="320" y1="233" x2="326" y2="242" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />

        {/* Rosy Cheek */}
        {createPart('unicorn-cheek', 'circle', { cx: 325, cy: 260, r: 14 }, fills, onSectionClick)}
        
        {/* Cute Muzzle & Smile */}
        {createPart('unicorn-muzzle', 'path', { d: 'M230,250 C230,280 260,295 285,285 C275,265 260,245 230,250 Z' }, fills, onSectionClick)}
        <circle cx="245" cy="265" r="3" fill="#1e293b" />
        <path d="M245,275 Q255,285 265,275" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: 'sweets',
    title: 'Sweet Treats Party',
    category: 'treats',
    description: 'A towering ice cream cone, a frosted cupcake with sprinkles, and a sweet lollipop!',
    viewBox: '0 0 800 600',
    thumbnailSvg: '🍦',
    renderSvg: (fills, onSectionClick) => (
      <g>
        {/* Candy Party Background - Colourless canvas */}
        {createPart('sweets-bg', 'rect', { x: 2, y: 2, width: 796, height: 596, strokeWidth: 3 }, fills, onSectionClick)}
        
        {/* Candy Tablecloth / Shelf */}
        {createPart('tablecloth', 'rect', { x: 0, y: 480, width: 800, height: 120, strokeWidth: 3 }, fills, onSectionClick)}

        {/* Lollipop on the left */}
        {createPart('lollipop-stick', 'rect', { x: 140, y: 280, width: 14, height: 210, rx: 7 }, fills, onSectionClick)}
        {createPart('lollipop-outer', 'circle', { cx: 147, cy: 210, r: 70 }, fills, onSectionClick)}
        {createPart('lollipop-ring1', 'circle', { cx: 147, cy: 210, r: 50 }, fills, onSectionClick)}
        {createPart('lollipop-ring2', 'circle', { cx: 147, cy: 210, r: 30 }, fills, onSectionClick)}
        {createPart('lollipop-center', 'circle', { cx: 147, cy: 210, r: 14 }, fills, onSectionClick)}
        {/* Bow on stick */}
        {createPart('lollipop-bow-left', 'polygon', { points: '147,290 115,275 115,305' }, fills, onSectionClick)}
        {createPart('lollipop-bow-right', 'polygon', { points: '147,290 179,275 179,305' }, fills, onSectionClick)}
        {createPart('lollipop-bow-knot', 'circle', { cx: 147, cy: 290, r: 6 }, fills, onSectionClick)}

        {/* Center: Big Triple Ice Cream Cone */}
        {/* Waffle Cone */}
        {createPart('cone', 'polygon', { points: '330,340 400,530 470,340' }, fills, onSectionClick)}
        {/* Waffle Grid lines */}
        <line x1="350" y1="380" x2="445" y2="465" stroke="#1e293b" strokeWidth="2.5" />
        <line x1="375" y1="345" x2="425" y2="495" stroke="#1e293b" strokeWidth="2.5" />
        <line x1="450" y1="380" x2="355" y2="465" stroke="#1e293b" strokeWidth="2.5" />
        <line x1="425" y1="345" x2="375" y2="495" stroke="#1e293b" strokeWidth="2.5" />

        {/* Bottom Scoop */}
        {createPart('ice-scoop1', 'path', { d: 'M320,340 C320,270 480,270 480,340 Q450,360 400,345 Q350,360 320,340 Z' }, fills, onSectionClick)}
        {/* Middle Scoop */}
        {createPart('ice-scoop2', 'path', { d: 'M335,280 C335,210 465,210 465,280 Q430,300 400,285 Q370,300 335,280 Z' }, fills, onSectionClick)}
        {/* Top Scoop */}
        {createPart('ice-scoop3', 'path', { d: 'M350,220 C350,150 450,150 450,220 Q420,240 400,225 Q380,240 350,220 Z' }, fills, onSectionClick)}
        
        {/* Chocolate Sauce Drips on top scoop */}
        {createPart('chocolate-drip', 'path', { d: 'M355,185 C365,150 435,150 445,185 Q435,210 425,190 Q410,215 400,185 Q390,215 375,190 Q365,205 355,185 Z' }, fills, onSectionClick)}
        
        {/* Cherry on Top */}
        {createPart('cherry-stem', 'path', { d: 'M400,120 Q420,80 435,75' }, fills, onSectionClick)}
        {createPart('cherry', 'circle', { cx: 400, cy: 130, r: 20 }, fills, onSectionClick)}
        <circle cx="406" cy="124" r="5" fill="#FFFFFF" />

        {/* Sprinkles on Scoops */}
        {createPart('sprinkle1', 'rect', { x: 370, y: 250, width: 6, height: 16, rx: 3, transform: 'rotate(25 370 250)' }, fills, onSectionClick)}
        {createPart('sprinkle2', 'rect', { x: 420, y: 245, width: 6, height: 16, rx: 3, transform: 'rotate(-30 420 245)' }, fills, onSectionClick)}
        {createPart('sprinkle3', 'rect', { x: 395, y: 260, width: 6, height: 16, rx: 3, transform: 'rotate(70 395 260)' }, fills, onSectionClick)}

        {/* Right: Cupcake */}
        {/* Cupcake Wrapper */}
        {createPart('cupcake-wrapper', 'polygon', { points: '590,480 610,380 710,380 730,480' }, fills, onSectionClick)}
        <line x1="630" y1="380" x2="620" y2="480" stroke="#1e293b" strokeWidth="2.5" />
        <line x1="660" y1="380" x2="660" y2="480" stroke="#1e293b" strokeWidth="2.5" />
        <line x1="690" y1="380" x2="700" y2="480" stroke="#1e293b" strokeWidth="2.5" />

        {/* Cupcake Frosting Swirls */}
        {createPart('cupcake-frosting-bottom', 'path', { d: 'M595,390 C585,340 735,340 725,390 Z' }, fills, onSectionClick)}
        {createPart('cupcake-frosting-mid', 'path', { d: 'M615,350 C605,310 715,310 705,350 Z' }, fills, onSectionClick)}
        {createPart('cupcake-frosting-top', 'path', { d: 'M635,315 C635,270 685,270 685,315 Z' }, fills, onSectionClick)}
        
        {/* Candle & Flame on Cupcake */}
        {createPart('candle-stick', 'rect', { x: 655, y: 230, width: 10, height: 45, rx: 2 }, fills, onSectionClick)}
        {createPart('candle-flame', 'path', { d: 'M660,205 C650,220 655,230 660,230 C665,230 670,220 660,205 Z' }, fills, onSectionClick)}
        {createPart('candle-flame-inner', 'path', { d: 'M660,215 C655,223 658,228 660,228 C662,228 665,223 660,215 Z' }, fills, onSectionClick)}
      </g>
    ),
  },
  {
    id: 'puppy',
    title: 'Playful Puppy',
    category: 'animals',
    description: 'A cute puppy wagging its tail next to its food bowl and tennis ball!',
    viewBox: '0 0 800 600',
    thumbnailSvg: '🐶',
    renderSvg: (fills, onSectionClick) => (
      <g>
        {/* Sunny Yard Background - Colourless canvas */}
        {createPart('puppy-sky', 'rect', { x: 2, y: 2, width: 796, height: 596, strokeWidth: 3 }, fills, onSectionClick)}
        
        {/* Sunny background */}
        {createPart('puppy-sun', 'circle', { cx: 700, cy: 100, r: 45 }, fills, onSectionClick)}

        {/* Grass lawn */}
        {createPart('puppy-grass', 'path', { d: 'M-10,430 Q200,410 400,430 T810,420 L810,600 L-10,600 Z' }, fills, onSectionClick)}

        {/* Puppy Tail */}
        {createPart('puppy-tail', 'path', { d: 'M540,360 C600,320 640,260 620,230 C600,240 570,300 520,340 Z' }, fills, onSectionClick)}

        {/* Puppy Hind Leg */}
        {createPart('puppy-hind-leg', 'path', { d: 'M460,370 C510,380 540,430 520,490 C490,500 460,490 450,440 Z' }, fills, onSectionClick)}

        {/* Puppy Body */}
        {createPart('puppy-body', 'path', { d: 'M300,320 C300,280 460,270 510,330 C540,370 510,470 450,470 L340,470 C310,450 300,380 300,320 Z' }, fills, onSectionClick)}

        {/* Front Legs */}
        {createPart('puppy-front-left', 'path', { d: 'M330,420 L315,520 Q335,535 360,520 L370,430 Z' }, fills, onSectionClick)}
        {createPart('puppy-front-right', 'path', { d: 'M400,420 L395,520 Q415,535 440,520 L445,430 Z' }, fills, onSectionClick)}

        {/* Puppy Big Floppy Ears (Left & Right) */}
        {createPart('puppy-ear-left', 'path', { d: 'M230,190 C180,190 160,270 190,320 C210,310 230,260 240,210 Z' }, fills, onSectionClick)}
        {createPart('puppy-ear-right', 'path', { d: 'M360,190 C410,190 430,270 400,320 C380,310 360,260 350,210 Z' }, fills, onSectionClick)}

        {/* Puppy Head */}
        {createPart('puppy-head', 'circle', { cx: 295, cy: 230, r: 75 }, fills, onSectionClick)}

        {/* Eye Patch on Left Eye */}
        {createPart('puppy-eye-patch', 'path', { d: 'M240,210 C240,180 280,180 280,210 C280,240 240,240 240,210 Z' }, fills, onSectionClick)}

        {/* Eyes */}
        {createPart('puppy-eye-l', 'circle', { cx: 260, cy: 215, r: 12 }, fills, onSectionClick)}
        <circle cx="262" cy="215" r="6" fill="#1e293b" />
        <circle cx="264" cy="212" r="2" fill="#ffffff" />
        
        {createPart('puppy-eye-r', 'circle', { cx: 330, cy: 215, r: 12 }, fills, onSectionClick)}
        <circle cx="332" cy="215" r="6" fill="#1e293b" />
        <circle cx="334" cy="212" r="2" fill="#ffffff" />

        {/* Cheerful Puppy Snout & Tongue */}
        {createPart('puppy-snout', 'ellipse', { cx: 295, cy: 260, rx: 35, ry: 25 }, fills, onSectionClick)}
        {createPart('puppy-nose', 'ellipse', { cx: 295, cy: 250, rx: 12, ry: 9 }, fills, onSectionClick)}
        {/* Mouth & Tongue */}
        <path d="M285,263 Q295,273 305,263" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        {createPart('puppy-tongue', 'path', { d: 'M290,268 C290,290 305,290 305,268 Z' }, fills, onSectionClick)}

        {/* Collar & Bone Pendant */}
        {createPart('puppy-collar', 'path', { d: 'M250,300 Q295,325 340,300 L342,315 Q295,340 248,315 Z' }, fills, onSectionClick)}
        {createPart('puppy-bone-tag', 'ellipse', { cx: 295, cy: 335, rx: 12, ry: 6 }, fills, onSectionClick)}

        {/* Tennis Ball */}
        {createPart('tennis-ball', 'circle', { cx: 160, cy: 510, r: 28 }, fills, onSectionClick)}
        <path d="M142,492 Q160,510 178,492" fill="none" stroke="#1e293b" strokeWidth="3" />
        <path d="M142,528 Q160,510 178,528" fill="none" stroke="#1e293b" strokeWidth="3" />

        {/* Food Bowl */}
        {createPart('food-bowl', 'polygon', { points: '620,530 640,490 720,490 740,530' }, fills, onSectionClick)}
        {createPart('food-kibble', 'ellipse', { cx: 680, cy: 490, rx: 40, ry: 10 }, fills, onSectionClick)}
        <path d="M660,510 Q680,518 700,510" fill="none" stroke="#1e293b" strokeWidth="3" />

        {/* Flying Butterfly */}
        {createPart('butterfly-wing-tl', 'path', { d: 'M460,150 C480,120 510,130 500,160 Z' }, fills, onSectionClick)}
        {createPart('butterfly-wing-tr', 'path', { d: 'M510,160 C530,130 560,140 550,170 Z' }, fills, onSectionClick)}
        {createPart('butterfly-wing-bl', 'path', { d: 'M470,160 C485,175 500,175 495,160 Z' }, fills, onSectionClick)}
        {createPart('butterfly-wing-br', 'path', { d: 'M515,165 C530,180 545,180 540,165 Z' }, fills, onSectionClick)}
        <ellipse cx="505" cy="162" rx="4" ry="12" fill="#1e293b" />
      </g>
    ),
  },
  {
    id: 'blank',
    title: 'Free Draw Canvas',
    category: 'blank',
    description: 'A completely blank canvas to draw, paint, and stamp anything you can imagine!',
    viewBox: '0 0 800 600',
    thumbnailSvg: '🎨',
    renderSvg: (fills, onSectionClick) => (
      <g>
        {createPart('blank-canvas', 'rect', { x: 2, y: 2, width: 796, height: 596, strokeWidth: 3 }, fills, onSectionClick)}
        {/* Subtle playful border guide */}
        <rect x="15" y="15" width="770" height="570" rx="16" fill="none" stroke="#CBD5E1" strokeWidth="3" strokeDasharray="8 8" />
      </g>
    ),
  },
];
