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
    '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<!-- ふさふさの尻尾（体の後ろ・右へ大きく回り込む） -->' +
    '<rect x="41" y="50" width="8" height="1" fill="#e8863c"/>' +
    '<rect x="41" y="49" width="9" height="1" fill="#e8863c"/>' +
    '<rect x="42" y="48" width="10" height="1" fill="#e8863c"/>' +
    '<rect x="43" y="47" width="11" height="1" fill="#e8863c"/>' +
    '<rect x="44" y="46" width="12" height="1" fill="#e8863c"/>' +
    '<rect x="45" y="45" width="12" height="1" fill="#e8863c"/>' +
    '<rect x="46" y="44" width="12" height="1" fill="#e8863c"/>' +
    '<rect x="47" y="40" width="12" height="4" fill="#e8863c"/>' +
    '<rect x="48" y="38" width="11" height="2" fill="#e8863c"/>' +
    '<rect x="48" y="37" width="10" height="1" fill="#e8863c"/>' +
    '<rect x="49" y="36" width="9" height="1" fill="#e8863c"/>' +
    '<rect x="49" y="35" width="8" height="1" fill="#e8863c"/>' +
    '<rect x="50" y="34" width="7" height="1" fill="#e8863c"/>' +
    '<rect x="50" y="33" width="6" height="1" fill="#e8863c"/>' +
    '<rect x="51" y="32" width="5" height="1" fill="#e8863c"/>' +
    '<!-- 尻尾の内側（影） -->' +
    '<rect x="41" y="48" width="3" height="3" fill="#b45f22"/>' +
    '<rect x="43" y="47" width="3" height="1" fill="#b45f22"/>' +
    '<rect x="44" y="46" width="3" height="1" fill="#b45f22"/>' +
    '<rect x="45" y="45" width="3" height="1" fill="#b45f22"/>' +
    '<rect x="46" y="44" width="3" height="1" fill="#b45f22"/>' +
    '<rect x="47" y="40" width="2" height="4" fill="#b45f22"/>' +
    '<rect x="48" y="38" width="2" height="2" fill="#b45f22"/>' +
    '<rect x="48" y="37" width="2" height="1" fill="#b45f22"/>' +
    '<rect x="49" y="35" width="2" height="2" fill="#b45f22"/>' +
    '<!-- 尻尾の外側（明るい面） -->' +
    '<rect x="49" y="48" width="3" height="1" fill="#f7b06a"/>' +
    '<rect x="51" y="47" width="3" height="1" fill="#f7b06a"/>' +
    '<rect x="52" y="46" width="4" height="1" fill="#f7b06a"/>' +
    '<rect x="53" y="45" width="4" height="1" fill="#f7b06a"/>' +
    '<rect x="54" y="44" width="4" height="1" fill="#f7b06a"/>' +
    '<rect x="55" y="40" width="4" height="4" fill="#f7b06a"/>' +
    '<rect x="55" y="38" width="4" height="2" fill="#f7b06a"/>' +
    '<rect x="54" y="37" width="4" height="1" fill="#f7b06a"/>' +
    '<rect x="54" y="36" width="4" height="1" fill="#f7b06a"/>' +
    '<rect x="53" y="35" width="4" height="1" fill="#f7b06a"/>' +
    '<!-- 尻尾の毛並み -->' +
    '<rect x="50" y="44" width="2" height="5" fill="#f7b06a"/>' +
    '<rect x="52" y="37" width="2" height="6" fill="#f7b06a"/>' +
    '<rect x="50" y="38" width="1" height="8" fill="#b45f22"/>' +
    '<rect x="54" y="33" width="1" height="4" fill="#b45f22"/>' +
    '<rect x="46" y="46" width="1" height="3" fill="#b45f22"/>' +
    '<!-- 尻尾の先（白） -->' +
    '<rect x="51" y="36" width="5" height="1" fill="#fdf6ec"/>' +
    '<rect x="50" y="35" width="6" height="1" fill="#fdf6ec"/>' +
    '<rect x="50" y="34" width="7" height="1" fill="#fdf6ec"/>' +
    '<rect x="50" y="33" width="6" height="1" fill="#fdf6ec"/>' +
    '<rect x="51" y="32" width="5" height="1" fill="#fdf6ec"/>' +
    '<rect x="52" y="37" width="2" height="1" fill="#fdf6ec"/>' +
    '<rect x="55" y="35" width="2" height="1" fill="#fdf6ec"/>' +
    '<rect x="51" y="31" width="2" height="1" fill="#fdf6ec"/>' +
    '<rect x="54" y="31" width="2" height="1" fill="#fdf6ec"/>' +
    '<rect x="50" y="34" width="2" height="2" fill="#ded0bd"/>' +
    '<rect x="51" y="36" width="3" height="1" fill="#ded0bd"/>' +
    '<rect x="53" y="32" width="2" height="2" fill="#ffffff"/>' +
    '<!-- 胴体 -->' +
    '<rect x="25" y="35" width="14" height="1" fill="#e8863c"/>' +
    '<rect x="24" y="36" width="16" height="1" fill="#e8863c"/>' +
    '<rect x="23" y="37" width="18" height="1" fill="#e8863c"/>' +
    '<rect x="22" y="38" width="20" height="1" fill="#e8863c"/>' +
    '<rect x="21" y="39" width="22" height="12" fill="#e8863c"/>' +
    '<rect x="22" y="51" width="20" height="1" fill="#e8863c"/>' +
    '<rect x="23" y="52" width="18" height="1" fill="#e8863c"/>' +
    '<!-- 胴体の陰影 -->' +
    '<rect x="21" y="40" width="3" height="9" fill="#f7b06a"/>' +
    '<rect x="38" y="39" width="4" height="11" fill="#b45f22"/>' +
    '<rect x="37" y="50" width="4" height="1" fill="#b45f22"/>' +
    '<rect x="36" y="51" width="5" height="1" fill="#b45f22"/>' +
    '<rect x="35" y="52" width="5" height="1" fill="#b45f22"/>' +
    '<rect x="24" y="36" width="16" height="2" fill="#b45f22"/>' +
    '<!-- 胸とお腹の白 -->' +
    '<rect x="28" y="37" width="2" height="1" fill="#fdf6ec"/>' +
    '<rect x="31" y="37" width="2" height="1" fill="#fdf6ec"/>' +
    '<rect x="34" y="37" width="2" height="1" fill="#fdf6ec"/>' +
    '<rect x="27" y="38" width="9" height="1" fill="#fdf6ec"/>' +
    '<rect x="26" y="39" width="11" height="2" fill="#fdf6ec"/>' +
    '<rect x="25" y="41" width="12" height="8" fill="#fdf6ec"/>' +
    '<rect x="26" y="49" width="11" height="1" fill="#fdf6ec"/>' +
    '<rect x="26" y="50" width="10" height="1" fill="#fdf6ec"/>' +
    '<rect x="27" y="51" width="9" height="1" fill="#fdf6ec"/>' +
    '<rect x="28" y="52" width="7" height="1" fill="#fdf6ec"/>' +
    '<rect x="34" y="41" width="3" height="8" fill="#ded0bd"/>' +
    '<rect x="33" y="49" width="4" height="2" fill="#ded0bd"/>' +
    '<rect x="33" y="51" width="3" height="1" fill="#ded0bd"/>' +
    '<rect x="26" y="40" width="3" height="5" fill="#ffffff"/>' +
    '<rect x="29" y="43" width="1" height="4" fill="#ded0bd"/>' +
    '<rect x="31" y="46" width="1" height="4" fill="#ded0bd"/>' +
    '<!-- 前足（左） -->' +
    '<rect x="22" y="47" width="8" height="6" fill="#e8863c"/>' +
    '<rect x="22" y="47" width="2" height="6" fill="#f7b06a"/>' +
    '<rect x="28" y="47" width="2" height="6" fill="#b45f22"/>' +
    '<rect x="22" y="52" width="2" height="1" fill="#3d2418"/>' +
    '<rect x="25" y="52" width="2" height="1" fill="#3d2418"/>' +
    '<rect x="28" y="52" width="2" height="1" fill="#3d2418"/>' +
    '<rect x="22" y="53" width="8" height="4" fill="#3d2418"/>' +
    '<rect x="21" y="56" width="10" height="4" fill="#4a2a18"/>' +
    '<rect x="21" y="56" width="10" height="1" fill="#5c3421"/>' +
    '<rect x="24" y="57" width="1" height="3" fill="#241309"/>' +
    '<rect x="27" y="57" width="1" height="3" fill="#241309"/>' +
    '<!-- 前足（右） -->' +
    '<rect x="34" y="47" width="8" height="6" fill="#e8863c"/>' +
    '<rect x="34" y="47" width="2" height="6" fill="#f7b06a"/>' +
    '<rect x="40" y="47" width="2" height="6" fill="#b45f22"/>' +
    '<rect x="34" y="52" width="2" height="1" fill="#3d2418"/>' +
    '<rect x="37" y="52" width="2" height="1" fill="#3d2418"/>' +
    '<rect x="40" y="52" width="2" height="1" fill="#3d2418"/>' +
    '<rect x="34" y="53" width="8" height="4" fill="#3d2418"/>' +
    '<rect x="33" y="56" width="10" height="4" fill="#4a2a18"/>' +
    '<rect x="33" y="56" width="10" height="1" fill="#5c3421"/>' +
    '<rect x="36" y="57" width="1" height="3" fill="#241309"/>' +
    '<rect x="39" y="57" width="1" height="3" fill="#241309"/>' +
    '<!-- お腹の下（足の間） -->' +
    '<rect x="29" y="53" width="6" height="2" fill="#b45f22"/>' +
    '<rect x="30" y="55" width="4" height="1" fill="#b45f22"/>' +
    '<!-- 頭 -->' +
    '<rect x="21" y="14" width="22" height="1" fill="#e8863c"/>' +
    '<rect x="19" y="15" width="26" height="1" fill="#e8863c"/>' +
    '<rect x="18" y="16" width="28" height="1" fill="#e8863c"/>' +
    '<rect x="17" y="17" width="30" height="1" fill="#e8863c"/>' +
    '<rect x="16" y="18" width="32" height="1" fill="#e8863c"/>' +
    '<rect x="15" y="19" width="34" height="2" fill="#e8863c"/>' +
    '<rect x="14" y="21" width="36" height="7" fill="#e8863c"/>' +
    '<rect x="15" y="28" width="34" height="2" fill="#e8863c"/>' +
    '<rect x="16" y="30" width="32" height="1" fill="#e8863c"/>' +
    '<rect x="17" y="31" width="30" height="1" fill="#e8863c"/>' +
    '<rect x="18" y="32" width="28" height="1" fill="#e8863c"/>' +
    '<rect x="20" y="33" width="24" height="1" fill="#e8863c"/>' +
    '<rect x="22" y="34" width="20" height="1" fill="#e8863c"/>' +
    '<rect x="24" y="35" width="16" height="1" fill="#e8863c"/>' +
    '<rect x="26" y="36" width="12" height="1" fill="#e8863c"/>' +
    '<!-- 頭の陰影 -->' +
    '<rect x="28" y="15" width="8" height="1" fill="#f7b06a"/>' +
    '<rect x="27" y="16" width="10" height="1" fill="#f7b06a"/>' +
    '<rect x="25" y="17" width="13" height="2" fill="#f7b06a"/>' +
    '<rect x="19" y="19" width="8" height="2" fill="#f7b06a"/>' +
    '<rect x="15" y="21" width="5" height="6" fill="#f7b06a"/>' +
    '<rect x="43" y="20" width="6" height="9" fill="#b45f22"/>' +
    '<rect x="41" y="30" width="6" height="2" fill="#b45f22"/>' +
    '<rect x="39" y="32" width="6" height="1" fill="#b45f22"/>' +
    '<rect x="22" y="34" width="20" height="1" fill="#b45f22"/>' +
    '<rect x="24" y="35" width="16" height="1" fill="#b45f22"/>' +
    '<rect x="26" y="36" width="12" height="1" fill="#b45f22"/>' +
    '<!-- 顔の毛並み -->' +
    '<rect x="17" y="22" width="1" height="4" fill="#f7b06a"/>' +
    '<rect x="16" y="25" width="1" height="3" fill="#f7b06a"/>' +
    '<rect x="46" y="22" width="1" height="4" fill="#b45f22"/>' +
    '<rect x="47" y="25" width="1" height="3" fill="#b45f22"/>' +
    '<!-- 耳（左） -->' +
    '<rect x="20" y="5" width="3" height="1" fill="#e8863c"/>' +
    '<rect x="19" y="6" width="5" height="1" fill="#e8863c"/>' +
    '<rect x="19" y="7" width="6" height="1" fill="#e8863c"/>' +
    '<rect x="18" y="8" width="7" height="1" fill="#e8863c"/>' +
    '<rect x="18" y="9" width="8" height="1" fill="#e8863c"/>' +
    '<rect x="17" y="10" width="9" height="1" fill="#e8863c"/>' +
    '<rect x="17" y="11" width="10" height="1" fill="#e8863c"/>' +
    '<rect x="16" y="12" width="11" height="1" fill="#e8863c"/>' +
    '<rect x="16" y="13" width="12" height="2" fill="#e8863c"/>' +
    '<rect x="16" y="15" width="13" height="1" fill="#e8863c"/>' +
    '<rect x="17" y="16" width="12" height="1" fill="#e8863c"/>' +
    '<!-- 耳（右） -->' +
    '<rect x="41" y="5" width="3" height="1" fill="#e8863c"/>' +
    '<rect x="40" y="6" width="5" height="1" fill="#e8863c"/>' +
    '<rect x="39" y="7" width="6" height="1" fill="#e8863c"/>' +
    '<rect x="39" y="8" width="7" height="1" fill="#e8863c"/>' +
    '<rect x="38" y="9" width="8" height="1" fill="#e8863c"/>' +
    '<rect x="38" y="10" width="9" height="1" fill="#e8863c"/>' +
    '<rect x="37" y="11" width="10" height="1" fill="#e8863c"/>' +
    '<rect x="37" y="12" width="11" height="1" fill="#e8863c"/>' +
    '<rect x="36" y="13" width="12" height="2" fill="#e8863c"/>' +
    '<rect x="35" y="15" width="13" height="1" fill="#e8863c"/>' +
    '<rect x="35" y="16" width="12" height="1" fill="#e8863c"/>' +
    '<!-- 耳の先（濃い色） -->' +
    '<rect x="20" y="5" width="3" height="1" fill="#6b3a18"/>' +
    '<rect x="19" y="6" width="5" height="1" fill="#6b3a18"/>' +
    '<rect x="19" y="7" width="4" height="1" fill="#6b3a18"/>' +
    '<rect x="18" y="8" width="4" height="1" fill="#6b3a18"/>' +
    '<rect x="41" y="5" width="3" height="1" fill="#6b3a18"/>' +
    '<rect x="40" y="6" width="5" height="1" fill="#6b3a18"/>' +
    '<rect x="41" y="7" width="4" height="1" fill="#6b3a18"/>' +
    '<rect x="42" y="8" width="4" height="1" fill="#6b3a18"/>' +
    '<!-- 耳の内側 -->' +
    '<rect x="20" y="9" width="4" height="1" fill="#8a4a20"/>' +
    '<rect x="19" y="10" width="5" height="1" fill="#8a4a20"/>' +
    '<rect x="19" y="11" width="6" height="2" fill="#8a4a20"/>' +
    '<rect x="19" y="13" width="7" height="2" fill="#8a4a20"/>' +
    '<rect x="40" y="9" width="4" height="1" fill="#8a4a20"/>' +
    '<rect x="40" y="10" width="5" height="1" fill="#8a4a20"/>' +
    '<rect x="39" y="11" width="6" height="2" fill="#8a4a20"/>' +
    '<rect x="38" y="13" width="7" height="2" fill="#8a4a20"/>' +
    '<rect x="20" y="11" width="3" height="3" fill="#c9764a"/>' +
    '<rect x="41" y="11" width="3" height="3" fill="#c9764a"/>' +
    '<rect x="17" y="11" width="2" height="5" fill="#f7b06a"/>' +
    '<rect x="45" y="12" width="2" height="4" fill="#b45f22"/>' +
    '<!-- 白い頬（左） -->' +
    '<rect x="15" y="26" width="7" height="1" fill="#fdf6ec"/>' +
    '<rect x="13" y="27" width="9" height="3" fill="#fdf6ec"/>' +
    '<rect x="14" y="30" width="8" height="1" fill="#fdf6ec"/>' +
    '<rect x="15" y="31" width="7" height="1" fill="#fdf6ec"/>' +
    '<rect x="17" y="32" width="5" height="1" fill="#fdf6ec"/>' +
    '<rect x="19" y="33" width="4" height="1" fill="#fdf6ec"/>' +
    '<!-- 白い頬（右） -->' +
    '<rect x="42" y="26" width="7" height="1" fill="#fdf6ec"/>' +
    '<rect x="42" y="27" width="9" height="3" fill="#fdf6ec"/>' +
    '<rect x="42" y="30" width="8" height="1" fill="#fdf6ec"/>' +
    '<rect x="42" y="31" width="7" height="1" fill="#fdf6ec"/>' +
    '<rect x="42" y="32" width="5" height="1" fill="#fdf6ec"/>' +
    '<rect x="41" y="33" width="4" height="1" fill="#fdf6ec"/>' +
    '<!-- 頬の毛先と影 -->' +
    '<rect x="11" y="28" width="2" height="2" fill="#fdf6ec"/>' +
    '<rect x="13" y="31" width="2" height="1" fill="#fdf6ec"/>' +
    '<rect x="51" y="28" width="2" height="2" fill="#fdf6ec"/>' +
    '<rect x="49" y="31" width="2" height="1" fill="#fdf6ec"/>' +
    '<rect x="45" y="27" width="5" height="4" fill="#ded0bd"/>' +
    '<rect x="44" y="31" width="4" height="1" fill="#ded0bd"/>' +
    '<rect x="14" y="30" width="4" height="1" fill="#ded0bd"/>' +
    '<!-- マズル（白） -->' +
    '<rect x="27" y="27" width="10" height="1" fill="#fdf6ec"/>' +
    '<rect x="26" y="28" width="12" height="1" fill="#fdf6ec"/>' +
    '<rect x="25" y="29" width="14" height="1" fill="#fdf6ec"/>' +
    '<rect x="24" y="30" width="16" height="4" fill="#fdf6ec"/>' +
    '<rect x="25" y="34" width="14" height="2" fill="#fdf6ec"/>' +
    '<rect x="26" y="36" width="12" height="1" fill="#fdf6ec"/>' +
    '<rect x="28" y="37" width="9" height="1" fill="#fdf6ec"/>' +
    '<rect x="35" y="30" width="5" height="4" fill="#ded0bd"/>' +
    '<rect x="34" y="34" width="5" height="1" fill="#ded0bd"/>' +
    '<rect x="33" y="35" width="5" height="1" fill="#ded0bd"/>' +
    '<rect x="31" y="36" width="6" height="1" fill="#ded0bd"/>' +
    '<rect x="30" y="37" width="6" height="1" fill="#ded0bd"/>' +
    '<rect x="26" y="29" width="4" height="2" fill="#ffffff"/>' +
    '<rect x="26" y="31" width="1" height="1" fill="#cbb8a6"/>' +
    '<rect x="26" y="33" width="1" height="1" fill="#cbb8a6"/>' +
    '<rect x="37" y="31" width="1" height="1" fill="#cbb8a6"/>' +
    '<rect x="37" y="33" width="1" height="1" fill="#cbb8a6"/>' +
    '<!-- 鼻 -->' +
    '<rect x="29" y="29" width="6" height="3" fill="#2b1d16"/>' +
    '<rect x="30" y="32" width="4" height="1" fill="#2b1d16"/>' +
    '<rect x="30" y="29" width="2" height="1" fill="#7a6a60"/>' +
    '<rect x="31" y="33" width="2" height="2" fill="#ded0bd"/>' +
    '<!-- にやりと笑う口（右側だけ上がる） -->' +
    '<rect x="27" y="35" width="7" height="1" fill="#6b2f12"/>' +
    '<rect x="34" y="34" width="3" height="1" fill="#6b2f12"/>' +
    '<rect x="37" y="33" width="2" height="1" fill="#6b2f12"/>' +
    '<!-- 口元からのぞく牙 -->' +
    '<rect x="28" y="36" width="4" height="2" fill="#6b2f12"/>' +
    '<rect x="29" y="36" width="2" height="1" fill="#fdf6ec"/>' +
    '<rect x="29" y="37" width="1" height="1" fill="#fdf6ec"/>' +
    '<!-- 目（細め・左） -->' +
    '<rect x="19" y="20" width="9" height="5" fill="#fdf6ec"/>' +
    '<rect x="19" y="20" width="6" height="2" fill="#b45f22"/>' +
    '<rect x="25" y="20" width="3" height="1" fill="#b45f22"/>' +
    '<rect x="22" y="22" width="4" height="3" fill="#222222"/>' +
    '<rect x="23" y="22" width="1" height="1" fill="#ffffff"/>' +
    '<rect x="19" y="25" width="9" height="1" fill="#b45f22"/>' +
    '<rect x="18" y="22" width="1" height="3" fill="#8a4616"/>' +
    '<!-- 目（細め・右） -->' +
    '<rect x="36" y="20" width="9" height="5" fill="#fdf6ec"/>' +
    '<rect x="39" y="20" width="6" height="2" fill="#b45f22"/>' +
    '<rect x="36" y="20" width="3" height="1" fill="#b45f22"/>' +
    '<rect x="38" y="22" width="4" height="3" fill="#222222"/>' +
    '<rect x="40" y="22" width="1" height="1" fill="#ffffff"/>' +
    '<rect x="36" y="25" width="9" height="1" fill="#b45f22"/>' +
    '<rect x="45" y="22" width="1" height="3" fill="#8a4616"/>' +
    '<!-- ずる賢い眉 -->' +
    '<rect x="17" y="17" width="4" height="1" fill="#8a4616"/>' +
    '<rect x="20" y="18" width="4" height="1" fill="#8a4616"/>' +
    '<rect x="24" y="19" width="4" height="1" fill="#8a4616"/>' +
    '<rect x="43" y="17" width="4" height="1" fill="#8a4616"/>' +
    '<rect x="40" y="18" width="4" height="1" fill="#8a4616"/>' +
    '<rect x="36" y="19" width="4" height="1" fill="#8a4616"/>' +
    '</svg>';

  // 6:ジョーカーベア — 道化の角鈴・赤い鼻・カラフルな襟のクマ。
  var jokerBear =
    '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<!-- 耳（左） -->' +
    '<rect x="16" y="4" width="7" height="1" fill="#8a5a3b"/>' +
    '<rect x="15" y="5" width="9" height="1" fill="#8a5a3b"/>' +
    '<rect x="14" y="6" width="11" height="1" fill="#8a5a3b"/>' +
    '<rect x="13" y="7" width="12" height="4" fill="#8a5a3b"/>' +
    '<rect x="14" y="11" width="11" height="1" fill="#8a5a3b"/>' +
    '<rect x="15" y="12" width="10" height="1" fill="#8a5a3b"/>' +
    '<rect x="16" y="6" width="6" height="4" fill="#5f3c26"/>' +
    '<rect x="17" y="7" width="4" height="2" fill="#7a2b2b"/>' +
    '<rect x="14" y="7" width="2" height="3" fill="#b0805c"/>' +
    '<rect x="15" y="5" width="4" height="1" fill="#b0805c"/>' +
    '<!-- 耳（右） -->' +
    '<rect x="41" y="4" width="7" height="1" fill="#8a5a3b"/>' +
    '<rect x="40" y="5" width="9" height="1" fill="#8a5a3b"/>' +
    '<rect x="39" y="6" width="11" height="1" fill="#8a5a3b"/>' +
    '<rect x="39" y="7" width="12" height="4" fill="#8a5a3b"/>' +
    '<rect x="39" y="11" width="11" height="1" fill="#8a5a3b"/>' +
    '<rect x="39" y="12" width="10" height="1" fill="#8a5a3b"/>' +
    '<rect x="42" y="6" width="6" height="4" fill="#5f3c26"/>' +
    '<rect x="43" y="7" width="4" height="2" fill="#7a2b2b"/>' +
    '<rect x="48" y="7" width="3" height="4" fill="#5f3c26"/>' +
    '<rect x="45" y="5" width="4" height="1" fill="#5f3c26"/>' +
    '<!-- 胴体（ベース） -->' +
    '<rect x="22" y="32" width="20" height="1" fill="#8a5a3b"/>' +
    '<rect x="19" y="33" width="26" height="1" fill="#8a5a3b"/>' +
    '<rect x="17" y="34" width="30" height="1" fill="#8a5a3b"/>' +
    '<rect x="16" y="35" width="32" height="1" fill="#8a5a3b"/>' +
    '<rect x="15" y="36" width="34" height="1" fill="#8a5a3b"/>' +
    '<rect x="14" y="37" width="36" height="14" fill="#8a5a3b"/>' +
    '<rect x="15" y="51" width="34" height="1" fill="#8a5a3b"/>' +
    '<rect x="16" y="52" width="32" height="1" fill="#8a5a3b"/>' +
    '<rect x="17" y="53" width="30" height="1" fill="#8a5a3b"/>' +
    '<rect x="18" y="54" width="28" height="2" fill="#8a5a3b"/>' +
    '<!-- 首もとの影 -->' +
    '<rect x="22" y="34" width="20" height="3" fill="#5f3c26"/>' +
    '<!-- 胴の明るい面（左） -->' +
    '<rect x="17" y="35" width="5" height="1" fill="#b0805c"/>' +
    '<rect x="16" y="36" width="5" height="1" fill="#b0805c"/>' +
    '<rect x="15" y="37" width="5" height="8" fill="#b0805c"/>' +
    '<rect x="16" y="45" width="4" height="3" fill="#b0805c"/>' +
    '<rect x="17" y="48" width="3" height="3" fill="#b0805c"/>' +
    '<!-- 胴の影（右） -->' +
    '<rect x="42" y="35" width="6" height="1" fill="#5f3c26"/>' +
    '<rect x="41" y="36" width="8" height="1" fill="#5f3c26"/>' +
    '<rect x="41" y="37" width="9" height="14" fill="#5f3c26"/>' +
    '<rect x="41" y="51" width="8" height="1" fill="#5f3c26"/>' +
    '<rect x="41" y="52" width="7" height="1" fill="#5f3c26"/>' +
    '<rect x="41" y="53" width="6" height="1" fill="#5f3c26"/>' +
    '<rect x="40" y="54" width="6" height="2" fill="#5f3c26"/>' +
    '<!-- お腹の明るい面 -->' +
    '<rect x="26" y="50" width="12" height="1" fill="#b0805c"/>' +
    '<rect x="25" y="51" width="14" height="3" fill="#b0805c"/>' +
    '<rect x="26" y="54" width="12" height="2" fill="#b0805c"/>' +
    '<!-- 胸の月の輪（V字） -->' +
    '<rect x="23" y="40" width="4" height="1" fill="#e8d3b0"/>' +
    '<rect x="37" y="40" width="4" height="1" fill="#e8d3b0"/>' +
    '<rect x="24" y="41" width="4" height="1" fill="#e8d3b0"/>' +
    '<rect x="36" y="41" width="4" height="1" fill="#e8d3b0"/>' +
    '<rect x="25" y="42" width="4" height="1" fill="#e8d3b0"/>' +
    '<rect x="35" y="42" width="4" height="1" fill="#e8d3b0"/>' +
    '<rect x="26" y="43" width="4" height="1" fill="#e8d3b0"/>' +
    '<rect x="34" y="43" width="4" height="1" fill="#e8d3b0"/>' +
    '<rect x="27" y="44" width="4" height="1" fill="#e8d3b0"/>' +
    '<rect x="33" y="44" width="4" height="1" fill="#e8d3b0"/>' +
    '<rect x="28" y="45" width="4" height="1" fill="#e8d3b0"/>' +
    '<rect x="32" y="45" width="4" height="1" fill="#e8d3b0"/>' +
    '<rect x="29" y="46" width="4" height="1" fill="#e8d3b0"/>' +
    '<rect x="31" y="46" width="4" height="1" fill="#e8d3b0"/>' +
    '<rect x="30" y="47" width="4" height="2" fill="#e8d3b0"/>' +
    '<!-- 月の輪の明暗 -->' +
    '<rect x="23" y="40" width="2" height="1" fill="#fdf6ec"/>' +
    '<rect x="24" y="41" width="2" height="1" fill="#fdf6ec"/>' +
    '<rect x="25" y="42" width="2" height="1" fill="#fdf6ec"/>' +
    '<rect x="39" y="40" width="2" height="1" fill="#b0805c"/>' +
    '<rect x="38" y="41" width="2" height="1" fill="#b0805c"/>' +
    '<rect x="37" y="42" width="2" height="1" fill="#b0805c"/>' +
    '<!-- 体毛の質感 -->' +
    '<rect x="21" y="39" width="1" height="3" fill="#b0805c"/>' +
    '<rect x="20" y="44" width="1" height="3" fill="#b0805c"/>' +
    '<rect x="43" y="40" width="1" height="3" fill="#46291a"/>' +
    '<rect x="44" y="45" width="1" height="3" fill="#46291a"/>' +
    '<rect x="27" y="52" width="1" height="3" fill="#8a5a3b"/>' +
    '<rect x="31" y="51" width="1" height="4" fill="#8a5a3b"/>' +
    '<rect x="35" y="52" width="1" height="3" fill="#8a5a3b"/>' +
    '<!-- 腕（左）太い -->' +
    '<rect x="12" y="34" width="8" height="1" fill="#8a5a3b"/>' +
    '<rect x="10" y="35" width="10" height="1" fill="#8a5a3b"/>' +
    '<rect x="9" y="36" width="10" height="1" fill="#8a5a3b"/>' +
    '<rect x="8" y="37" width="11" height="1" fill="#8a5a3b"/>' +
    '<rect x="7" y="38" width="12" height="10" fill="#8a5a3b"/>' +
    '<rect x="6" y="48" width="13" height="2" fill="#8a5a3b"/>' +
    '<rect x="5" y="50" width="14" height="3" fill="#8a5a3b"/>' +
    '<rect x="6" y="53" width="13" height="1" fill="#8a5a3b"/>' +
    '<rect x="7" y="38" width="3" height="10" fill="#b0805c"/>' +
    '<rect x="6" y="48" width="3" height="2" fill="#b0805c"/>' +
    '<rect x="17" y="34" width="3" height="2" fill="#5f3c26"/>' +
    '<rect x="16" y="36" width="3" height="1" fill="#5f3c26"/>' +
    '<rect x="16" y="37" width="3" height="13" fill="#5f3c26"/>' +
    '<rect x="6" y="49" width="13" height="1" fill="#5f3c26"/>' +
    '<rect x="6" y="40" width="1" height="2" fill="#8a5a3b"/>' +
    '<rect x="6" y="44" width="1" height="2" fill="#8a5a3b"/>' +
    '<rect x="11" y="41" width="1" height="3" fill="#5f3c26"/>' +
    '<rect x="13" y="45" width="1" height="3" fill="#5f3c26"/>' +
    '<!-- 腕（右）太い -->' +
    '<rect x="44" y="34" width="8" height="1" fill="#8a5a3b"/>' +
    '<rect x="44" y="35" width="10" height="1" fill="#8a5a3b"/>' +
    '<rect x="45" y="36" width="10" height="1" fill="#8a5a3b"/>' +
    '<rect x="45" y="37" width="11" height="1" fill="#8a5a3b"/>' +
    '<rect x="45" y="38" width="12" height="10" fill="#8a5a3b"/>' +
    '<rect x="45" y="48" width="13" height="2" fill="#8a5a3b"/>' +
    '<rect x="45" y="50" width="14" height="3" fill="#8a5a3b"/>' +
    '<rect x="45" y="53" width="13" height="1" fill="#8a5a3b"/>' +
    '<rect x="44" y="34" width="2" height="2" fill="#b0805c"/>' +
    '<rect x="45" y="36" width="2" height="1" fill="#b0805c"/>' +
    '<rect x="45" y="37" width="2" height="13" fill="#b0805c"/>' +
    '<rect x="54" y="38" width="3" height="10" fill="#5f3c26"/>' +
    '<rect x="55" y="48" width="3" height="2" fill="#5f3c26"/>' +
    '<rect x="56" y="50" width="3" height="3" fill="#5f3c26"/>' +
    '<rect x="45" y="49" width="13" height="1" fill="#5f3c26"/>' +
    '<rect x="57" y="40" width="1" height="2" fill="#5f3c26"/>' +
    '<rect x="57" y="44" width="1" height="2" fill="#5f3c26"/>' +
    '<rect x="51" y="41" width="1" height="3" fill="#46291a"/>' +
    '<rect x="49" y="45" width="1" height="3" fill="#46291a"/>' +
    '<!-- 前足の爪（左） -->' +
    '<rect x="5" y="53" width="3" height="3" fill="#fdf6ec"/>' +
    '<rect x="5" y="56" width="2" height="1" fill="#fdf6ec"/>' +
    '<rect x="5" y="57" width="1" height="1" fill="#fdf6ec"/>' +
    '<rect x="9" y="54" width="3" height="3" fill="#fdf6ec"/>' +
    '<rect x="9" y="57" width="2" height="1" fill="#fdf6ec"/>' +
    '<rect x="13" y="53" width="3" height="3" fill="#fdf6ec"/>' +
    '<rect x="14" y="56" width="2" height="1" fill="#fdf6ec"/>' +
    '<rect x="15" y="57" width="1" height="1" fill="#fdf6ec"/>' +
    '<rect x="7" y="53" width="1" height="3" fill="#e8d3b0"/>' +
    '<rect x="11" y="54" width="1" height="3" fill="#e8d3b0"/>' +
    '<rect x="15" y="53" width="1" height="3" fill="#e8d3b0"/>' +
    '<!-- 前足の爪（右） -->' +
    '<rect x="56" y="53" width="3" height="3" fill="#fdf6ec"/>' +
    '<rect x="57" y="56" width="2" height="1" fill="#fdf6ec"/>' +
    '<rect x="58" y="57" width="1" height="1" fill="#fdf6ec"/>' +
    '<rect x="52" y="54" width="3" height="3" fill="#fdf6ec"/>' +
    '<rect x="53" y="57" width="2" height="1" fill="#fdf6ec"/>' +
    '<rect x="48" y="53" width="3" height="3" fill="#fdf6ec"/>' +
    '<rect x="48" y="56" width="2" height="1" fill="#fdf6ec"/>' +
    '<rect x="48" y="57" width="1" height="1" fill="#fdf6ec"/>' +
    '<rect x="58" y="53" width="1" height="3" fill="#e8d3b0"/>' +
    '<rect x="54" y="54" width="1" height="3" fill="#e8d3b0"/>' +
    '<rect x="50" y="53" width="1" height="3" fill="#e8d3b0"/>' +
    '<!-- 後ろ足（左） -->' +
    '<rect x="19" y="55" width="11" height="1" fill="#5f3c26"/>' +
    '<rect x="18" y="56" width="12" height="3" fill="#5f3c26"/>' +
    '<rect x="19" y="59" width="10" height="1" fill="#5f3c26"/>' +
    '<rect x="20" y="55" width="8" height="1" fill="#8a5a3b"/>' +
    '<rect x="19" y="57" width="2" height="2" fill="#b0805c"/>' +
    '<rect x="22" y="57" width="2" height="2" fill="#b0805c"/>' +
    '<rect x="25" y="57" width="2" height="2" fill="#b0805c"/>' +
    '<!-- 後ろ足（右） -->' +
    '<rect x="34" y="55" width="11" height="1" fill="#5f3c26"/>' +
    '<rect x="34" y="56" width="12" height="3" fill="#5f3c26"/>' +
    '<rect x="35" y="59" width="10" height="1" fill="#5f3c26"/>' +
    '<rect x="36" y="55" width="8" height="1" fill="#8a5a3b"/>' +
    '<rect x="43" y="57" width="2" height="2" fill="#b0805c"/>' +
    '<rect x="40" y="57" width="2" height="2" fill="#b0805c"/>' +
    '<rect x="37" y="57" width="2" height="2" fill="#b0805c"/>' +
    '<!-- 頭（毛先） -->' +
    '<rect x="26" y="9" width="2" height="1" fill="#8a5a3b"/>' +
    '<rect x="31" y="9" width="3" height="1" fill="#8a5a3b"/>' +
    '<rect x="37" y="9" width="2" height="1" fill="#8a5a3b"/>' +
    '<!-- 頭 -->' +
    '<rect x="22" y="10" width="20" height="1" fill="#8a5a3b"/>' +
    '<rect x="20" y="11" width="24" height="1" fill="#8a5a3b"/>' +
    '<rect x="19" y="12" width="26" height="1" fill="#8a5a3b"/>' +
    '<rect x="18" y="13" width="28" height="1" fill="#8a5a3b"/>' +
    '<rect x="17" y="14" width="30" height="15" fill="#8a5a3b"/>' +
    '<rect x="18" y="29" width="28" height="1" fill="#8a5a3b"/>' +
    '<rect x="19" y="30" width="26" height="1" fill="#8a5a3b"/>' +
    '<rect x="20" y="31" width="24" height="1" fill="#8a5a3b"/>' +
    '<rect x="22" y="32" width="20" height="2" fill="#8a5a3b"/>' +
    '<rect x="24" y="34" width="16" height="2" fill="#8a5a3b"/>' +
    '<rect x="25" y="36" width="14" height="1" fill="#8a5a3b"/>' +
    '<rect x="27" y="37" width="10" height="1" fill="#8a5a3b"/>' +
    '<rect x="29" y="38" width="6" height="1" fill="#8a5a3b"/>' +
    '<!-- あごの下に落ちる影（頭と胸を分ける） -->' +
    '<rect x="25" y="37" width="2" height="2" fill="#5f3c26"/>' +
    '<rect x="37" y="37" width="2" height="2" fill="#5f3c26"/>' +
    '<rect x="27" y="39" width="10" height="1" fill="#5f3c26"/>' +
    '<rect x="29" y="40" width="6" height="1" fill="#5f3c26"/>' +
    '<!-- 頭の明るい面（左上） -->' +
    '<rect x="24" y="10" width="8" height="1" fill="#b0805c"/>' +
    '<rect x="21" y="11" width="9" height="2" fill="#b0805c"/>' +
    '<rect x="19" y="13" width="8" height="2" fill="#b0805c"/>' +
    '<rect x="18" y="15" width="6" height="3" fill="#b0805c"/>' +
    '<rect x="17" y="18" width="4" height="5" fill="#b0805c"/>' +
    '<rect x="18" y="23" width="3" height="4" fill="#b0805c"/>' +
    '<!-- 頭の影（右） -->' +
    '<rect x="41" y="11" width="3" height="1" fill="#5f3c26"/>' +
    '<rect x="42" y="12" width="3" height="1" fill="#5f3c26"/>' +
    '<rect x="42" y="13" width="4" height="1" fill="#5f3c26"/>' +
    '<rect x="42" y="14" width="5" height="14" fill="#5f3c26"/>' +
    '<rect x="41" y="28" width="5" height="1" fill="#5f3c26"/>' +
    '<rect x="40" y="29" width="6" height="1" fill="#5f3c26"/>' +
    '<rect x="39" y="30" width="6" height="1" fill="#5f3c26"/>' +
    '<rect x="38" y="31" width="6" height="1" fill="#5f3c26"/>' +
    '<rect x="37" y="32" width="5" height="2" fill="#5f3c26"/>' +
    '<rect x="36" y="34" width="4" height="2" fill="#5f3c26"/>' +
    '<rect x="36" y="36" width="3" height="1" fill="#5f3c26"/>' +
    '<!-- 顔まわりの毛先 -->' +
    '<rect x="16" y="18" width="1" height="2" fill="#8a5a3b"/>' +
    '<rect x="16" y="22" width="1" height="2" fill="#8a5a3b"/>' +
    '<rect x="16" y="26" width="1" height="2" fill="#8a5a3b"/>' +
    '<rect x="47" y="18" width="1" height="2" fill="#5f3c26"/>' +
    '<rect x="47" y="22" width="1" height="2" fill="#5f3c26"/>' +
    '<rect x="47" y="26" width="1" height="2" fill="#5f3c26"/>' +
    '<rect x="25" y="11" width="1" height="2" fill="#5f3c26"/>' +
    '<rect x="30" y="10" width="1" height="3" fill="#5f3c26"/>' +
    '<rect x="35" y="11" width="1" height="2" fill="#5f3c26"/>' +
    '<!-- 目（ふち・白目・黒目・光） -->' +
    '<rect x="20" y="16" width="10" height="8" fill="#5f3c26"/>' +
    '<rect x="34" y="16" width="10" height="8" fill="#5f3c26"/>' +
    '<rect x="21" y="17" width="8" height="6" fill="#ffffff"/>' +
    '<rect x="35" y="17" width="8" height="6" fill="#ffffff"/>' +
    '<rect x="23" y="18" width="5" height="5" fill="#1a1a1a"/>' +
    '<rect x="36" y="18" width="5" height="5" fill="#1a1a1a"/>' +
    '<rect x="24" y="19" width="1" height="1" fill="#ffffff"/>' +
    '<rect x="37" y="19" width="1" height="1" fill="#ffffff"/>' +
    '<!-- にらむ眉 -->' +
    '<rect x="19" y="13" width="5" height="2" fill="#2b1810"/>' +
    '<rect x="22" y="14" width="4" height="2" fill="#2b1810"/>' +
    '<rect x="24" y="15" width="4" height="2" fill="#2b1810"/>' +
    '<rect x="27" y="16" width="4" height="2" fill="#2b1810"/>' +
    '<rect x="40" y="13" width="5" height="2" fill="#2b1810"/>' +
    '<rect x="38" y="14" width="4" height="2" fill="#2b1810"/>' +
    '<rect x="36" y="15" width="4" height="2" fill="#2b1810"/>' +
    '<rect x="33" y="16" width="4" height="2" fill="#2b1810"/>' +
    '<!-- マズル -->' +
    '<rect x="27" y="24" width="10" height="1" fill="#b0805c"/>' +
    '<rect x="25" y="25" width="14" height="1" fill="#b0805c"/>' +
    '<rect x="24" y="26" width="16" height="8" fill="#b0805c"/>' +
    '<rect x="25" y="34" width="14" height="1" fill="#b0805c"/>' +
    '<rect x="26" y="35" width="12" height="1" fill="#b0805c"/>' +
    '<rect x="27" y="36" width="10" height="1" fill="#b0805c"/>' +
    '<rect x="29" y="37" width="6" height="1" fill="#b0805c"/>' +
    '<rect x="36" y="26" width="4" height="8" fill="#8a5a3b"/>' +
    '<rect x="35" y="34" width="4" height="1" fill="#8a5a3b"/>' +
    '<rect x="34" y="35" width="4" height="1" fill="#8a5a3b"/>' +
    '<rect x="25" y="26" width="3" height="4" fill="#e8d3b0"/>' +
    '<!-- 鼻 -->' +
    '<rect x="29" y="24" width="6" height="1" fill="#46291a"/>' +
    '<rect x="28" y="25" width="8" height="3" fill="#46291a"/>' +
    '<rect x="29" y="28" width="6" height="1" fill="#46291a"/>' +
    '<rect x="29" y="25" width="3" height="1" fill="#5f3c26"/>' +
    '<rect x="29" y="26" width="2" height="1" fill="#1a1a1a"/>' +
    '<rect x="33" y="26" width="2" height="1" fill="#1a1a1a"/>' +
    '<rect x="31" y="29" width="2" height="1" fill="#8a5a3b"/>' +
    '<!-- 開いた口 -->' +
    '<rect x="26" y="30" width="12" height="1" fill="#46291a"/>' +
    '<rect x="25" y="31" width="14" height="3" fill="#46291a"/>' +
    '<rect x="26" y="34" width="12" height="1" fill="#46291a"/>' +
    '<rect x="28" y="35" width="8" height="1" fill="#46291a"/>' +
    '<rect x="30" y="36" width="4" height="1" fill="#46291a"/>' +
    '<rect x="27" y="31" width="10" height="1" fill="#7a2b2b"/>' +
    '<rect x="26" y="32" width="12" height="2" fill="#7a2b2b"/>' +
    '<rect x="27" y="34" width="10" height="1" fill="#7a2b2b"/>' +
    '<rect x="29" y="35" width="6" height="1" fill="#7a2b2b"/>' +
    '<!-- 牙と舌 -->' +
    '<rect x="28" y="31" width="8" height="1" fill="#fdf6ec"/>' +
    '<rect x="27" y="32" width="3" height="3" fill="#fdf6ec"/>' +
    '<rect x="34" y="32" width="3" height="3" fill="#fdf6ec"/>' +
    '<rect x="29" y="32" width="1" height="3" fill="#e8d3b0"/>' +
    '<rect x="36" y="32" width="1" height="3" fill="#e8d3b0"/>' +
    '<rect x="30" y="34" width="4" height="1" fill="#9c3b3b"/>' +
    '<rect x="30" y="35" width="4" height="1" fill="#e8d3b0"/>' +
    '</svg>';

  // 7:ハイイーグル — 白頭・黄のかぎ嘴・翼を広げたりりしい鷲。
  var highEagle =
    '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<!-- 尾羽（体のうしろで下へ大きく開く扇。脚はこの手前に重なる） -->' +
    '<rect x="28" y="39" width="8" height="4" fill="#5a3b28"/>' +
    '<rect x="27" y="43" width="10" height="4" fill="#5a3b28"/>' +
    '<rect x="25" y="47" width="14" height="3" fill="#5a3b28"/>' +
    '<rect x="23" y="50" width="18" height="3" fill="#5a3b28"/>' +
    '<rect x="22" y="53" width="20" height="3" fill="#5a3b28"/>' +
    '<!-- 尾羽の先（ぎざぎざ） -->' +
    '<rect x="22" y="56" width="3" height="1" fill="#5a3b28"/>' +
    '<rect x="39" y="56" width="3" height="1" fill="#5a3b28"/>' +
    '<rect x="26" y="56" width="12" height="1" fill="#5a3b28"/>' +
    '<!-- 尾羽の真ん中をほんのり明るく -->' +
    '<rect x="31" y="40" width="2" height="15" fill="#6b4a33"/>' +
    '<!-- 尾羽のたてのすじ -->' +
    '<rect x="28" y="43" width="1" height="12" fill="#4a3423"/>' +
    '<rect x="35" y="43" width="1" height="12" fill="#4a3423"/>' +
    '<rect x="26" y="47" width="1" height="8" fill="#4a3423"/>' +
    '<rect x="37" y="47" width="1" height="8" fill="#4a3423"/>' +
    '<rect x="24" y="50" width="1" height="5" fill="#4a3423"/>' +
    '<rect x="39" y="50" width="1" height="5" fill="#4a3423"/>' +
    '<!-- 尾羽の横しま（羽のかさなり） -->' +
    '<rect x="28" y="42" width="8" height="1" fill="#4a3423"/>' +
    '<rect x="27" y="46" width="10" height="1" fill="#4a3423"/>' +
    '<rect x="25" y="49" width="14" height="1" fill="#4a3423"/>' +
    '<rect x="23" y="52" width="18" height="1" fill="#4a3423"/>' +
    '<!-- 尾羽の先の濃い帯 -->' +
    '<rect x="22" y="55" width="20" height="1" fill="#3a2718"/>' +
    '<!-- 翼の土台 -->' +
    '<rect x="5" y="13" width="9" height="1" fill="#6b4a33"/>' +
    '<rect x="50" y="13" width="9" height="1" fill="#6b4a33"/>' +
    '<rect x="4" y="14" width="12" height="1" fill="#6b4a33"/>' +
    '<rect x="48" y="14" width="12" height="1" fill="#6b4a33"/>' +
    '<rect x="4" y="15" width="15" height="1" fill="#6b4a33"/>' +
    '<rect x="45" y="15" width="15" height="1" fill="#6b4a33"/>' +
    '<rect x="4" y="16" width="18" height="1" fill="#6b4a33"/>' +
    '<rect x="42" y="16" width="18" height="1" fill="#6b4a33"/>' +
    '<rect x="4" y="17" width="21" height="1" fill="#6b4a33"/>' +
    '<rect x="39" y="17" width="21" height="1" fill="#6b4a33"/>' +
    '<rect x="4" y="18" width="21" height="11" fill="#6b4a33"/>' +
    '<rect x="39" y="18" width="21" height="11" fill="#6b4a33"/>' +
    '<!-- 翼の前ふち（濃い羽で段差の輪郭を出す） -->' +
    '<rect x="6" y="12" width="6" height="1" fill="#4a3423"/>' +
    '<rect x="52" y="12" width="6" height="1" fill="#4a3423"/>' +
    '<rect x="5" y="13" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="57" y="13" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="12" y="13" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="50" y="13" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="4" y="14" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="58" y="14" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="14" y="14" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="48" y="14" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="16" y="15" width="3" height="1" fill="#4a3423"/>' +
    '<rect x="45" y="15" width="3" height="1" fill="#4a3423"/>' +
    '<rect x="19" y="16" width="3" height="1" fill="#4a3423"/>' +
    '<rect x="42" y="16" width="3" height="1" fill="#4a3423"/>' +
    '<rect x="22" y="17" width="3" height="1" fill="#4a3423"/>' +
    '<rect x="39" y="17" width="3" height="1" fill="#4a3423"/>' +
    '<rect x="4" y="15" width="1" height="14" fill="#4a3423"/>' +
    '<rect x="59" y="15" width="1" height="14" fill="#4a3423"/>' +
    '<!-- 肩の暗がり（体との継ぎ目） -->' +
    '<rect x="21" y="17" width="4" height="12" fill="#4a3423"/>' +
    '<rect x="39" y="17" width="4" height="12" fill="#4a3423"/>' +
    '<!-- 翼のハイライト -->' +
    '<rect x="6" y="14" width="8" height="1" fill="#8a6244"/>' +
    '<rect x="50" y="14" width="8" height="1" fill="#8a6244"/>' +
    '<!-- 雨覆（うわおおい）の羽もよう・一段目 -->' +
    '<rect x="6" y="19" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="56" y="19" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="10" y="19" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="52" y="19" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="14" y="19" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="48" y="19" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="18" y="19" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="44" y="19" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="22" y="19" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="40" y="19" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="6" y="20" width="2" height="1" fill="#8a6244"/>' +
    '<rect x="56" y="20" width="2" height="1" fill="#8a6244"/>' +
    '<rect x="10" y="20" width="2" height="1" fill="#8a6244"/>' +
    '<rect x="52" y="20" width="2" height="1" fill="#8a6244"/>' +
    '<rect x="14" y="20" width="2" height="1" fill="#8a6244"/>' +
    '<rect x="48" y="20" width="2" height="1" fill="#8a6244"/>' +
    '<rect x="18" y="20" width="2" height="1" fill="#8a6244"/>' +
    '<rect x="44" y="20" width="2" height="1" fill="#8a6244"/>' +
    '<rect x="22" y="20" width="2" height="1" fill="#8a6244"/>' +
    '<rect x="40" y="20" width="2" height="1" fill="#8a6244"/>' +
    '<!-- 雨覆の羽もよう・二段目（互い違い） -->' +
    '<rect x="8" y="23" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="54" y="23" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="12" y="23" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="50" y="23" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="16" y="23" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="46" y="23" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="20" y="23" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="42" y="23" width="2" height="1" fill="#4a3423"/>' +
    '<!-- 雨覆と風切羽のさかいめ -->' +
    '<rect x="4" y="27" width="21" height="1" fill="#4a3423"/>' +
    '<rect x="39" y="27" width="21" height="1" fill="#4a3423"/>' +
    '<!-- 風切羽 1枚目（いちばん外側・短い） -->' +
    '<rect x="4" y="28" width="4" height="6" fill="#6b4a33"/>' +
    '<rect x="56" y="28" width="4" height="6" fill="#6b4a33"/>' +
    '<rect x="4" y="28" width="1" height="6" fill="#4a3423"/>' +
    '<rect x="59" y="28" width="1" height="6" fill="#4a3423"/>' +
    '<rect x="7" y="28" width="1" height="6" fill="#8a6244"/>' +
    '<rect x="56" y="28" width="1" height="6" fill="#8a6244"/>' +
    '<rect x="5" y="31" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="57" y="31" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="5" y="34" width="2" height="2" fill="#5a3b28"/>' +
    '<rect x="57" y="34" width="2" height="2" fill="#5a3b28"/>' +
    '<!-- 風切羽 2枚目 -->' +
    '<rect x="9" y="28" width="4" height="9" fill="#6b4a33"/>' +
    '<rect x="51" y="28" width="4" height="9" fill="#6b4a33"/>' +
    '<rect x="9" y="28" width="1" height="9" fill="#4a3423"/>' +
    '<rect x="54" y="28" width="1" height="9" fill="#4a3423"/>' +
    '<rect x="12" y="28" width="1" height="9" fill="#8a6244"/>' +
    '<rect x="51" y="28" width="1" height="9" fill="#8a6244"/>' +
    '<rect x="10" y="32" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="52" y="32" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="10" y="37" width="2" height="2" fill="#5a3b28"/>' +
    '<rect x="52" y="37" width="2" height="2" fill="#5a3b28"/>' +
    '<!-- 風切羽 3枚目 -->' +
    '<rect x="14" y="28" width="4" height="11" fill="#6b4a33"/>' +
    '<rect x="46" y="28" width="4" height="11" fill="#6b4a33"/>' +
    '<rect x="14" y="28" width="1" height="11" fill="#4a3423"/>' +
    '<rect x="49" y="28" width="1" height="11" fill="#4a3423"/>' +
    '<rect x="17" y="28" width="1" height="11" fill="#8a6244"/>' +
    '<rect x="46" y="28" width="1" height="11" fill="#8a6244"/>' +
    '<rect x="15" y="33" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="47" y="33" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="15" y="39" width="2" height="2" fill="#5a3b28"/>' +
    '<rect x="47" y="39" width="2" height="2" fill="#5a3b28"/>' +
    '<!-- 風切羽 4枚目（体側・いちばん長い） -->' +
    '<rect x="19" y="28" width="6" height="13" fill="#6b4a33"/>' +
    '<rect x="39" y="28" width="6" height="13" fill="#6b4a33"/>' +
    '<rect x="19" y="28" width="1" height="13" fill="#4a3423"/>' +
    '<rect x="44" y="28" width="1" height="13" fill="#4a3423"/>' +
    '<rect x="23" y="28" width="1" height="13" fill="#8a6244"/>' +
    '<rect x="40" y="28" width="1" height="13" fill="#8a6244"/>' +
    '<rect x="20" y="35" width="3" height="1" fill="#4a3423"/>' +
    '<rect x="41" y="35" width="3" height="1" fill="#4a3423"/>' +
    '<rect x="20" y="41" width="3" height="2" fill="#5a3b28"/>' +
    '<rect x="41" y="41" width="3" height="2" fill="#5a3b28"/>' +
    '<!-- 体（濃い茶色） -->' +
    '<rect x="26" y="19" width="12" height="1" fill="#6b4a33"/>' +
    '<rect x="25" y="20" width="14" height="1" fill="#6b4a33"/>' +
    '<rect x="24" y="21" width="16" height="13" fill="#6b4a33"/>' +
    '<rect x="25" y="34" width="14" height="2" fill="#6b4a33"/>' +
    '<rect x="26" y="36" width="12" height="2" fill="#6b4a33"/>' +
    '<rect x="27" y="38" width="10" height="1" fill="#6b4a33"/>' +
    '<rect x="28" y="39" width="8" height="1" fill="#6b4a33"/>' +
    '<!-- 体のふちの影 -->' +
    '<rect x="24" y="21" width="1" height="13" fill="#4a3423"/>' +
    '<rect x="39" y="21" width="1" height="13" fill="#4a3423"/>' +
    '<rect x="25" y="34" width="1" height="2" fill="#4a3423"/>' +
    '<rect x="38" y="34" width="1" height="2" fill="#4a3423"/>' +
    '<rect x="26" y="36" width="1" height="2" fill="#4a3423"/>' +
    '<rect x="37" y="36" width="1" height="2" fill="#4a3423"/>' +
    '<!-- 胸（少し明るい茶色） -->' +
    '<rect x="27" y="23" width="10" height="10" fill="#8a6244"/>' +
    '<!-- 胸の羽もよう（V字を三段） -->' +
    '<rect x="28" y="25" width="2" height="1" fill="#5a3b28"/>' +
    '<rect x="34" y="25" width="2" height="1" fill="#5a3b28"/>' +
    '<rect x="30" y="26" width="2" height="1" fill="#5a3b28"/>' +
    '<rect x="32" y="26" width="2" height="1" fill="#5a3b28"/>' +
    '<rect x="28" y="28" width="2" height="1" fill="#5a3b28"/>' +
    '<rect x="34" y="28" width="2" height="1" fill="#5a3b28"/>' +
    '<rect x="30" y="29" width="2" height="1" fill="#5a3b28"/>' +
    '<rect x="32" y="29" width="2" height="1" fill="#5a3b28"/>' +
    '<rect x="28" y="31" width="2" height="1" fill="#5a3b28"/>' +
    '<rect x="34" y="31" width="2" height="1" fill="#5a3b28"/>' +
    '<rect x="30" y="32" width="2" height="1" fill="#5a3b28"/>' +
    '<rect x="32" y="32" width="2" height="1" fill="#5a3b28"/>' +
    '<!-- 腹の影 -->' +
    '<rect x="26" y="33" width="12" height="3" fill="#5a3b28"/>' +
    '<!-- 太もも（羽におおわれた部分） -->' +
    '<rect x="23" y="30" width="6" height="8" fill="#5a3b28"/>' +
    '<rect x="35" y="30" width="6" height="8" fill="#5a3b28"/>' +
    '<rect x="24" y="32" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="38" y="32" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="26" y="34" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="36" y="34" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="23" y="36" width="2" height="1" fill="#4a3423"/>' +
    '<rect x="39" y="36" width="2" height="1" fill="#4a3423"/>' +
    '<!-- 足首（黄色）とうろこ -->' +
    '<rect x="24" y="37" width="4" height="5" fill="#f0b429"/>' +
    '<rect x="36" y="37" width="4" height="5" fill="#f0b429"/>' +
    '<rect x="24" y="37" width="1" height="5" fill="#c98a1a"/>' +
    '<rect x="39" y="37" width="1" height="5" fill="#c98a1a"/>' +
    '<rect x="25" y="37" width="1" height="4" fill="#ffd166"/>' +
    '<rect x="38" y="37" width="1" height="4" fill="#ffd166"/>' +
    '<rect x="24" y="38" width="4" height="1" fill="#c98a1a"/>' +
    '<rect x="36" y="38" width="4" height="1" fill="#c98a1a"/>' +
    '<rect x="24" y="40" width="4" height="1" fill="#c98a1a"/>' +
    '<rect x="36" y="40" width="4" height="1" fill="#c98a1a"/>' +
    '<!-- 足の付け根 -->' +
    '<rect x="22" y="41" width="6" height="2" fill="#f0b429"/>' +
    '<rect x="36" y="41" width="6" height="2" fill="#f0b429"/>' +
    '<rect x="22" y="41" width="6" height="1" fill="#ffd166"/>' +
    '<rect x="36" y="41" width="6" height="1" fill="#ffd166"/>' +
    '<!-- 三本の指（外へひらく） -->' +
    '<rect x="21" y="43" width="2" height="3" fill="#f0b429"/>' +
    '<rect x="41" y="43" width="2" height="3" fill="#f0b429"/>' +
    '<rect x="24" y="43" width="2" height="4" fill="#f0b429"/>' +
    '<rect x="38" y="43" width="2" height="4" fill="#f0b429"/>' +
    '<rect x="27" y="43" width="2" height="3" fill="#f0b429"/>' +
    '<rect x="35" y="43" width="2" height="3" fill="#f0b429"/>' +
    '<rect x="21" y="45" width="2" height="1" fill="#c98a1a"/>' +
    '<rect x="41" y="45" width="2" height="1" fill="#c98a1a"/>' +
    '<rect x="24" y="46" width="2" height="1" fill="#c98a1a"/>' +
    '<rect x="38" y="46" width="2" height="1" fill="#c98a1a"/>' +
    '<rect x="27" y="45" width="2" height="1" fill="#c98a1a"/>' +
    '<rect x="35" y="45" width="2" height="1" fill="#c98a1a"/>' +
    '<!-- 鋭いかぎ爪 -->' +
    '<rect x="20" y="46" width="2" height="2" fill="#333333"/>' +
    '<rect x="42" y="46" width="2" height="2" fill="#333333"/>' +
    '<rect x="24" y="47" width="2" height="2" fill="#333333"/>' +
    '<rect x="38" y="47" width="2" height="2" fill="#333333"/>' +
    '<rect x="27" y="46" width="2" height="2" fill="#333333"/>' +
    '<rect x="35" y="46" width="2" height="2" fill="#333333"/>' +
    '<rect x="20" y="48" width="1" height="1" fill="#111111"/>' +
    '<rect x="43" y="48" width="1" height="1" fill="#111111"/>' +
    '<rect x="24" y="49" width="1" height="2" fill="#111111"/>' +
    '<rect x="39" y="49" width="1" height="2" fill="#111111"/>' +
    '<rect x="27" y="48" width="1" height="1" fill="#111111"/>' +
    '<rect x="36" y="48" width="1" height="1" fill="#111111"/>' +
    '<!-- 首まわりの白い羽（肩をおおう） -->' +
    '<rect x="24" y="19" width="16" height="1" fill="#efe7d8"/>' +
    '<rect x="23" y="20" width="18" height="2" fill="#efe7d8"/>' +
    '<rect x="24" y="22" width="16" height="1" fill="#d6cbb6"/>' +
    '<rect x="24" y="23" width="3" height="1" fill="#d6cbb6"/>' +
    '<rect x="37" y="23" width="3" height="1" fill="#d6cbb6"/>' +
    '<rect x="28" y="23" width="3" height="1" fill="#d6cbb6"/>' +
    '<rect x="33" y="23" width="3" height="1" fill="#d6cbb6"/>' +
    '<rect x="25" y="24" width="2" height="1" fill="#d6cbb6"/>' +
    '<rect x="37" y="24" width="2" height="1" fill="#d6cbb6"/>' +
    '<rect x="29" y="24" width="2" height="1" fill="#d6cbb6"/>' +
    '<rect x="33" y="24" width="2" height="1" fill="#d6cbb6"/>' +
    '<rect x="26" y="20" width="1" height="2" fill="#d6cbb6"/>' +
    '<rect x="37" y="20" width="1" height="2" fill="#d6cbb6"/>' +
    '<rect x="30" y="20" width="1" height="2" fill="#d6cbb6"/>' +
    '<rect x="33" y="20" width="1" height="2" fill="#d6cbb6"/>' +
    '<!-- 頭 -->' +
    '<rect x="29" y="5" width="6" height="1" fill="#efe7d8"/>' +
    '<rect x="27" y="6" width="10" height="1" fill="#efe7d8"/>' +
    '<rect x="25" y="7" width="14" height="1" fill="#efe7d8"/>' +
    '<rect x="24" y="8" width="16" height="1" fill="#efe7d8"/>' +
    '<rect x="23" y="9" width="18" height="1" fill="#efe7d8"/>' +
    '<rect x="23" y="10" width="18" height="7" fill="#efe7d8"/>' +
    '<rect x="24" y="17" width="16" height="1" fill="#efe7d8"/>' +
    '<rect x="25" y="18" width="14" height="1" fill="#efe7d8"/>' +
    '<!-- 頭のハイライト -->' +
    '<rect x="28" y="6" width="8" height="1" fill="#f7f2e8"/>' +
    '<rect x="27" y="7" width="10" height="1" fill="#f7f2e8"/>' +
    '<rect x="26" y="8" width="12" height="1" fill="#f7f2e8"/>' +
    '<!-- 頭の影と羽のふぞろい -->' +
    '<rect x="23" y="10" width="1" height="7" fill="#d6cbb6"/>' +
    '<rect x="40" y="10" width="1" height="7" fill="#d6cbb6"/>' +
    '<rect x="25" y="18" width="14" height="1" fill="#d6cbb6"/>' +
    '<rect x="25" y="7" width="2" height="1" fill="#d6cbb6"/>' +
    '<rect x="37" y="7" width="2" height="1" fill="#d6cbb6"/>' +
    '<rect x="31" y="7" width="2" height="1" fill="#d6cbb6"/>' +
    '<rect x="30" y="9" width="4" height="1" fill="#d6cbb6"/>' +
    '<rect x="24" y="17" width="3" height="1" fill="#d6cbb6"/>' +
    '<rect x="37" y="17" width="3" height="1" fill="#d6cbb6"/>' +
    '<rect x="28" y="17" width="2" height="1" fill="#d6cbb6"/>' +
    '<rect x="34" y="17" width="2" height="1" fill="#d6cbb6"/>' +
    '<!-- 目のふち（落ちくぼんだ濃い茶） -->' +
    '<rect x="24" y="10" width="6" height="7" fill="#3b2a1c"/>' +
    '<rect x="34" y="10" width="6" height="7" fill="#3b2a1c"/>' +
    '<!-- 白目 -->' +
    '<rect x="25" y="11" width="4" height="5" fill="#ffffff"/>' +
    '<rect x="35" y="11" width="4" height="5" fill="#ffffff"/>' +
    '<!-- 黒目（内を向いた鋭い目つき） -->' +
    '<rect x="26" y="12" width="3" height="3" fill="#222222"/>' +
    '<rect x="35" y="12" width="3" height="3" fill="#222222"/>' +
    '<!-- 目の光 -->' +
    '<rect x="26" y="12" width="1" height="1" fill="#ffffff"/>' +
    '<rect x="37" y="12" width="1" height="1" fill="#ffffff"/>' +
    '<!-- 鋭い眉（目の上にかぶさる） -->' +
    '<rect x="23" y="9" width="7" height="1" fill="#3a2718"/>' +
    '<rect x="34" y="9" width="7" height="1" fill="#3a2718"/>' +
    '<rect x="24" y="10" width="6" height="1" fill="#4a3423"/>' +
    '<rect x="34" y="10" width="6" height="1" fill="#4a3423"/>' +
    '<rect x="27" y="11" width="3" height="1" fill="#4a3423"/>' +
    '<rect x="34" y="11" width="3" height="1" fill="#4a3423"/>' +
    '<!-- くちばし（黄色のかぎ形） -->' +
    '<rect x="29" y="12" width="6" height="1" fill="#c98a1a"/>' +
    '<rect x="29" y="13" width="6" height="4" fill="#f0b429"/>' +
    '<rect x="30" y="17" width="4" height="4" fill="#f0b429"/>' +
    '<rect x="31" y="21" width="2" height="2" fill="#f0b429"/>' +
    '<!-- くちばしの陰影 -->' +
    '<rect x="31" y="13" width="2" height="4" fill="#ffd166"/>' +
    '<rect x="31" y="17" width="2" height="2" fill="#ffd166"/>' +
    '<rect x="29" y="13" width="1" height="4" fill="#c98a1a"/>' +
    '<rect x="34" y="13" width="1" height="4" fill="#c98a1a"/>' +
    '<rect x="30" y="17" width="1" height="4" fill="#c98a1a"/>' +
    '<rect x="33" y="17" width="1" height="4" fill="#c98a1a"/>' +
    '<!-- 鼻の穴 -->' +
    '<rect x="30" y="14" width="1" height="1" fill="#8a5c08"/>' +
    '<rect x="33" y="14" width="1" height="1" fill="#8a5c08"/>' +
    '<!-- くちばしの先（かぎ） -->' +
    '<rect x="31" y="21" width="2" height="1" fill="#c98a1a"/>' +
    '<rect x="31" y="22" width="2" height="1" fill="#a8700f"/>' +
    '</svg>';

  // 8:ドラゴン — 角・背びれ・スリット目・牙。いちばん強くこわい竜。
  var dragon =
    '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
    '<!-- 翼の骨（肩から外へ上がる） -->' +
    '<rect x="22" y="30" width="3" height="2" fill="#3f8f4a"/>' +
    '<rect x="39" y="30" width="3" height="2" fill="#3f8f4a"/>' +
    '<rect x="19" y="28" width="3" height="2" fill="#3f8f4a"/>' +
    '<rect x="42" y="28" width="3" height="2" fill="#3f8f4a"/>' +
    '<rect x="16" y="26" width="3" height="2" fill="#3f8f4a"/>' +
    '<rect x="45" y="26" width="3" height="2" fill="#3f8f4a"/>' +
    '<rect x="13" y="24" width="3" height="2" fill="#3f8f4a"/>' +
    '<rect x="48" y="24" width="3" height="2" fill="#3f8f4a"/>' +
    '<rect x="10" y="23" width="3" height="2" fill="#3f8f4a"/>' +
    '<rect x="51" y="23" width="3" height="2" fill="#3f8f4a"/>' +
    '<rect x="7" y="22" width="3" height="2" fill="#3f8f4a"/>' +
    '<rect x="54" y="22" width="3" height="2" fill="#3f8f4a"/>' +
    '<rect x="4" y="22" width="3" height="2" fill="#3f8f4a"/>' +
    '<rect x="57" y="22" width="3" height="2" fill="#3f8f4a"/>' +
    '<!-- 翼膜（赤・下ふちを3つの弧にする） -->' +
    '<rect x="22" y="32" width="3" height="8" fill="#1f6b52"/>' +
    '<rect x="39" y="32" width="3" height="8" fill="#1f6b52"/>' +
    '<rect x="19" y="30" width="3" height="13" fill="#1f6b52"/>' +
    '<rect x="42" y="30" width="3" height="13" fill="#1f6b52"/>' +
    '<rect x="16" y="28" width="3" height="13" fill="#1f6b52"/>' +
    '<rect x="45" y="28" width="3" height="13" fill="#1f6b52"/>' +
    '<rect x="13" y="26" width="3" height="18" fill="#1f6b52"/>' +
    '<rect x="48" y="26" width="3" height="18" fill="#1f6b52"/>' +
    '<rect x="10" y="25" width="3" height="17" fill="#1f6b52"/>' +
    '<rect x="51" y="25" width="3" height="17" fill="#1f6b52"/>' +
    '<rect x="7" y="24" width="3" height="21" fill="#1f6b52"/>' +
    '<rect x="54" y="24" width="3" height="21" fill="#1f6b52"/>' +
    '<rect x="4" y="24" width="3" height="14" fill="#1f6b52"/>' +
    '<rect x="57" y="24" width="3" height="14" fill="#1f6b52"/>' +
    '<!-- 翼膜の影（下ふち） -->' +
    '<rect x="22" y="38" width="3" height="2" fill="#12483a"/>' +
    '<rect x="39" y="38" width="3" height="2" fill="#12483a"/>' +
    '<rect x="19" y="41" width="3" height="2" fill="#12483a"/>' +
    '<rect x="42" y="41" width="3" height="2" fill="#12483a"/>' +
    '<rect x="16" y="39" width="3" height="2" fill="#12483a"/>' +
    '<rect x="45" y="39" width="3" height="2" fill="#12483a"/>' +
    '<rect x="13" y="42" width="3" height="2" fill="#12483a"/>' +
    '<rect x="48" y="42" width="3" height="2" fill="#12483a"/>' +
    '<rect x="10" y="40" width="3" height="2" fill="#12483a"/>' +
    '<rect x="51" y="40" width="3" height="2" fill="#12483a"/>' +
    '<rect x="7" y="43" width="3" height="2" fill="#12483a"/>' +
    '<rect x="54" y="43" width="3" height="2" fill="#12483a"/>' +
    '<rect x="4" y="36" width="3" height="2" fill="#12483a"/>' +
    '<rect x="57" y="36" width="3" height="2" fill="#12483a"/>' +
    '<!-- 翼の指の骨（膜を縦に区切る） -->' +
    '<rect x="20" y="30" width="1" height="11" fill="#12483a"/>' +
    '<rect x="43" y="30" width="1" height="11" fill="#12483a"/>' +
    '<rect x="17" y="28" width="1" height="11" fill="#12483a"/>' +
    '<rect x="46" y="28" width="1" height="11" fill="#12483a"/>' +
    '<rect x="14" y="26" width="1" height="16" fill="#12483a"/>' +
    '<rect x="49" y="26" width="1" height="16" fill="#12483a"/>' +
    '<rect x="11" y="25" width="1" height="15" fill="#12483a"/>' +
    '<rect x="52" y="25" width="1" height="15" fill="#12483a"/>' +
    '<rect x="8" y="24" width="1" height="19" fill="#12483a"/>' +
    '<rect x="55" y="24" width="1" height="19" fill="#12483a"/>' +
    '<rect x="5" y="24" width="1" height="12" fill="#12483a"/>' +
    '<rect x="58" y="24" width="1" height="12" fill="#12483a"/>' +
    '<!-- 翼の先のかぎ爪 -->' +
    '<rect x="2" y="20" width="3" height="2" fill="#f3ead9"/>' +
    '<rect x="59" y="20" width="3" height="2" fill="#f3ead9"/>' +
    '<rect x="4" y="18" width="2" height="2" fill="#f3ead9"/>' +
    '<rect x="58" y="18" width="2" height="2" fill="#f3ead9"/>' +
    '<!-- しっぽ（右下へ） -->' +
    '<rect x="42" y="50" width="3" height="3" fill="#3f8f4a"/>' +
    '<rect x="45" y="51" width="3" height="3" fill="#3f8f4a"/>' +
    '<rect x="48" y="52" width="3" height="3" fill="#3f8f4a"/>' +
    '<rect x="51" y="51" width="3" height="3" fill="#6dc46f"/>' +
    '<rect x="53" y="49" width="3" height="3" fill="#6dc46f"/>' +
    '<rect x="54" y="46" width="3" height="3" fill="#6dc46f"/>' +
    '<rect x="55" y="42" width="2" height="4" fill="#f3ead9"/>' +
    '<rect x="54" y="44" width="2" height="2" fill="#f3ead9"/>' +
    '<!-- 胴体 -->' +
    '<rect x="22" y="34" width="20" height="3" fill="#3f8f4a"/>' +
    '<rect x="20" y="37" width="24" height="13" fill="#3f8f4a"/>' +
    '<rect x="22" y="50" width="20" height="3" fill="#3f8f4a"/>' +
    '<!-- 胴体の影と明るい面 -->' +
    '<rect x="20" y="37" width="3" height="13" fill="#225a2c"/>' +
    '<rect x="41" y="37" width="3" height="13" fill="#6dc46f"/>' +
    '<!-- 腹（横のうろこ） -->' +
    '<rect x="25" y="37" width="14" height="15" fill="#f0f7d8"/>' +
    '<rect x="26" y="39" width="12" height="1" fill="#c6dfa6"/>' +
    '<rect x="26" y="42" width="12" height="1" fill="#c6dfa6"/>' +
    '<rect x="26" y="45" width="12" height="1" fill="#c6dfa6"/>' +
    '<rect x="26" y="48" width="12" height="1" fill="#c6dfa6"/>' +
    '<!-- 足とかぎ爪 -->' +
    '<rect x="22" y="52" width="7" height="5" fill="#3f8f4a"/>' +
    '<rect x="35" y="52" width="7" height="5" fill="#3f8f4a"/>' +
    '<rect x="22" y="52" width="2" height="5" fill="#225a2c"/>' +
    '<rect x="40" y="52" width="2" height="5" fill="#225a2c"/>' +
    '<rect x="22" y="57" width="2" height="3" fill="#f3ead9"/>' +
    '<rect x="40" y="57" width="2" height="3" fill="#f3ead9"/>' +
    '<rect x="25" y="57" width="2" height="3" fill="#f3ead9"/>' +
    '<rect x="37" y="57" width="2" height="3" fill="#f3ead9"/>' +
    '<rect x="28" y="57" width="1" height="3" fill="#f3ead9"/>' +
    '<rect x="35" y="57" width="1" height="3" fill="#f3ead9"/>' +
    '<!-- 首 -->' +
    '<rect x="26" y="29" width="12" height="6" fill="#3f8f4a"/>' +
    '<rect x="29" y="29" width="6" height="6" fill="#6dc46f"/>' +
    '<!-- 頭の輪郭 -->' +
    '<rect x="25" y="11" width="14" height="2" fill="#3f8f4a"/>' +
    '<rect x="23" y="13" width="18" height="2" fill="#3f8f4a"/>' +
    '<rect x="21" y="15" width="22" height="9" fill="#3f8f4a"/>' +
    '<rect x="23" y="24" width="18" height="3" fill="#3f8f4a"/>' +
    '<rect x="26" y="27" width="12" height="2" fill="#3f8f4a"/>' +
    '<!-- 頭の明暗 -->' +
    '<rect x="21" y="15" width="22" height="2" fill="#6dc46f"/>' +
    '<rect x="21" y="17" width="3" height="7" fill="#225a2c"/>' +
    '<rect x="40" y="17" width="3" height="7" fill="#6dc46f"/>' +
    '<!-- 角（上へ2本・外へ反る） -->' +
    '<rect x="18" y="7" width="4" height="3" fill="#f3ead9"/>' +
    '<rect x="42" y="7" width="4" height="3" fill="#f3ead9"/>' +
    '<rect x="16" y="4" width="4" height="3" fill="#f3ead9"/>' +
    '<rect x="44" y="4" width="4" height="3" fill="#f3ead9"/>' +
    '<rect x="15" y="2" width="3" height="2" fill="#f3ead9"/>' +
    '<rect x="46" y="2" width="3" height="2" fill="#f3ead9"/>' +
    '<rect x="18" y="10" width="4" height="2" fill="#cbbfa8"/>' +
    '<rect x="42" y="10" width="4" height="2" fill="#cbbfa8"/>' +
    '<!-- 目（金・縦のスリット） -->' +
    '<rect x="22" y="17" width="8" height="6" fill="#f5d020"/>' +
    '<rect x="34" y="17" width="8" height="6" fill="#f5d020"/>' +
    '<rect x="24" y="18" width="3" height="5" fill="#1a1405"/>' +
    '<rect x="37" y="18" width="3" height="5" fill="#1a1405"/>' +
    '<rect x="22" y="17" width="8" height="1" fill="#fff3b0"/>' +
    '<rect x="34" y="17" width="8" height="1" fill="#fff3b0"/>' +
    '<!-- 鼻すじと鼻あな -->' +
    '<rect x="28" y="23" width="8" height="3" fill="#6dc46f"/>' +
    '<rect x="29" y="24" width="2" height="2" fill="#225a2c"/>' +
    '<rect x="33" y="24" width="2" height="2" fill="#225a2c"/>' +
    '<!-- 口（開いて牙） -->' +
    '<rect x="25" y="26" width="14" height="4" fill="#5a2020"/>' +
    '<rect x="27" y="30" width="10" height="2" fill="#5a2020"/>' +
    '<!-- 牙 -->' +
    '<rect x="26" y="26" width="2" height="4" fill="#f3ead9"/>' +
    '<rect x="36" y="26" width="2" height="4" fill="#f3ead9"/>' +
    '<rect x="30" y="26" width="2" height="3" fill="#f3ead9"/>' +
    '<rect x="32" y="26" width="2" height="3" fill="#f3ead9"/>' +
    '<rect x="26" y="30" width="2" height="2" fill="#cbbfa8"/>' +
    '<rect x="36" y="30" width="2" height="2" fill="#cbbfa8"/>' +
    '<!-- 炎（口の左下から吹き出す） -->' +
    '<rect x="18" y="30" width="3" height="3" fill="#ff8c1a"/>' +
    '<rect x="15" y="32" width="3" height="3" fill="#ff8c1a"/>' +
    '<rect x="12" y="34" width="3" height="4" fill="#ff8c1a"/>' +
    '<rect x="16" y="33" width="2" height="2" fill="#ffd24a"/>' +
    '<rect x="13" y="35" width="2" height="3" fill="#ffd24a"/>' +
    '<rect x="10" y="37" width="3" height="3" fill="#ff8c1a"/>' +
    '<rect x="11" y="38" width="2" height="2" fill="#ffd24a"/>' +
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
