/* スゴロクタワー サウンドモジュール
 * Web Audio API だけで手続き的に音を鳴らす自己完結モジュール。
 * 外部ファイル・ライブラリ一切なし。window.GTAudio に契約どおりのAPIを公開する。
 */
(function () {
  'use strict';

  // ---- 内部状態 -------------------------------------------------------------
  var ctx = null;          // AudioContext（init まで null）
  var master = null;       // マスターゲイン（ミュート制御）
  var bgmGain = null;      // BGM用バス（setBgmVol）
  var sfxGain = null;      // 効果音用バス（setSfxVol）
  var noiseBuf = null;     // 効果音で使い回す固定ノイズ
  var started = false;     // init 済みかどうか

  var bgmVol = 1;          // BGM倍率 0..3
  var sfxVol = 1;          // 効果音倍率 0..3
  var muted = false;

  var BGM_BASE = 0.22;     // BGMの標準ゲイン（倍率1のとき）
  var SFX_BASE = 0.55;     // 効果音の標準ゲイン（倍率1のとき）

  var LOOKAHEAD = 0.12;    // 先読みスケジュール秒
  var TIMER_MS = 25;       // スケジューラ間隔

  var track = null;        // 再生中のBGMトラック

  // ---- 小道具 ---------------------------------------------------------------
  // MIDIノート番号 → 周波数
  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function clampMult(v) {
    v = +v;
    if (isNaN(v)) v = 1;
    return Math.max(0, Math.min(3, v));
  }

  // 現在のバス音量を反映
  function applyBgmVol() { if (bgmGain) bgmGain.gain.value = BGM_BASE * bgmVol; }
  function applySfxVol() { if (sfxGain) sfxGain.gain.value = SFX_BASE * sfxVol; }
  function applyMute() { if (master) master.gain.value = muted ? 0 : 1; }

  // ノイズ用バッファを一度だけ生成
  function makeNoise() {
    var len = ctx.sampleRate * 1.0;
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  // ==========================================================================
  // BGM エンジン
  // ==========================================================================

  // 1音を鳴らす（トラックのバスへ。wet=true でディレイにも送る）
  function voice(tr, time, midi, dur, type, level, wet) {
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = type;
    o.frequency.value = mtof(midi);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(level, time + Math.min(0.03, dur * 0.3));
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    o.connect(g);
    g.connect(tr.gain);
    if (wet) g.connect(tr.delay);
    o.start(time);
    o.stop(time + dur + 0.03);
  }

  // 和音（トラック単位、小節頭に持続で鳴らすパッド）
  function pad(tr, time, chord, dur, type, level) {
    for (var i = 0; i < chord.length; i++) {
      voice(tr, time, chord[i], dur, type, level, true);
    }
  }

  // --- 各BGMのステップ関数（step: 16分音符単位） ---------------------------

  // タイトル：少し長く壮大な冒険の始まり（Cメジャー・8小節）
  var TITLE_CH = [
    [48, 55, 64], [43, 55, 62], [45, 57, 64], [41, 53, 60],
    [48, 55, 64], [43, 55, 62], [41, 53, 60], [43, 55, 62]
  ];
  function stepTitle(tr, step, t) {
    var bar = Math.floor(step / 16) % 8;
    var p = step % 16;
    var ch = TITLE_CH[bar];
    if (p === 0) pad(tr, t, ch, 2.0, 'triangle', 0.10);           // パッド
    if (p === 0 || p === 8) voice(tr, t, ch[0] - 12, 0.5, 'sine', 0.22, false); // ベース
    if (p === 4 || p === 12) voice(tr, t, ch[1] - 12, 0.4, 'sine', 0.16, false);
    if (p % 2 === 0) {                                            // 上昇アルペジオ
      var arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 12];
      voice(tr, t, arp[(p / 2) % 4], 0.28, 'triangle', 0.11, true);
    }
  }

  // キャンペーン：登坂の緊張感（Aマイナー・駆動ベース・4小節）
  var CAMP_CH = [
    [45, 52, 60], [41, 48, 57], [43, 50, 59], [40, 47, 56]
  ];
  function stepCampaign(tr, step, t) {
    var bar = Math.floor(step / 16) % 4;
    var p = step % 16;
    var ch = CAMP_CH[bar];
    if (p === 0) pad(tr, t, ch, 1.6, 'sawtooth', 0.05);          // 薄いパッド
    if (p % 2 === 0) voice(tr, t, ch[0] - 12, 0.22, 'square', 0.16, false); // 8分の駆動ベース
    // 16分の上昇アルペジオ（緊張）
    var arp = [ch[0], ch[1], ch[2], ch[1]];
    voice(tr, t, arp[p % 4] + 12, 0.16, 'sawtooth', 0.07, true);
  }

  // フレンズ：楽しくポップ（Cメジャー・跳ねるベース・4小節）
  var FRND_CH = [
    [48, 55, 64], [45, 52, 60], [41, 53, 60], [43, 55, 62]
  ];
  function stepFriends(tr, step, t) {
    var bar = Math.floor(step / 16) % 4;
    var p = step % 16;
    var ch = FRND_CH[bar];
    if (p === 0) pad(tr, t, ch, 1.4, 'triangle', 0.07);
    // 跳ねるベース（表拍で根音、裏でオクターブ上）
    if (p % 4 === 0) voice(tr, t, ch[0] - 12, 0.2, 'square', 0.18, false);
    else if (p % 4 === 2) voice(tr, t, ch[0], 0.16, 'square', 0.12, false);
    // 明るいプラック・メロディ
    if (p % 2 === 0) {
      var mel = [ch[2] + 12, ch[1] + 12, ch[2] + 12, ch[0] + 24, ch[2] + 12, ch[1] + 12, ch[0] + 12, ch[2] + 12];
      voice(tr, t, mel[(p / 2) % 8], 0.18, 'square', 0.10, true);
    }
  }

  // ソロ：静かで淡々と上る（Aマイナー・希薄・4小節）
  var SOLO_CH = [
    [45, 52, 57], [40, 47, 52], [43, 50, 55], [41, 48, 53]
  ];
  function stepSolo(tr, step, t) {
    var bar = Math.floor(step / 16) % 4;
    var p = step % 16;
    var ch = SOLO_CH[bar];
    if (p === 0) pad(tr, t, ch, 3.2, 'sine', 0.09);              // ゆったりパッド
    // 1拍に1音の緩い上昇アルペジオ
    if (p % 4 === 0) {
      var arp = [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[1] + 12];
      voice(tr, t, arp[(p / 4) % 4], 1.0, 'sine', 0.12, true);
    }
  }

  // BGM定義（bpm・小節数・ステップ関数）
  var BGM = {
    title:    { bpm: 92,  bars: 8, step: stepTitle },
    campaign: { bpm: 122, bars: 4, step: stepCampaign },
    friends:  { bpm: 128, bars: 4, step: stepFriends },
    solo:     { bpm: 74,  bars: 4, step: stepSolo }
  };

  // トラックを作る（ディレイ付きのバスと専用スケジューラ）
  function makeTrack(key) {
    var cfg = BGM[key];
    var g = ctx.createGain();
    g.gain.value = 1;
    g.connect(bgmGain);

    // ゆるいディレイ（残響感）
    var delay = ctx.createDelay(1.0);
    delay.delayTime.value = 60 / cfg.bpm * 0.75; // 付点8分ディレイ
    var fb = ctx.createGain();
    fb.gain.value = 0.25;
    var wet = ctx.createGain();
    wet.gain.value = 0.5;
    delay.connect(fb); fb.connect(delay);        // フィードバックループ
    delay.connect(wet); wet.connect(g);

    return {
      key: key, cfg: cfg, gain: g, delay: delay,
      step: 0,
      totalSteps: cfg.bars * 16,
      stepDur: 60 / cfg.bpm / 4,                  // 16分音符の秒数
      nextTime: ctx.currentTime + 0.06,
      timer: null
    };
  }

  // 先読みスケジューラ
  function tick(tr) {
    var horizon = ctx.currentTime + LOOKAHEAD;
    while (tr.nextTime < horizon) {
      tr.cfg.step(tr, tr.step, tr.nextTime);
      tr.step = (tr.step + 1) % tr.totalSteps;
      tr.nextTime += tr.stepDur;                  // ループは加算のみ＝シームレス
    }
  }

  function startTrack(key) {
    var tr = makeTrack(key);
    tr.gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    tr.gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.3); // フェードイン
    tr.timer = setInterval(function () { tick(tr); }, TIMER_MS);
    tick(tr);
    track = tr;
  }

  // トラックを短くフェードアウトして破棄
  function fadeOutTrack(tr) {
    if (!tr) return;
    var now = ctx.currentTime;
    try {
      tr.gain.gain.cancelScheduledValues(now);
      tr.gain.gain.setValueAtTime(tr.gain.gain.value, now);
      tr.gain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
    } catch (e) {}
    setTimeout(function () {
      if (tr.timer) { clearInterval(tr.timer); tr.timer = null; }
      try { tr.gain.disconnect(); tr.delay.disconnect(); } catch (e) {}
    }, 400);
  }

  // ==========================================================================
  // 効果音（一発もの・オーディオ時刻でスケジュール）
  // ==========================================================================

  // 単音（type・音量・任意のポルタメント先）
  function tone(t, freq, dur, type, level, slideTo) {
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(level, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(sfxGain);
    o.start(t); o.stop(t + dur + 0.03);
  }

  // ノイズ（打撃・スウィッシュ用）
  function noise(t, dur, level, freq, hp) {
    var src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    var f = ctx.createBiquadFilter();
    f.type = hp ? 'highpass' : 'lowpass';
    f.frequency.value = freq;
    var g = ctx.createGain();
    g.gain.setValueAtTime(level, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(sfxGain);
    src.start(t); src.stop(t + dur + 0.03);
  }

  // 効果音テーブル（t0 = 開始時刻）
  var SFX = {
    // ルーレット回転：上昇するウィーン音
    spin: function (t) {
      tone(t, 300, 0.35, 'square', 0.22, 900);
    },
    // 停止：短いカチッ
    tick: function (t) {
      noise(t, 0.04, 0.5, 3000, true);
      tone(t, 1400, 0.05, 'square', 0.14);
    },
    // 1マス移動：やわらかいポン
    move: function (t) {
      tone(t, 660, 0.09, 'triangle', 0.3);
    },
    // コイン：定番の2音上昇
    coin: function (t) {
      tone(t, 988, 0.08, 'square', 0.32);
      tone(t + 0.07, 1319, 0.16, 'square', 0.3);
    },
    // ダイヤ：きらめく上昇アルペジオ＋スパークル
    diamond: function (t) {
      var n = [1047, 1319, 1568, 2093];
      for (var i = 0; i < n.length; i++) tone(t + i * 0.05, n[i], 0.2, 'triangle', 0.24);
      noise(t + 0.18, 0.12, 0.18, 5000, true);
    },
    // カード：紙をめくるスウィッシュ
    card: function (t) {
      noise(t, 0.16, 0.4, 2600, false);
      tone(t, 800, 0.14, 'sine', 0.1, 400);
    },
    // バトル開始：迫り上がる緊迫のヒット
    battleStart: function (t) {
      tone(t, 110, 0.32, 'sawtooth', 0.28, 220);
      tone(t + 0.08, mtof(45), 0.4, 'sawtooth', 0.2);   // A2
      tone(t + 0.08, mtof(52), 0.4, 'sawtooth', 0.2);   // E3（5度）
    },
    // 勝利：明るい上昇トライアド
    win: function (t) {
      var n = [523, 659, 784, 1047];
      for (var i = 0; i < n.length; i++) tone(t + i * 0.09, n[i], 0.24, 'square', 0.26);
    },
    // 敗北：しょんぼり下降
    lose: function (t) {
      var n = [523, 466, 392, 330];
      for (var i = 0; i < n.length; i++) tone(t + i * 0.12, n[i], 0.3, 'sawtooth', 0.22);
    },
    // ワープ：ぐにゃりと下降スウィープ
    warp: function (t) {
      tone(t, 1200, 0.4, 'square', 0.24, 150);
      noise(t + 0.05, 0.3, 0.12, 1800, false);
    },
    // クリアのファンファーレ：少し長めのお祝い
    goal: function (t) {
      // 上昇ラン
      var run = [523, 587, 659, 784];
      for (var i = 0; i < run.length; i++) tone(t + i * 0.1, run[i], 0.18, 'square', 0.24);
      // 締めの和音（C6）
      var end = t + 0.45;
      [1047, 1319, 1568].forEach(function (f) { tone(end, f, 0.7, 'triangle', 0.2); });
      tone(end, 523, 0.7, 'square', 0.16);
    },
    // UIボタン：短いカチッ
    button: function (t) {
      tone(t, 880, 0.05, 'triangle', 0.3);
    }
  };

  // ==========================================================================
  // 公開API
  // ==========================================================================

  var GTAudio = {
    // AudioContextを作る/resumeする（ユーザー操作から呼ぶ・複数回安全）
    init: function () {
      try {
        if (!ctx) {
          var AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return;
          ctx = new AC();
          master = ctx.createGain();
          bgmGain = ctx.createGain();
          sfxGain = ctx.createGain();
          bgmGain.connect(master);
          sfxGain.connect(master);
          master.connect(ctx.destination);
          noiseBuf = makeNoise();
          applyBgmVol();
          applySfxVol();
          applyMute();
          started = true;
        }
        if (ctx.state === 'suspended') ctx.resume();
      } catch (e) { /* 失敗しても黙って無効化 */ }
    },

    // ループBGM開始（前のBGMは短くクロスフェード）
    playBGM: function (key) {
      if (!started || !ctx || !BGM[key]) return;
      if (track && track.key === key) return;   // 同じ曲なら継続
      if (track) fadeOutTrack(track);
      startTrack(key);
    },

    // BGM停止
    stopBGM: function () {
      if (!started) return;
      if (track) { fadeOutTrack(track); track = null; }
    },

    // 効果音を一発
    sfx: function (key) {
      if (!started || !ctx || !SFX[key]) return;
      SFX[key](ctx.currentTime + 0.001);
    },

    // BGM音量（0..3・即時反映）
    setBgmVol: function (mult) { bgmVol = clampMult(mult); applyBgmVol(); },

    // 効果音音量（0..3・即時反映）
    setSfxVol: function (mult) { sfxVol = clampMult(mult); applySfxVol(); },

    // ミュート切替（任意）
    setMuted: function (b) { muted = !!b; applyMute(); }
  };

  window.GTAudio = GTAudio;
})();
