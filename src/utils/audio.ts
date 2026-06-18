// Chinese Traditional Ink Web Audio Synthesizer & BGM Manager
// Provides 100% reliable, offline-capable, CORS-free traditional Chinese instrumental music.

export type InstrumentType = 'guzheng' | 'guqin' | 'flute' | 'star';

export interface ScoreNote {
  freq: number;
  duration: number; // relative beat length: 0.5, 1, 2
  tag: string;      // Chinese character or note name
}

export interface TraditionalSong {
  title: string;
  composer: string;
  description: string;
  bpm: number;
  notes: ScoreNote[];
}

// Famous frequencies in G/D/C Major Pentatonic layout
const D3 = 146.83;
const E3 = 164.81;
const G3 = 196.00;
const A3 = 220.00;
const B3 = 246.94;
const D4 = 293.66;
const E4 = 329.63;
const G4 = 392.00;
const A4 = 440.00;
const B4 = 493.88;
const D5 = 587.33;
const E5 = 659.25;
const G5 = 783.99;
const A5 = 880.00;
const B5 = 987.77;
const D6 = 1174.66;
const E6 = 1318.51;

export const TRADITIONAL_SONGS: TraditionalSong[] = [
  {
    title: "《茉莉花》",
    composer: "江苏民歌",
    description: "经典江南丝竹，曲调清新温婉，如茉莉盛开吐纳芬芳。",
    bpm: 76,
    notes: [
      { freq: B4, duration: 1, tag: "好" },
      { freq: B4, duration: 0.5, tag: "一" },
      { freq: D5, duration: 0.5, tag: "朵" },
      { freq: E5, duration: 1, tag: "美" },
      { freq: G5, duration: 1, tag: "丽" },
      { freq: G5, duration: 0.5, tag: "的" },
      { freq: E5, duration: 0.5, tag: "茉" },
      { freq: D5, duration: 1.5, tag: "莉" },
      { freq: E5, duration: 0.5, tag: "花" },
      
      { freq: B4, duration: 1, tag: "芬" },
      { freq: B4, duration: 0.5, tag: "芳" },
      { freq: D5, duration: 0.5, tag: "美" },
      { freq: E5, duration: 1, tag: "丽" },
      { freq: G5, duration: 1, tag: "满" },
      { freq: G5, duration: 0.5, tag: "枝" },
      { freq: E5, duration: 0.5, tag: "丫" },
      { freq: D5, duration: 2, tag: "呀" },

      { freq: D5, duration: 1, tag: "又" },
      { freq: D5, duration: 0.5, tag: "香" },
      { freq: B4, duration: 0.5, tag: "又" },
      { freq: D5, duration: 1, tag: "白" },
      { freq: E5, duration: 1, tag: "人" },
      { freq: G5, duration: 0.5, tag: "人" },
      { freq: E5, duration: 0.5, tag: "夸" },
      { freq: D5, duration: 1, tag: "自" },
      { freq: B4, duration: 1, tag: "在" },
      { freq: A4, duration: 2, tag: "心" },

      { freq: B4, duration: 1, tag: "让" },
      { freq: A4, duration: 0.5, tag: "我" },
      { freq: G4, duration: 0.5, tag: "来" },
      { freq: B4, duration: 1, tag: "将" },
      { freq: A4, duration: 1, tag: "你" },
      { freq: G4, duration: 0.5, tag: "摘" },
      { freq: A4, duration: 0.5, tag: "下" },
      { freq: B4, duration: 1, tag: "送" },
      { freq: D5, duration: 1, tag: "给" },
      { freq: E5, duration: 2, tag: "君" },

      { freq: A4, duration: 1, tag: "生" },
      { freq: B4, duration: 0.5, tag: "平" },
      { freq: D5, duration: 0.5, tag: "画" },
      { freq: A4, duration: 1, tag: "卷" },
      { freq: B4, duration: 1, tag: "香" },
      { freq: A4, duration: 0.5, tag: "万" },
      { freq: G4, duration: 0.5, tag: "千" },
      { freq: A4, duration: 1, tag: "重" },
      { freq: G4, duration: 2, tag: "家" }
    ]
  },
  {
    title: "《渔舟唱晚》",
    composer: "古琴/古筝名曲",
    description: "泛舟晚霞之中，夕阳斜照千顷秋水，渔人满载而归哼唱闲适乐章。",
    bpm: 66,
    notes: [
      { freq: D4, duration: 1.5, tag: "夕" },
      { freq: G4, duration: 0.5, tag: "照" },
      { freq: A4, duration: 1, tag: "红" },
      { freq: G4, duration: 1, tag: "晚" },
      { freq: B4, duration: 1, tag: "渔" },
      { freq: A4, duration: 1, tag: "歌" },
      { freq: D5, duration: 2, tag: "声" },

      { freq: E5, duration: 1.5, tag: "烟" },
      { freq: D5, duration: 0.5, tag: "波" },
      { freq: B4, duration: 1, tag: "起" },
      { freq: A4, duration: 1, tag: "轻" },
      { freq: G4, duration: 1, tag: "帆" },
      { freq: E4, duration: 1, tag: "江" },
      { freq: D4, duration: 2, tag: "天" },

      { freq: G4, duration: 1, tag: "惊" },
      { freq: B4, duration: 1, tag: "风" },
      { freq: A4, duration: 1.5, tag: "拂" },
      { freq: G4, duration: 0.5, tag: "琴" },
      { freq: D5, duration: 1, tag: "韵" },
      { freq: B4, duration: 1, tag: "满" },
      { freq: A4, duration: 2, tag: "袖" },

      { freq: G5, duration: 1, tag: "水" },
      { freq: E5, duration: 1, tag: "光" },
      { freq: D5, duration: 1.5, tag: "影" },
      { freq: B4, duration: 0.5, tag: "潋" },
      { freq: A4, duration: 1, tag: "滟" },
      { freq: G4, duration: 1, tag: "成" },
      { freq: G4, duration: 2, tag: "画" }
    ]
  },
  {
    title: "《高山流水》",
    composer: "伯牙古琴名曲",
    description: "巍巍乎志在高山，洋洋乎志在流水。知音千古，松风水月共流连。",
    bpm: 60,
    notes: [
      { freq: D3, duration: 1.5, tag: "巍" },
      { freq: G3, duration: 0.5, tag: "巍" },
      { freq: A3, duration: 1, tag: "古" },
      { freq: D4, duration: 1, tag: "山" },
      { freq: G4, duration: 1, tag: "入" },
      { freq: B4, duration: 1, tag: "星" },
      { freq: D5, duration: 2, tag: "汉" },

      { freq: E5, duration: 1.5, tag: "洋" },
      { freq: D5, duration: 0.5, tag: "洋" },
      { freq: B4, duration: 1, tag: "溪" },
      { freq: A4, duration: 1, tag: "流" },
      { freq: G4, duration: 1, tag: "赴" },
      { freq: E4, duration: 1, tag: "沧" },
      { freq: D4, duration: 2, tag: "静" },

      { freq: G4, duration: 1, tag: "知" },
      { freq: A4, duration: 1, tag: "音" },
      { freq: B4, duration: 1.5, tag: "万" },
      { freq: D5, duration: 0.5, tag: "古" },
      { freq: E5, duration: 1, tag: "琴" },
      { freq: G5, duration: 1, tag: "声" },
      { freq: A5, duration: 2, tag: "越" },

      { freq: G5, duration: 1, tag: "月" },
      { freq: E5, duration: 1, tag: "下" },
      { freq: D5, duration: 1.5, tag: "照" },
      { freq: B4, duration: 0.5, tag: "松" },
      { freq: A4, duration: 1, tag: "风" },
      { freq: G4, duration: 1, tag: "无" },
      { freq: G4, duration: 2, tag: "眠" }
    ]
  }
];

