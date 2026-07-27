/* スゴロクタワー 敵スプライト定義（自己完結・外部素材なし）
 * 32×32 のドット絵SVG（<rect>並べ）。crispEdges で拡大してもくっきり。
 * キー = 敵のHP（強さ）。数字が大きいほど強く・こわい見た目に。
 * 背景は透明（塗らない）。全体をIIFEで包み window.ENEMY_SPRITES へ代入。
 */
(function () {
  'use strict';

  // 2:スライム — まるい緑のぷにぷに。いちばん弱い。
  var slime =
    '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<!-- 本体 -->' +
    '<rect x="12" y="7" width="8" height="2" fill="#7ed957"/>' +
    '<rect x="9" y="9" width="14" height="2" fill="#7ed957"/>' +
    '<rect x="7" y="11" width="18" height="3" fill="#7ed957"/>' +
    '<rect x="6" y="14" width="20" height="8" fill="#7ed957"/>' +
    '<!-- 底の影 -->' +
    '<rect x="6" y="22" width="20" height="3" fill="#57b33e"/>' +
    '<rect x="8" y="25" width="16" height="1" fill="#57b33e"/>' +
    '<!-- ハイライト -->' +
    '<rect x="9" y="11" width="3" height="2" fill="#aef08a"/>' +
    '<!-- 目 -->' +
    '<rect x="11" y="14" width="4" height="5" fill="#ffffff"/>' +
    '<rect x="17" y="14" width="4" height="5" fill="#ffffff"/>' +
    '<rect x="12" y="16" width="2" height="3" fill="#222222"/>' +
    '<rect x="18" y="16" width="2" height="3" fill="#222222"/>' +
    '<!-- 口 -->' +
    '<rect x="13" y="21" width="6" height="1" fill="#2e7d32"/>' +
    '<rect x="14" y="22" width="4" height="1" fill="#2e7d32"/>' +
    '</svg>';

  // 3:巨大虫 — 体節のある芋虫。触角と小さな脚つき。
  var giantBug =
    '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<!-- 触角 -->' +
    '<rect x="6" y="7" width="1" height="3" fill="#33691e"/>' +
    '<rect x="9" y="6" width="1" height="4" fill="#33691e"/>' +
    '<rect x="5" y="6" width="2" height="2" fill="#7cb342"/>' +
    '<rect x="9" y="5" width="2" height="2" fill="#7cb342"/>' +
    '<!-- 頭（左） -->' +
    '<rect x="4" y="11" width="8" height="10" fill="#aed581"/>' +
    '<rect x="4" y="19" width="8" height="2" fill="#7cb342"/>' +
    '<!-- 体節 -->' +
    '<rect x="11" y="12" width="7" height="9" fill="#9ccc65"/>' +
    '<rect x="11" y="19" width="7" height="2" fill="#7cb342"/>' +
    '<rect x="17" y="12" width="7" height="9" fill="#aed581"/>' +
    '<rect x="17" y="19" width="7" height="2" fill="#7cb342"/>' +
    '<rect x="23" y="13" width="6" height="7" fill="#9ccc65"/>' +
    '<rect x="23" y="18" width="6" height="2" fill="#7cb342"/>' +
    '<!-- 目 -->' +
    '<rect x="5" y="13" width="3" height="4" fill="#ffffff"/>' +
    '<rect x="6" y="14" width="2" height="2" fill="#222222"/>' +
    '<!-- ほっぺ -->' +
    '<rect x="6" y="18" width="4" height="1" fill="#e57373"/>' +
    '<!-- 脚 -->' +
    '<rect x="6" y="21" width="2" height="2" fill="#558b2f"/>' +
    '<rect x="13" y="21" width="2" height="2" fill="#558b2f"/>' +
    '<rect x="19" y="21" width="2" height="2" fill="#558b2f"/>' +
    '</svg>';

  // 4:イライラバード — ぷんぷんした小鳥。怒り眉と逆立った羽。
  var angryBird =
    '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<!-- 逆立った羽 -->' +
    '<rect x="13" y="5" width="1" height="4" fill="#e64a19"/>' +
    '<rect x="16" y="4" width="1" height="5" fill="#e64a19"/>' +
    '<rect x="19" y="5" width="1" height="4" fill="#e64a19"/>' +
    '<!-- 体 -->' +
    '<rect x="10" y="9" width="12" height="14" fill="#ff7043"/>' +
    '<rect x="9" y="11" width="14" height="10" fill="#ff7043"/>' +
    '<!-- お腹 -->' +
    '<rect x="12" y="15" width="8" height="7" fill="#ffab91"/>' +
    '<!-- 目 -->' +
    '<rect x="11" y="11" width="4" height="4" fill="#ffffff"/>' +
    '<rect x="17" y="11" width="4" height="4" fill="#ffffff"/>' +
    '<rect x="12" y="13" width="2" height="2" fill="#222222"/>' +
    '<rect x="18" y="13" width="2" height="2" fill="#222222"/>' +
    '<!-- 怒り眉（ハの字） -->' +
    '<rect x="10" y="9" width="3" height="1" fill="#4e342e"/>' +
    '<rect x="12" y="10" width="3" height="1" fill="#4e342e"/>' +
    '<rect x="19" y="9" width="3" height="1" fill="#4e342e"/>' +
    '<rect x="17" y="10" width="3" height="1" fill="#4e342e"/>' +
    '<!-- くちばし -->' +
    '<rect x="14" y="15" width="4" height="2" fill="#ffca28"/>' +
    '<rect x="15" y="17" width="2" height="1" fill="#ffb300"/>' +
    '<!-- 足 -->' +
    '<rect x="12" y="23" width="2" height="2" fill="#ffb300"/>' +
    '<rect x="18" y="23" width="2" height="2" fill="#ffb300"/>' +
    '</svg>';

  // 5:牙キツネ — とがった耳と白マズル、下から牙をのぞかせるキツネ。
  var fangFox =
    '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<!-- 耳 -->' +
    '<rect x="7" y="5" width="5" height="7" fill="#ff9800"/>' +
    '<rect x="8" y="4" width="3" height="2" fill="#ff9800"/>' +
    '<rect x="20" y="5" width="5" height="7" fill="#ff9800"/>' +
    '<rect x="21" y="4" width="3" height="2" fill="#ff9800"/>' +
    '<!-- 耳の内側 -->' +
    '<rect x="9" y="7" width="2" height="4" fill="#4e342e"/>' +
    '<rect x="21" y="7" width="2" height="4" fill="#4e342e"/>' +
    '<!-- 顔 -->' +
    '<rect x="8" y="10" width="16" height="12" fill="#ff9800"/>' +
    '<rect x="8" y="20" width="16" height="2" fill="#ef6c00"/>' +
    '<!-- 白マズル -->' +
    '<rect x="11" y="16" width="10" height="7" fill="#ffffff"/>' +
    '<!-- 鼻 -->' +
    '<rect x="14" y="16" width="4" height="2" fill="#3e2723"/>' +
    '<!-- 目（つり目） -->' +
    '<rect x="10" y="12" width="4" height="3" fill="#ffffff"/>' +
    '<rect x="18" y="12" width="4" height="3" fill="#ffffff"/>' +
    '<rect x="11" y="13" width="2" height="2" fill="#222222"/>' +
    '<rect x="19" y="13" width="2" height="2" fill="#222222"/>' +
    '<!-- 牙 -->' +
    '<rect x="12" y="21" width="1" height="3" fill="#ffffff"/>' +
    '<rect x="19" y="21" width="1" height="3" fill="#ffffff"/>' +
    '<rect x="12" y="23" width="1" height="1" fill="#dddddd"/>' +
    '</svg>';

  // 6:ジョーカーベア — 道化の角鈴・赤い鼻・カラフルな襟のクマ。
  var jokerBear =
    '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<!-- ジェスターの角と鈴 -->' +
    '<rect x="8" y="3" width="2" height="4" fill="#ffd54f"/>' +
    '<rect x="7" y="2" width="2" height="2" fill="#ffca28"/>' +
    '<rect x="22" y="3" width="2" height="4" fill="#26c6da"/>' +
    '<rect x="23" y="2" width="2" height="2" fill="#00acc1"/>' +
    '<!-- 顔 -->' +
    '<rect x="8" y="8" width="16" height="14" fill="#7e57c2"/>' +
    '<!-- 耳 -->' +
    '<rect x="6" y="6" width="6" height="6" fill="#7e57c2"/>' +
    '<rect x="20" y="6" width="6" height="6" fill="#7e57c2"/>' +
    '<rect x="8" y="8" width="2" height="2" fill="#b39ddb"/>' +
    '<rect x="22" y="8" width="2" height="2" fill="#b39ddb"/>' +
    '<!-- マズル -->' +
    '<rect x="11" y="15" width="10" height="6" fill="#d1c4e9"/>' +
    '<!-- 目 -->' +
    '<rect x="10" y="11" width="4" height="4" fill="#ffffff"/>' +
    '<rect x="18" y="11" width="4" height="4" fill="#ffffff"/>' +
    '<rect x="11" y="12" width="2" height="2" fill="#222222"/>' +
    '<rect x="19" y="12" width="2" height="2" fill="#222222"/>' +
    '<!-- 赤い鼻 -->' +
    '<rect x="14" y="16" width="4" height="3" fill="#e53935"/>' +
    '<rect x="15" y="15" width="2" height="1" fill="#ef5350"/>' +
    '<!-- 口 -->' +
    '<rect x="13" y="19" width="6" height="1" fill="#5e35b1"/>' +
    '<!-- 道化の襟 -->' +
    '<rect x="6" y="22" width="4" height="3" fill="#ffd54f"/>' +
    '<rect x="10" y="22" width="4" height="3" fill="#26c6da"/>' +
    '<rect x="14" y="22" width="4" height="3" fill="#ffd54f"/>' +
    '<rect x="18" y="22" width="4" height="3" fill="#26c6da"/>' +
    '<rect x="22" y="22" width="4" height="3" fill="#ffd54f"/>' +
    '</svg>';

  // 7:ハイイーグル — 白頭・黄のかぎ嘴・翼を広げたりりしい鷲。
  var highEagle =
    '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<!-- 頭（白） -->' +
    '<rect x="9" y="6" width="14" height="9" fill="#f5f5f5"/>' +
    '<rect x="10" y="5" width="12" height="1" fill="#f5f5f5"/>' +
    '<!-- 怒り眉 -->' +
    '<rect x="9" y="7" width="4" height="1" fill="#5d4037"/>' +
    '<rect x="12" y="8" width="3" height="1" fill="#5d4037"/>' +
    '<rect x="19" y="7" width="4" height="1" fill="#5d4037"/>' +
    '<rect x="17" y="8" width="3" height="1" fill="#5d4037"/>' +
    '<!-- 目 -->' +
    '<rect x="11" y="9" width="3" height="3" fill="#ffffff"/>' +
    '<rect x="18" y="9" width="3" height="3" fill="#ffffff"/>' +
    '<rect x="12" y="10" width="2" height="2" fill="#222222"/>' +
    '<rect x="18" y="10" width="2" height="2" fill="#222222"/>' +
    '<!-- くちばし（かぎ） -->' +
    '<rect x="14" y="13" width="4" height="3" fill="#ffb300"/>' +
    '<rect x="15" y="16" width="2" height="2" fill="#ffca28"/>' +
    '<rect x="15" y="18" width="1" height="1" fill="#ff8f00"/>' +
    '<!-- 体と翼 -->' +
    '<rect x="7" y="16" width="18" height="8" fill="#6d4c41"/>' +
    '<rect x="5" y="17" width="3" height="6" fill="#5d4037"/>' +
    '<rect x="24" y="17" width="3" height="6" fill="#5d4037"/>' +
    '<!-- 羽の模様 -->' +
    '<rect x="10" y="18" width="1" height="5" fill="#5d4037"/>' +
    '<rect x="14" y="18" width="1" height="5" fill="#5d4037"/>' +
    '<rect x="18" y="18" width="1" height="5" fill="#5d4037"/>' +
    '<!-- 足 -->' +
    '<rect x="12" y="24" width="2" height="2" fill="#ffb300"/>' +
    '<rect x="18" y="24" width="2" height="2" fill="#ffb300"/>' +
    '</svg>';

  // 8:ドラゴン — 角・背びれ・スリット目・牙。いちばん強くこわい竜。
  var dragon =
    '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<!-- 角 -->' +
    '<rect x="8" y="3" width="2" height="5" fill="#ffca28"/>' +
    '<rect x="7" y="3" width="1" height="2" fill="#ffca28"/>' +
    '<rect x="22" y="3" width="2" height="5" fill="#ffca28"/>' +
    '<rect x="24" y="3" width="1" height="2" fill="#ffca28"/>' +
    '<!-- 背びれ -->' +
    '<rect x="14" y="4" width="4" height="2" fill="#b71c1c"/>' +
    '<rect x="12" y="6" width="8" height="2" fill="#b71c1c"/>' +
    '<!-- 頭 -->' +
    '<rect x="8" y="8" width="16" height="11" fill="#d32f2f"/>' +
    '<!-- 頬のトゲ -->' +
    '<rect x="6" y="12" width="2" height="4" fill="#b71c1c"/>' +
    '<rect x="24" y="12" width="2" height="4" fill="#b71c1c"/>' +
    '<!-- 鼻先 -->' +
    '<rect x="11" y="18" width="10" height="4" fill="#e53935"/>' +
    '<rect x="12" y="19" width="1" height="1" fill="#7f1d1d"/>' +
    '<rect x="19" y="19" width="1" height="1" fill="#7f1d1d"/>' +
    '<!-- 目（スリット） -->' +
    '<rect x="10" y="11" width="4" height="3" fill="#ffd54f"/>' +
    '<rect x="18" y="11" width="4" height="3" fill="#ffd54f"/>' +
    '<rect x="11" y="11" width="1" height="3" fill="#222222"/>' +
    '<rect x="20" y="11" width="1" height="3" fill="#222222"/>' +
    '<!-- 怒り眉 -->' +
    '<rect x="10" y="9" width="4" height="1" fill="#7f1d1d"/>' +
    '<rect x="13" y="10" width="2" height="1" fill="#7f1d1d"/>' +
    '<rect x="18" y="9" width="4" height="1" fill="#7f1d1d"/>' +
    '<rect x="17" y="10" width="2" height="1" fill="#7f1d1d"/>' +
    '<!-- 牙 -->' +
    '<rect x="12" y="22" width="1" height="2" fill="#ffffff"/>' +
    '<rect x="15" y="22" width="1" height="2" fill="#ffffff"/>' +
    '<rect x="18" y="22" width="1" height="2" fill="#ffffff"/>' +
    '</svg>';

  // HP（強さ）をキーに公開
  window.ENEMY_SPRITES = {
    2: { name: 'スライム',       svg: slime },
    3: { name: '巨大虫',         svg: giantBug },
    4: { name: 'イライラバード', svg: angryBird },
    5: { name: '牙キツネ',       svg: fangFox },
    6: { name: 'ジョーカーベア', svg: jokerBear },
    7: { name: 'ハイイーグル',   svg: highEagle },
    8: { name: 'ドラゴン',       svg: dragon }
  };
})();
