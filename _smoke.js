/* スゴロクタワー(Web版) 疑似スモークテスト(push前必須)
   Play側と違い、Farcasterメタ・SDK importが「あること」を検証する。
   使い方: node _smoke.js  (0終了=合格) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = __dirname;
let ng = 0;
const ok = m => console.log('  OK ' + m);
const bad = m => { console.error('  NG ' + m); ng++; };

console.log('[1] index.html');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (!scripts.length) bad('inline script が見つからない');
for (const s of scripts) {
  // 動的import()を含むためasync関数として包んでパースする
  try { new Function('return (async()=>{' + s + '})'); ok('inline script 構文OK (' + s.length + ' chars)'); }
  catch (e) { bad('inline script 構文エラー: ' + e.message); }
}

const MUST_STR = [
  'APP_VER', 'スゴロクタワー', 'Spinner Tower',
  "title50", "title100", "title200", "title500",   // 称号はi18nキー参照
  'ensureSafeRoute', 'ensureBattleEscape', 'takeFrom', 'titleCelebration',
  'gt_solo_best', 'gt_settings', 'gt_lang', 'audio.js', 'sprites.js', 'i18n.js', 'manifest.json',
  'applyLang', 'data-i18n', '介護と支援の相談どころ',
  'fc:miniapp', '@farcaster/miniapp-sdk',          // 🔴 web版はFarcaster対応が必須
];
for (const s of MUST_STR) (html.includes(s) ? ok : bad)('必須文字列: ' + s);

console.log('[1b] i18n 契約');
try {
  const src = fs.readFileSync(path.join(root, 'i18n.js'), 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(src, sandbox);
  const I = sandbox.window.I18N;
  if (!I) bad('window.I18N が定義されない');
  else {
    (I.order.length === 12 ? ok : bad)('12言語 (' + I.order.length + ')');
    const jaN = Object.keys(I.dict.ja).length;
    for (const lg of I.order) {
      const d = I.dict[lg];
      (d && Object.keys(d).length === jaN ? ok : bad)(`i18n ${lg}: ${d ? Object.keys(d).length : 0}/${jaN}キー`);
    }
    (I.rtl.includes('ar') ? ok : bad)('ar は RTL 指定');
    for (const t of ['タワースペシャリスト','タワーエリート','タワーマスター','タワーゴッド'])
      (Object.values(I.dict.ja).includes(t) ? ok : bad)('称号(ja): ' + t);
  }
} catch (e) { bad('i18n.js 実行エラー: ' + e.message); }

const BANNED = /子ども|子供|こども向け|知育|幼児/;
if (BANNED.test(html)) bad('禁句が本文に含まれる'); else ok('禁句なし(子ども/知育系)');

console.log('[2] audio.js 契約');
try {
  const src = fs.readFileSync(path.join(root, 'audio.js'), 'utf8');
  const sandbox = { window: {}, console, setInterval: () => 0, clearInterval: () => {}, setTimeout: () => 0 };
  vm.runInNewContext(src, sandbox);
  const A = sandbox.window.GTAudio;
  if (!A) bad('window.GTAudio が定義されない');
  else for (const m of ['init', 'playBGM', 'stopBGM', 'sfx', 'setBgmVol', 'setSfxVol']) (typeof A[m] === 'function' ? ok : bad)('GTAudio.' + m);
} catch (e) { bad('audio.js 実行エラー: ' + e.message); }

console.log('[3] sprites.js 契約');
try {
  const src = fs.readFileSync(path.join(root, 'sprites.js'), 'utf8');
  const sandbox = { window: {}, console };
  vm.runInNewContext(src, sandbox);
  const S = sandbox.window.ENEMY_SPRITES;
  if (!S) bad('window.ENEMY_SPRITES が定義されない');
  else for (const hp of [2, 3, 4, 5, 6, 7, 8]) {
    const e = S[hp];
    (e && e.name && /^<svg/.test(e.svg || '') ? ok : bad)('敵HP' + hp + ': ' + (e ? e.name : '欠落'));
  }
} catch (e) { bad('sprites.js 実行エラー: ' + e.message); }

console.log('[4] 付帯ファイル(web)');
for (const f of ['manifest.json', 'privacy.html', 'vercel.json', '.well-known/farcaster.json',
                 'icons/icon-192.png', 'icons/icon-512.png', 'icons/fc-card-3x2.png']) {
  (fs.existsSync(path.join(root, f)) ? ok : bad)(f);
}
for (const f of ['manifest.json', 'vercel.json', '.well-known/farcaster.json']) {
  try { JSON.parse(fs.readFileSync(path.join(root, f), 'utf8')); ok(f + ' はJSONとして妥当'); }
  catch (e) { bad(f + ' JSONエラー: ' + e.message); }
}

if (ng) { console.error('\nSMOKE NG: ' + ng + '件'); process.exit(1); }
console.log('\nSMOKE ALL OK');