export class ChineseInkAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private delayNode: DelayNode | null = null;
  private feedbackNode: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private droneOscs: OscillatorNode[] = [];
  
  // State
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.4;
  private currentPreset: InstrumentType = 'guzheng';
  private autoPlayTimer: any = null;
  private lfoTimer: any = null;
  public onNotePlucked: ((note: string) => void) | null = null;
  public onSongNotePlayed: ((songTitle: string, noteTag: string, noteIdx: number) => void) | null = null;

  // Track sequencer settings
  private playMode: 'song' | 'ambient' = 'song';
  private currentSongIdx: number = 0;
  private currentNoteIdx: number = 0;

  // Pentatonic scale corresponding to traditional Chinese music (G Major / D Major Pentatonic)
  // Gong (宮), Shang (商), Jue (角), Zhi (徵), Yu (羽)
  private pentatonicScale = [
    146.83, // D3
    164.81, // E3
    196.00, // G3 (Zhi)
    220.00, // A3 (Yu)
    246.94, // B3
    293.66, // D4 (Gong)
    329.63, // E4 (Shang)
    392.00, // G4 (Zhi)
    440.00, // A4 (Yu)
    493.88, // B4
    587.33, // D5 (Gong)
    659.25, // E5 (Shang)
    783.99, // G5 (Zhi)
    880.00, // A5 (Yu)
    987.77, // B5
    1174.66, // D6
    1318.51  // E6
  ];

  constructor() {
    // Avoid immediate trigger to comply with browser autoplay policies
  }

  // Initialize Web Audio graph
  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      
      // Beautiful space echo effect for traditional cosmic water-ink style
      this.delayNode = this.ctx.createDelay(1.5);
      this.delayNode.delayTime.setValueAtTime(0.48, this.ctx.currentTime);
      
      this.feedbackNode = this.ctx.createGain();
      this.feedbackNode.gain.setValueAtTime(0.35, this.ctx.currentTime);
      
      // Warm room lowpass filter to darken echoes
      const delayFilter = this.ctx.createBiquadFilter();
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(1000, this.ctx.currentTime);

      // Connect Echo feedback loop
      this.delayNode.connect(delayFilter);
      delayFilter.connect(this.feedbackNode);
      this.feedbackNode.connect(this.delayNode);
      
      // Output paths
      this.masterGain.connect(this.ctx.destination);
      this.delayNode.connect(this.masterGain);
      
      // Setup background cosmic drone (soft atmospheric stream of air/wind)
      this.setupBackgroundDrone();
    } catch (e) {
      console.error('Failed to initialize traditional Chinese audio engine:', e);
    }
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.1);
    }
  }

  getVolume() {
    return this.volume;
  }

  getPlaying() {
    return this.isPlaying;
  }

  getMuted() {
    return this.isMuted;
  }

  getPreset() {
    return this.currentPreset;
  }

  setPreset(preset: InstrumentType) {
    this.currentPreset = preset;
    // Trigger instant beautiful welcoming note when changing presets
    if (this.isPlaying) {
      this.triggerIntroCascade(preset === 'guqin' ? 'low' : preset === 'flute' ? 'high' : 'medium');
    }
  }

  // Soft continuous background stream (like river or wind) to keep the atmosphere immersive
  private setupBackgroundDrone() {
    if (!this.ctx || !this.masterGain) return;
    
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.droneGain.connect(this.masterGain);

    // Dynamic drone with 3 extremely soft low frequency oscillators (tuned on low D and G)
    const baseFreqs = [73.42, 98.00, 146.83]; // D2, G2, D3 in pure tuning
    
    this.droneOscs = baseFreqs.map((freq, index) => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
      
      // Lowpass to keep it deep and muddy like river bottom
      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, this.ctx!.currentTime);

      const individualGain = this.ctx!.createGain();
      individualGain.gain.setValueAtTime(index === 0 ? 0.35 : 0.2, this.ctx!.currentTime);

      osc.connect(filter);
      filter.connect(individualGain);
      individualGain.connect(this.droneGain!);

      return osc;
    });

    this.droneOscs.forEach(o => o.start());

    // Gentle LFO filter sweeping to emulate wind / running water
    let filterSweepDir = 1;
    let currentFilterFreq = 180;
    this.lfoTimer = setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;
      currentFilterFreq += filterSweepDir * (1.5 + Math.random() * 2);
      if (currentFilterFreq > 240) filterSweepDir = -1;
      if (currentFilterFreq < 120) filterSweepDir = 1;
      // apply smoothly
      this.droneOscs.forEach((_, i) => {
        // Subtle drift
      });
    }, 150);
  }

  // Play a beautiful classic melody pluck
  pluck(freq: number, type: InstrumentType = 'guzheng', duration = 3.5, velocity = 1.0) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    // Call state callback to notify UI of notes being plucked (traditional pentatonic tags)
    if (this.onNotePlucked && type !== 'star') {
      let noteName = "宮 (Gong)";
      if (freq < 155 || (freq > 280 && freq < 310) || (freq > 560 && freq < 600) || (freq > 1100 && freq < 1200)) {
        noteName = "宮 (Gong)";
      } else if (freq < 175 || (freq > 310 && freq < 350) || (freq > 630 && freq < 680) || (freq > 1250 && freq < 1350)) {
        noteName = "商 (Shang)";
      } else if (freq < 205 || (freq > 370 && freq < 410) || (freq > 740 && freq < 810)) {
        noteName = "角 (Jue)";
      } else if (freq < 235 || (freq > 410 && freq < 460) || (freq > 820 && freq < 910)) {
        noteName = "徵 (Zhi)";
      } else {
        noteName = "羽 (Yu)";
      }
      this.onNotePlucked(noteName);
    }

    const now = this.ctx.currentTime;

    // Harmonic profile configs
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();

    const g1 = this.ctx.createGain();
    const g2 = this.ctx.createGain();
    const g3 = this.ctx.createGain();

    const filter = this.ctx.createBiquadFilter();
    const envelope = this.ctx.createGain();

    // Setup timbre based on traditional instrument styles
    if (type === 'guqin') {
      // Deep, solemn, resonant, woody sound
      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc3.type = 'triangle';

      g1.gain.setValueAtTime(0.65 * velocity, now);
      g2.gain.setValueAtTime(0.35 * velocity, now);
      g3.gain.setValueAtTime(0.12 * velocity, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(140, now + duration * 0.7);

      // Guqin pitch slide (the signature pressed glide technique)
      if (Math.random() > 0.4) {
        const slideRatio = Math.random() > 0.5 ? 1.0594 : 0.9438; // slide up/down a semitone
        osc1.frequency.setValueAtTime(freq, now);
        osc1.frequency.exponentialRampToValueAtTime(freq * slideRatio, now + 0.5);
      } else {
        osc1.frequency.setValueAtTime(freq, now);
      }
      osc2.frequency.setValueAtTime(freq * 2, now);
      osc3.frequency.setValueAtTime(freq * 3, now);

    } else if (type === 'flute') {
      // Soft, wind-muffled breeze
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc3.type = 'sine';

      g1.gain.setValueAtTime(0.7 * velocity, now);
      g2.gain.setValueAtTime(0.18 * velocity, now);
      g3.gain.setValueAtTime(0.06 * velocity, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      // Mild breath noise simulated with a slight frequency wobble (vibrato)
      const vibrato = this.ctx.createOscillator();
      const vibratoGain = this.ctx.createGain();
      vibrato.frequency.setValueAtTime(5.4 + Math.random() * 2, now); // 5.4 - 7.4 Hz
      vibratoGain.gain.setValueAtTime(freq * 0.012, now);

      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc1.frequency);
      
      vibrato.start(now);
      vibrato.stop(now + duration);

      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 2, now);
      osc3.frequency.setValueAtTime(freq * 3, now);

    } else if (type === 'star') {
      // Celestial starry chime glissando note
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc3.type = 'triangle';

      g1.gain.setValueAtTime(0.55 * velocity, now);
      g2.gain.setValueAtTime(0.4 * velocity, now);
      g3.gain.setValueAtTime(0.25 * velocity, now);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(400, now);

      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 2, now);
      osc3.frequency.setValueAtTime(freq * 4, now); // Double octave for sparkle

    } else {
      // Guzheng: Sharp, crisp pluck, with bright wooden resonance
      osc1.type = 'triangle';
      osc2.type = 'sawtooth';
      osc3.type = 'triangle';

      g1.gain.setValueAtTime(0.55 * velocity, now);
      g2.gain.setValueAtTime(0.18 * velocity, now); // small sawtooth harmonic
      g3.gain.setValueAtTime(0.15 * velocity, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2800, now);
      filter.frequency.exponentialRampToValueAtTime(280, now + 1.5);

      // Classic Guzheng pitch bend (upward pressing technique)
      if (Math.random() > 0.4) {
        osc1.frequency.setValueAtTime(freq, now);
        osc1.frequency.exponentialRampToValueAtTime(freq * 1.0594, now + 0.18); // slide up semitone
        osc1.frequency.linearRampToValueAtTime(freq, now + 0.45);
      } else {
        osc1.frequency.setValueAtTime(freq, now);
      }
      
      // Guzheng minor vibrato
      const vib = this.ctx.createOscillator();
      const vibGain = this.ctx.createGain();
      vib.frequency.setValueAtTime(6.2, now);
      vibGain.gain.setValueAtTime(freq * 0.006, now);
      vib.connect(vibGain);
      vibGain.connect(osc1.frequency);
      vib.start(now);
      vib.stop(now + duration);

      osc2.frequency.setValueAtTime(freq * 2, now);
      osc3.frequency.setValueAtTime(freq * 3, now);
    }

    // Envelope routing
    envelope.gain.setValueAtTime(0.0001, now);
    if (type === 'flute') {
      // Flute has a much softer, breathing attack
      envelope.gain.linearRampToValueAtTime(0.22 * velocity, now + 0.2);
      envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    } else {
      // String Guzheng/Guqin pluck: fast decay
      envelope.gain.linearRampToValueAtTime(0.35 * velocity, now + 0.015);
      envelope.gain.exponentialRampToValueAtTime(0.0005, now + duration);
    }

    // Connect nodes
    osc1.connect(g1);
    osc2.connect(g2);
    osc3.connect(g3);

    g1.connect(filter);
    g2.connect(filter);
    g3.connect(filter);

    filter.connect(envelope);
    envelope.connect(this.masterGain);
    
    // Inject into delayed space echo module
    if (this.delayNode) {
      envelope.connect(this.delayNode);
    }

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + duration + 0.2);
    osc2.stop(now + duration + 0.2);
    osc3.stop(now + duration + 0.2);
  }

  // Play a random beautiful note on the pentatonic scale
  playRandomPentatonic(type: InstrumentType = 'guzheng', octave: 'low' | 'medium' | 'high' = 'medium') {
    let minIdx = 5;
    let maxIdx = 11;
    if (octave === 'low') {
      minIdx = 0;
      maxIdx = 7;
    } else if (octave === 'high') {
      minIdx = 9;
      maxIdx = 16;
    }

    const idx = Math.floor(Math.random() * (maxIdx - minIdx + 1)) + minIdx;
    const freq = this.pentatonicScale[idx];
    this.pluck(freq, type);
  }

  // Beautiful cascade (Glissando) on opening/entering transitions!
  triggerOpeningCascade(poetStyle: 'drink' | 'gaze' | 'recite' | 'sniff' | 'sword') {
    this.init();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    
    // Different poets have different signature sonic profiles
    let scaleIndices: number[] = [];
    let instrument: InstrumentType = 'guzheng';
    let duration = 3.0;

    if (poetStyle === 'drink') { // Li Bai (Romantic, soaring, ascending Guzheng)
      scaleIndices = [5, 7, 8, 10, 12, 14]; 
      instrument = 'guzheng';
    } else if (poetStyle === 'gaze') { // Du Fu (Deep, solemn, slow Guqin chords)
      scaleIndices = [1, 3, 5, 6, 8];
      instrument = 'guqin';
    } else if (poetStyle === 'recite') { // Su Shi (Poetic, moderate traditional mix)
      scaleIndices = [4, 6, 7, 9, 11, 13];
      instrument = 'guzheng';
    } else if (poetStyle === 'sniff') { // Li Qingzhao (Delicate flute flutter & chime)
      scaleIndices = [10, 11, 13, 14, 15];
      instrument = 'flute';
    } else if (poetStyle === 'sword') { // Xin Qiji (Powerful, fast marching strings)
      scaleIndices = [2, 4, 5, 7, 8, 10];
      instrument = 'guqin';
    }

    // Play cascade progressively
    scaleIndices.forEach((scaleIdx, pitchIdx) => {
      const freq = this.pentatonicScale[scaleIdx];
      const timeOffset = pitchIdx * 0.12; 
      setTimeout(() => {
        if (!this.isPlaying) return;
        this.pluck(freq, instrument, duration, 0.9);
      }, timeOffset * 1000);
    });
  }

  triggerIntroCascade(octave: 'low' | 'medium' | 'high' = 'medium') {
    const list = octave === 'low' ? [0, 2, 4, 5] : octave === 'high' ? [10, 11, 13, 15] : [5, 7, 8, 10];
    list.forEach((idx, step) => {
      setTimeout(() => {
        if (!this.isPlaying) return;
        this.pluck(this.pentatonicScale[idx], this.currentPreset, 3.0, 0.7);
      }, step * 120);
    });
  }

  // Toggle play-state
  togglePlay() {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  getPlayMode() {
    return this.playMode;
  }

  setPlayMode(mode: 'song' | 'ambient') {
    this.playMode = mode;
    this.currentNoteIdx = 0;
    if (this.isPlaying) {
      this.stop();
      this.start();
    }
  }

  getCurrentSongIdx() {
    return this.currentSongIdx;
  }

  setCurrentSongIdx(idx: number) {
    this.currentSongIdx = (idx + TRADITIONAL_SONGS.length) % TRADITIONAL_SONGS.length;
    this.currentNoteIdx = 0;
    if (this.isPlaying) {
      this.stop();
      this.start();
    }
  }

  getCurrentSong() {
    return TRADITIONAL_SONGS[this.currentSongIdx];
  }

  getCurrentNoteIdx() {
    return this.currentNoteIdx;
  }

  start() {
    this.init();
    if (!this.ctx) return;
    
    this.isPlaying = true;

    // Fade-in continuous background drone smoothly
    if (this.droneGain) {
      this.droneGain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 1.2);
    }

    if (this.playMode === 'song') {
      const playNextSongNote = () => {
        if (!this.isPlaying) return;
        const song = TRADITIONAL_SONGS[this.currentSongIdx];
        if (!song || song.notes.length === 0) return;
        
        const note = song.notes[this.currentNoteIdx];
        if (!note) {
          this.currentNoteIdx = 0;
          playNextSongNote();
          return;
        }

        // Play primary melody note
        this.pluck(note.freq, this.currentPreset, note.duration * 3.5, 0.9);

        // Subtly play a lower octave harmony/chord on strong beats (the 1st or 3rd beat) to enrich the soundstage!
        if (this.currentNoteIdx % 4 === 0) {
          const lowFreq = note.freq / 2;
          if (lowFreq >= 110) {
            // Echo harmony
            setTimeout(() => {
              if (this.isPlaying) {
                // Keep the backup line extremely lush, either guqin or warm guzheng
                const accompanimentPreset = this.currentPreset === 'flute' ? 'guzheng' : 'guqin';
                this.pluck(lowFreq, accompanimentPreset, note.duration * 4.5, 0.45);
              }
            }, 60);
          }
        }

        // Call callback to notify UI the active character being sung
        if (this.onSongNotePlayed) {
          this.onSongNotePlayed(song.title, note.tag, this.currentNoteIdx);
        }

        // Calculate note duration in milliseconds based on Song BPM
        const beatMs = (60 / song.bpm) * 1000;
        const noteDelay = note.duration * beatMs;

        // Advance to next note
        this.currentNoteIdx = (this.currentNoteIdx + 1) % song.notes.length;
        
        this.autoPlayTimer = setTimeout(playNextSongNote, noteDelay);
      };

      // Trigger beautiful welcoming intro cascade, then start the song sequence
      this.triggerIntroCascade('medium');
      this.autoPlayTimer = setTimeout(() => {
        playNextSongNote();
      }, 1000);

    } else {
      // Ambient Random Plucking Mode
      this.triggerIntroCascade('medium');

      const scheduleNextNote = () => {
        if (!this.isPlaying) return;
        
        const nextDelay = 1800 + Math.random() * 3200; // random 1.8s - 5.0s
        this.autoPlayTimer = setTimeout(() => {
          if (this.isPlaying) {
            // 40% chance of dual notes
            this.playRandomPentatonic(this.currentPreset, Math.random() > 0.6 ? 'low' : 'medium');
            if (this.onSongNotePlayed) {
              this.onSongNotePlayed("星海幽居 (雨林风弦)", "✨", -1);
            }
            if (Math.random() > 0.65) {
              setTimeout(() => {
                if (this.isPlaying) this.playRandomPentatonic(this.currentPreset, 'high');
              }, 350);
            }
            scheduleNextNote();
          }
        }, nextDelay);
      };

      scheduleNextNote();
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.autoPlayTimer) {
      clearTimeout(this.autoPlayTimer);
      this.autoPlayTimer = null;
    }
    // Fade-out continuous background drone
    if (this.ctx && this.droneGain) {
      this.droneGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
    }
  }

  // Cleanup references
  destroy() {
    this.stop();
    if (this.lfoTimer) {
      clearInterval(this.lfoTimer);
    }
    this.droneOscs.forEach(o => {
      try { o.stop(); } catch(e) {}
    });
    this.droneOscs = [];
  }
}

// Single ambient shared instance
export const inkAudio = new ChineseInkAudioEngine();
