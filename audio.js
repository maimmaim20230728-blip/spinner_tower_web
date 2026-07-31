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

  // 🔴BGMが効果音に比べて小さすぎたため 0.22 → 0.45 へ引き上げ（2026-07-30ヒロ指摘・約2倍）
  var BGM_BASE = 0.45;     // BGMの標準ゲイン（倍率1のとき）
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

  // 音程が動く1音（水滴の跳ね上がり・太鼓の落ち込みなど）
  function glide(tr, time, midiFrom, midiTo, dur, type, level, wet) {
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(mtof(midiFrom), time);
    o.frequency.exponentialRampToValueAtTime(mtof(midiTo), time + dur);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(level, time + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    o.connect(g);
    g.connect(tr.gain);
    if (wet) g.connect(tr.delay);
    o.start(time);
    o.stop(time + dur + 0.03);
  }

  // 鐘・グロッケン風（基音＋高い倍音の2音だけで金属質を出す）
  function bell(tr, time, midi, dur, level) {
    voice(tr, time, midi, dur, 'sine', level, true);
    voice(tr, time, midi + 19, dur * 0.5, 'sine', level * 0.4, true);
  }

  // BGM用の打点ノイズ。効果音の noise() はSFXバス直結なのでBGMには使えない＝こちらはトラックのバスへ。
  function perc(tr, time, dur, level, freq, hp) {
    var src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    var f = ctx.createBiquadFilter();
    f.type = hp ? 'highpass' : 'lowpass';
    f.frequency.value = freq == null ? 1800 : freq;
    var g = ctx.createGain();
    g.gain.setValueAtTime(level, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    src.connect(f); f.connect(g); g.connect(tr.gain);
    src.start(time); src.stop(time + dur + 0.03);
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

  // --- 塔のスキン別BGM（tower_*） ------------------------------------------

  // 石の塔：どっしり重厚。低い5度パッド＋ゆっくりした鐘（Dマイナー・4小節）
  var STONE_CH = [
    [38, 45, 50], [36, 43, 48], [34, 41, 46], [36, 43, 48]
  ];
  function stepTowerStone(tr, step, t) {
    var bar = Math.floor(step / 16) % 4;
    var p = step % 16;
    var ch = STONE_CH[bar];
    if (p === 0) pad(tr, t, ch, 4.6, 'triangle', 0.09);            // 小節をまたぐ重いパッド
    if (p === 0 || p === 8) voice(tr, t, ch[0], 0.8, 'sine', 0.20, false); // 石を踏む鈍い拍
    if (p === 8) voice(tr, t, ch[1], 0.7, 'triangle', 0.05, false); // 堅い軋み
    // 2小節に1度だけ鳴る鐘
    if (p === 0 && bar % 2 === 0) bell(tr, t, (bar === 0 ? ch[2] : ch[1]) + 12, 3.0, 0.10);
  }

  // レンガの塔：温かみのある中世風。素朴な行進（Dドリアン・4小節）
  var BRICK_CH = [
    [50, 53, 57], [48, 52, 55], [53, 57, 60], [55, 59, 62]
  ];
  var BRICK_MEL = [                                                // 8分音符8つ（0＝休符）
    [69, 0, 67, 65, 62, 0, 65, 67],
    [64, 0, 67, 0, 64, 62, 60, 0],
    [65, 0, 69, 0, 72, 69, 65, 0],
    [67, 0, 71, 69, 67, 0, 62, 0]
  ];
  function stepTowerBrick(tr, step, t) {
    var bar = Math.floor(step / 16) % 4;
    var p = step % 16;
    var ch = BRICK_CH[bar];
    if (p === 0 || p === 8) pad(tr, t, ch, 0.5, 'triangle', 0.06); // 短く刻む和音＝行進感
    // 4分の行進ベース（根音と5度を交互に）
    if (p % 4 === 0) voice(tr, t, ((p / 4) % 2 === 0 ? ch[0] : ch[2]) - 12, 0.24, 'square', 0.16, false);
    // 素朴な笛のメロディ
    if (p % 2 === 0) {
      var n = BRICK_MEL[bar][p / 2];
      if (n) voice(tr, t, n, 0.22, 'triangle', 0.11, true);
    }
  }

  // 苔むす古塔：しっとり静か。柔らかいパッドと水滴（Aマイナー・4小節）
  var MOSS_CH = [
    [45, 52, 57], [43, 50, 55], [41, 48, 55], [40, 47, 52]
  ];
  var MOSS_DROP = [[3, 11], [6], [2, 9, 13], [7]];                 // 水滴が落ちる位置（不揃い）
  var MOSS_PENT = [76, 79, 81, 84, 79];                            // 水滴の音（ペンタトニック）
  function stepTowerMoss(tr, step, t) {
    var bar = Math.floor(step / 16) % 4;
    var p = step % 16;
    var ch = MOSS_CH[bar];
    if (p === 0) pad(tr, t, ch, 4.4, 'sine', 0.10);                // 湿った空気のパッド
    if (p === 8) voice(tr, t, ch[1], 2.0, 'sine', 0.05, true);     // かすかな揺らぎ
    if (MOSS_DROP[bar].indexOf(p) >= 0) {                          // 水滴（跳ね上がる単音）
      var n = MOSS_PENT[(bar + p) % MOSS_PENT.length];
      glide(tr, t, n - 5, n, 0.22, 'sine', 0.10, true);
    }
  }

  // 砂の遺跡：乾いた異国情緒。ハーモニックマイナー＋太鼓（Aハーモニックマイナー・4小節）
  var SAND_CH = [
    [45, 52, 57], [45, 52, 60], [45, 53, 57], [45, 52, 56]
  ];
  var SAND_TEK = [3, 6, 11, 14];                                   // 高い打点（3-3-2系）
  var SAND_MEL = [
    [69, 71, 72, 0, 74, 72, 71, 0],
    [72, 0, 74, 76, 77, 76, 74, 0],
    [77, 0, 76, 77, 80, 0, 77, 76],
    [74, 72, 71, 0, 69, 0, 68, 0]
  ];
  function stepTowerSand(tr, step, t) {
    var bar = Math.floor(step / 16) % 4;
    var p = step % 16;
    var ch = SAND_CH[bar];
    if (p === 0) pad(tr, t, ch, 2.3, 'triangle', 0.05);            // 薄いドローン
    if (p === 0 || p === 8) glide(tr, t, 45, 33, 0.18, 'sine', 0.28, false);          // 低い太鼓
    else if (SAND_TEK.indexOf(p) >= 0) glide(tr, t, 72, 60, 0.07, 'triangle', 0.15, false); // 乾いた高音
    if (p % 2 === 0) {                                             // エキゾチックな旋律
      var n = SAND_MEL[bar][p / 2];
      if (n) voice(tr, t, n, 0.16, 'square', 0.09, true);
    }
  }

  // 蒼氷の塔：澄んで冷たい。高音のベルと長いディレイ（Eメジャー・4小節）
  var ICE_CH = [
    [52, 59, 64], [54, 61, 66], [56, 63, 68], [49, 56, 61]
  ];
  var ICE_MEL = [
    [88, 0, 83, 0, 85, 0, 0, 80],
    [85, 0, 80, 0, 83, 0, 78, 0],
    [80, 0, 83, 0, 88, 0, 0, 85],
    [83, 0, 78, 0, 76, 0, 0, 83]
  ];
  function stepTowerIce(tr, step, t) {
    var bar = Math.floor(step / 16) % 4;
    var p = step % 16;
    var ch = ICE_CH[bar];
    if (p === 0) pad(tr, t, ch, 3.0, 'sine', 0.07);                // 広がるパッド
    if (p === 0) voice(tr, t, ch[0] - 12, 1.4, 'sine', 0.11, false); // 冷たい低音
    if (p % 4 === 2) voice(tr, t, ch[2] + 24, 0.12, 'sine', 0.04, true); // かすかな霜のきらめき
    if (p % 2 === 0) {                                             // グロッケン風の主旋律
      var n = ICE_MEL[bar][p / 2];
      if (n) bell(tr, t, n, 0.9, 0.08);
    }
  }

  // --- 特殊塔のBGM（tower_gold / card / trick / battle） --------------------

  // ゴールドタワー：宝物庫のきらめき。高音のベルが主役＋堅実なベース（Cメジャー・4小節）
  var GOLD_CH = [
    [48, 55, 64], [45, 52, 64], [41, 53, 60], [43, 55, 62]
  ];
  var GOLD_MEL = [                                                 // 8分音符8つ（0＝休符）
    [72, 0, 76, 0, 79, 0, 84, 79],
    [81, 0, 76, 0, 72, 0, 76, 0],
    [77, 0, 81, 0, 84, 0, 81, 77],
    [79, 0, 83, 0, 86, 0, 83, 79]
  ];
  function stepTowerGold(tr, step, t) {
    var bar = Math.floor(step / 16) % 4;
    var p = step % 16;
    var ch = GOLD_CH[bar];
    if (p === 0) pad(tr, t, ch, 2.4, 'triangle', 0.06);            // 明るく広いパッド
    // 4分の堅実なベース（根音と5度を行き来する）
    if (p % 4 === 0) voice(tr, t, (p / 4) % 2 === 0 ? ch[0] : ch[1], 0.30, 'square', 0.16, false);
    if (p % 8 === 4) perc(tr, t, 0.05, 0.05, 6000, true);          // 金貨がこすれる細かい輝き
    if (p % 2 === 0) {                                             // 主役のベル
      var n = GOLD_MEL[bar][p / 2];
      if (n) bell(tr, t, n, 0.8, 0.10);
    }
  }

  // カードタワー：神秘的な魔術の館。ハープ風の下降アルペジオ＋薄いパッド（Eマイナー・4小節）
  var CARD_CH = [
    [40, 47, 55], [36, 43, 52], [45, 52, 60], [47, 54, 63]
  ];
  var CARD_ARP = [                                                 // 8分音符8つ・上からこぼれ落ちる
    [79, 76, 71, 67, 64, 59, 55, 52],
    [79, 76, 72, 67, 64, 60, 55, 52],
    [81, 76, 72, 69, 64, 60, 57, 52],
    [78, 75, 71, 69, 66, 63, 59, 54]
  ];
  function stepTowerCard(tr, step, t) {
    var bar = Math.floor(step / 16) % 4;
    var p = step % 16;
    var ch = CARD_CH[bar];
    if (p === 0) pad(tr, t, ch, 3.4, 'sine', 0.06);                // 霧のような薄いパッド
    if (p === 0) voice(tr, t, ch[0], 1.8, 'sine', 0.13, false);    // 静かな低音
    if (p === 8) voice(tr, t, ch[1], 0.9, 'triangle', 0.04, true); // 中音のかすかな返し
    // ハープ風の下降アルペジオ（短く弾いて余韻はディレイに預ける）
    if (p % 2 === 0) voice(tr, t, CARD_ARP[bar][p / 2], 0.26, 'triangle', 0.08, true);
    // 2小節に1度、めくれたカードのような鐘
    if (p === 14 && bar % 2 === 1) bell(tr, t, ch[2] + 24, 1.6, 0.07);
  }

  // トリックタワー：奇術とサーカス。跳ねるスタッカートと半音の悪戯（Aマイナー・4小節）
  var TRICK_CH = [
    [45, 52, 60], [40, 50, 56], [38, 45, 53], [40, 50, 56]
  ];
  var TRICK_MEL = [                                                // 8分音符8つ（0＝休符）
    [69, 71, 72, 71, 69, 68, 69, 0],
    [68, 69, 70, 71, 72, 71, 70, 68],
    [74, 73, 72, 71, 70, 69, 68, 69],
    [71, 0, 68, 0, 71, 72, 71, 68]
  ];
  function stepTowerTrick(tr, step, t) {
    var bar = Math.floor(step / 16) % 4;
    var p = step % 16;
    var ch = TRICK_CH[bar];
    // ウンパ伴奏（表拍に低音・裏拍に和音の切り込み）
    if (p % 4 === 0) voice(tr, t, ch[0], 0.12, 'square', 0.16, false);
    else if (p % 4 === 2) {
      voice(tr, t, ch[1], 0.08, 'square', 0.07, false);
      voice(tr, t, ch[2], 0.08, 'square', 0.06, false);
    }
    if (p % 8 === 0) perc(tr, t, 0.08, 0.12, 320, false);          // 太鼓のドン
    if (p % 4 === 2) perc(tr, t, 0.03, 0.09, 4200, true);          // 木のカッ
    if (p % 2 === 0) {                                             // 跳ねる半音のメロディ
      var n = TRICK_MEL[bar][p / 2];
      if (n) voice(tr, t, n, 0.09, 'square', 0.10, true);
    }
    // 最後だけ落ちる影＝何か起きそうな不穏
    if (bar === 3 && p === 12) glide(tr, t, 57, 45, 0.45, 'sawtooth', 0.06, true);
  }

  // バトルタワー：登坂中の勇壮な行進曲（Dマイナー・4小節。戦闘中の battle とは別物で密度は控えめ）
  var BTWR_CH = [
    [38, 45, 53], [34, 41, 50], [36, 43, 52], [38, 45, 53]
  ];
  var BTWR_MEL = [                                                 // 8分音符8つ（0＝休符）
    [62, 0, 62, 65, 69, 0, 65, 62],
    [70, 0, 69, 0, 65, 0, 62, 0],
    [64, 0, 67, 72, 0, 69, 67, 0],
    [69, 0, 65, 0, 62, 0, 62, 0]
  ];
  function stepTowerBattle(tr, step, t) {
    var bar = Math.floor(step / 16) % 4;
    var p = step % 16;
    var ch = BTWR_CH[bar];
    if (p === 0 || p === 8) pad(tr, t, ch, 0.45, 'sawtooth', 0.05); // 短く踏み込む和音
    if (p % 8 === 0) perc(tr, t, 0.16, 0.20, 130, false);           // キック（低く重い）
    if (p % 8 === 4) perc(tr, t, 0.11, 0.14, 2400, true);           // スネア
    if (p % 4 === 2) perc(tr, t, 0.03, 0.05, 7000, true);           // 刻みのハイハット
    if (p % 2 === 0) {
      // 8分のユニゾンベース（オクターブ重ねで太くする）
      voice(tr, t, ch[0], 0.18, 'square', 0.15, false);
      voice(tr, t, ch[0] + 12, 0.18, 'sawtooth', 0.06, false);
      // ラッパ風の主旋律
      var n = BTWR_MEL[bar][p / 2];
      if (n) voice(tr, t, n, 0.22, 'sawtooth', 0.10, true);
    }
  }

  // バトル（対モンスター）：速い刻みと不穏な短調（Dマイナー・2小節でぐるぐる回す）
  var BATT_CH = [
    [50, 57, 65], [48, 55, 63]
  ];
  function stepBattle(tr, step, t) {
    var bar = Math.floor(step / 16) % 2;
    var p = step % 16;
    var ch = BATT_CH[bar];
    if (p === 0) pad(tr, t, ch, 1.0, 'sawtooth', 0.06);            // 短い不穏なパッド
    voice(tr, t, ch[0] - 24, 0.12, 'square', 0.17, false);          // 16分の突っ走るベース
    if (p % 4 === 0) perc(tr, t, 0.06, 0.16, 2600, true);           // 刻みの打点
    if (p % 8 === 4) perc(tr, t, 0.14, 0.12, 220, false);           // 低い胴の音
    if (p % 2 === 1) {                                              // 裏拍の刺すようなリード
      var mel = [ch[2] + 12, ch[1] + 12, ch[2] + 12, ch[0] + 24,
                 ch[1] + 12, ch[2] + 12, ch[0] + 24, ch[1] + 12];
      voice(tr, t, mel[((p - 1) / 2) % 8], 0.14, 'sawtooth', 0.09, true);
    }
  }

  // 対戦バトル（プレイヤー同士）：勇ましく明るい決闘（Aマイナー→ハ長調寄り・2小節）
  var DUEL_CH = [
    [45, 52, 60], [48, 55, 64]
  ];
  function stepDuel(tr, step, t) {
    var bar = Math.floor(step / 16) % 2;
    var p = step % 16;
    var ch = DUEL_CH[bar];
    if (p === 0) pad(tr, t, ch, 1.1, 'triangle', 0.08);
    if (p % 4 === 0) voice(tr, t, ch[0] - 12, 0.2, 'square', 0.19, false);  // 行進するベース
    else if (p % 4 === 2) voice(tr, t, ch[1] - 12, 0.16, 'square', 0.12, false);
    if (p % 8 === 0) perc(tr, t, 0.05, 0.14, 3000, true);                   // ファンファーレの打点
    if (p % 2 === 0) {                                                       // ラッパ風の主旋律
      var mel = [ch[2], ch[2] + 4, ch[2] + 7, ch[2] + 4,
                 ch[1] + 12, ch[2] + 7, ch[2] + 4, ch[2]];
      bell(tr, t, mel[(p / 2) % 8], 0.34, 0.09);
    }
  }

  // BGM定義（bpm・小節数・ステップ関数／dly,fb,wet はディレイの任意調整）
  var BGM = {
    title:    { bpm: 92,  bars: 8, step: stepTitle },
    battle:   { bpm: 152, bars: 2, step: stepBattle, dly: 0.5, fb: 0.14, wet: 0.22 },
    duel:     { bpm: 138, bars: 2, step: stepDuel,   dly: 0.5, fb: 0.18, wet: 0.30 },
    campaign: { bpm: 122, bars: 4, step: stepCampaign },
    friends:  { bpm: 128, bars: 4, step: stepFriends },
    solo:     { bpm: 74,  bars: 4, step: stepSolo },
    // 特殊塔
    tower_gold:   { bpm: 96,  bars: 4, step: stepTowerGold,   dly: 0.5,  fb: 0.28, wet: 0.46 },
    tower_card:   { bpm: 88,  bars: 4, step: stepTowerCard,   dly: 0.75, fb: 0.32, wet: 0.55 },
    tower_trick:  { bpm: 132, bars: 4, step: stepTowerTrick,  dly: 0.5,  fb: 0.16, wet: 0.26 },
    tower_battle: { bpm: 120, bars: 4, step: stepTowerBattle, dly: 0.5,  fb: 0.14, wet: 0.20 },
    // 塔のスキン別
    tower_stone: { bpm: 54,  bars: 4, step: stepTowerStone, dly: 0.75, fb: 0.22, wet: 0.45 },
    tower_brick: { bpm: 104, bars: 4, step: stepTowerBrick, dly: 0.5,  fb: 0.18, wet: 0.35 },
    tower_moss:  { bpm: 60,  bars: 4, step: stepTowerMoss,  dly: 0.75, fb: 0.34, wet: 0.60 },
    tower_sand:  { bpm: 112, bars: 4, step: stepTowerSand,  dly: 0.5,  fb: 0.15, wet: 0.28 },
    tower_ice:   { bpm: 84,  bars: 4, step: stepTowerIce,   dly: 0.5,  fb: 0.42, wet: 0.62 }
  };

  // トラックを作る（ディレイ付きのバスと専用スケジューラ）
  function makeTrack(key) {
    var cfg = BGM[key];
    var g = ctx.createGain();
    g.gain.value = 1;
    g.connect(bgmGain);

    // ゆるいディレイ（残響感／曲ごとに深さを変えられる）
    var delay = ctx.createDelay(1.0);
    delay.delayTime.value = 60 / cfg.bpm * (cfg.dly == null ? 0.75 : cfg.dly); // 既定は付点8分
    var fb = ctx.createGain();
    fb.gain.value = cfg.fb == null ? 0.25 : cfg.fb;
    var wet = ctx.createGain();
    wet.gain.value = cfg.wet == null ? 0.5 : cfg.wet;
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
    },
    // 全塔制覇のど派手ファンファーレ（最終面クリア用・約3秒）
    fanfare: function (t) {
      // 力強い呼び出し：ド・ド・ド・ミ・ソ・高ド
      var call = [[523, 0], [523, 0.14], [523, 0.28], [659, 0.42], [784, 0.60], [1047, 0.82]];
      for (var i = 0; i < call.length; i++) tone(t + call[i][1], call[i][0], 0.22, 'square', 0.26);
      // 締めの大和音（長く鳴らす）＋上できらめき
      var end = t + 1.1;
      [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(end + i * 0.03, f, 1.5, 'triangle', 0.16); });
      [1568, 2093].forEach(function (f, i) { tone(end + 0.5 + i * 0.14, f, 0.9, 'triangle', 0.14); });
      noise(end, 0.5, 0.22, 4500, true);
      noise(end + 0.9, 0.4, 0.14, 5200, true);
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
      if (!started || !ctx) return;
      // 未知のキーはキャンペーン曲にフォールバック（落とさない）
      if (!Object.prototype.hasOwnProperty.call(BGM, key)) key = 'campaign';
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
