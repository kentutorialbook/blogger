# 2018年9月時点のJavaScriptモジュール(ES Module/ESM)界隈の最新情報、これまでの経緯とこれからの見通しを解説

具体的には、[ES6(ES2015)より標準化](http://es6-features.org/#ValueExportImport)された[import](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import)と[export](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/export)をめぐる解説記事です。重要な割に日本語解説記事が大変少ないことと、いずれにせよこの手の記事は情報がすぐ古くなり賞味期限があるので、使い捨て記事、ナマモノ追加投入の意義があります。

## そもそもモジュールとは？モジュール化することの重要性　世界はモジュールで溢れている

### [モジュール化 (Modularity)](https://www.nri.com/jp/opinion/m_word/development/modularity.html)

>1つの複雑なシステムを、機能完結的な部品と標準化された部品間インターフェースで構成すること。

>単機能で独立した部品同士を組み合わせて全体システムを構成するという設計構想をモジュラー型アーキテクチャといい、システムをこうした部品（モジュール）に分割することをモジュール化といいます。

>その対象は製品の物理的構造だけに留まらず、システム設計や生産工程、組織など多岐にわたります。

>IT産業発展の原動力
>パソコンはCPUやメモリ、ハードディスクなど標準化されたインターフェースによって接続されているモジュール化製品の典型といえます。

>モジュール化は、（1）製品の複雑さを低減、（2）部品の組合せ自由度を向上、（3）設計変更時の局所的対応が可能といったメリット

USBインターフェイスで規格化されたUSB機器、PCならパーツの規格と、機能完結的かつ標準化された部品（モジュール）によるモジュール化は複雑なシステムを構築する際に当たり前のように採用されている手法です。

プログラミングとはそもそも単純な部品を組み立てていく作業であり、プログラミング言語であるJavaScriptもモジュール化が重要です。特に昨今、JavaScriptは大規模システムの構築に普通に利用されるようになりモジュール化は必須です。

## ブラウザ戦争 混迷を極めるJavaScript界隈 node.jsとnpmの台頭 1990-

JavaScriptのモジュール化という超基本的な仕様の標準化がこれまで立ち遅れてきた理由は、JavaScriptがブラウザに付属してくるスクリプト言語である、という他に例を見ない特殊な事情によります。

[ブラウザ戦争](https://ja.wikipedia.org/wiki/%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E6%88%A6%E4%BA%89)というIT界隈では悪名高い覇権争いがあり、JavaScriptの標準化は各ベンダーの政治的対立に翻弄され立ち遅れました。モジュール標準化もまとまらなかったということです。

- 第一次ブラウザ戦争 (1990-2000年)   
  Internet ExplorerかNetscape Navigatorの二択。  IEの勝利。
  
- 第二次ブラウザ戦争 (2004-2014年)   
![figure_1](https://japan.zdnet.com/storage/2014/12/22/d4cf5455b8441f4cc9b484ed16bd5463/browser-wars_200x125.jpg)
Mozilla Firefoxが2004年、Microsoft IEの完全かつ絶対的な市場支配に戦いを挑み、それから5年足らずでユーザー数を0人から数億人に伸ばすことに成功した。Googleも2008年、Chromeブラウザを発表して、それに続いた。Chromeは2012年にはFirefoxに追いついた。[2014年には揺るぎない地位に納まったことで、**第二次ブラウザ戦争**は終結したとされる](https://japan.zdnet.com/article/35058241/)。

2008年、GoogleはChromeのJavaScriptエンジンである、[V8](https://developers.google.com/v8/)もブラウザから分離してオープンソースでリリースしています。これまでブラウザの付属物でしかなかったJavaScriptがブラウザとは独立してシステムのローカル環境で動作するようになったというのは結構大きな出来事で、2009年、V8をベースにイベント化された入出力を扱うJavaScript環境である[node.js](https://nodejs.org/ja/)がリリースされます。

![](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/200px-Node.js_logo.svg.png)

![](https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/200px-Npm-logo.svg.png)
node.jsは、非常に効率の良いWebサーバとしてサーバーサイドで活用されはじめると同時に、独自のモジュール/パッケージ管理システムである[npm](https://www.npmjs.com/)を発展させ（JavaScriptの標準仕様としてモジュールが存在しないので独自に発展させるしかしようがない）、2018年現在まで一大エコシステム・コミュニティを形成してきました。

## 2011- Browserifyの登場　"bundler"

![](https://raw.githubusercontent.com/browserify/browserify/master/assets/logo.png)

JavaScriptのモジュール化の標準化が定まらない中、独自のエコを発展させたnodeベースの膨大なJavaScriptモジュール資産（npmエコ）をWebブラウザでも活用すべく[Browserify](http://browserify.org/)が登場します。これは実際結構な力技で、当初私などはよくこんなハックが出来たなと衝撃を受けたものですが、npmの依存関係に従ってモジュールを単一のJSファイルにつなぎあわせる、というものです。現在は、[webpack](https://webpack.js.org/)のほうが人気だとは思いますが、いわゆる"bundler"（バンドラ）と呼ばれるものの先駆的存在です。



## 2013- Reactの登場

![](https://upload.wikimedia.org/wikipedia/commons/d/d3/React_Native.png)

Facebookはコンポーネントで仮想DOMを設計するReactをリリースします。Reactのコンポーネントはモジュールにそのまま呼応するので、Reactのドキュメンテーションではかなり早くからES6の`import`/`export`準拠で書かれていました。ブラウザでモジュールが実装される前からこのようにES6準拠となるのは、同時期に台頭したトランスパイラ（[Babel](https://babeljs.io/)）と上記バンドラ(Browserify/webpack)に依存して技術を先取りできているからです。

従って、Reactなどの先進的なフロントエンド開発をする際には、もうトランスパイラとバンドラをセットで使うのがデフォという感じになっています。そして驚くべきことに、React開発陣が完全にこの大前提にたっているためにReactライブラリ自体をES6Module(ESM)の仕組みで`import`させるのにネイティブにESM対応モジュールをリリースしておらず、トランスパイラとバンドラにNPM用のモジュールを読ませて変換させるというリリースの仕方をしています。

現状、別に規格化されているわけでもなんでもないnpmというモジュール/パッケージ管理システムとそれを単一ファイルに統合するバンドラを前提にフロントエンド開発が当たり前のように行われている、というのは、すべてブラウザ戦争により標準化されたモジュール化が立ち遅れたことが原因で、なかなか不安定な過渡期であると言えます。

![](https://cdn-images-1.medium.com/max/1791/1*CHwBORQKs3UTITf-O-ieKA.jpeg)
## 2014- ECMAScript標準化の加速

ブラウザ戦争が収束するのと並行して、ブラウザ世界でもJavaScriptの標準化= ECMAScript標準化が活発化していきます。

ES6(ES2015)ではようやく[モジュールが標準化](http://es6-features.org/#ValueExportImport)され、[import](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import)と[export](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/export)の仕様が固まりました。今後も、 ES2015-2018と立て続けに続くようで標準化は順調に加速していくようです。

## 2018 すべてのモダンブラウザがES6-Module(ESM)を実装完了

https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import#Browser_compatibility

  
![compati.png](https://kenokabetech.github.io/img/ts-react-electron/compati.png)

より関数型プログラミング的な、dynamic import（動的読み込み）がFirefoxにはまだ実装されていませんが、とりあえず基本的なモジュール化はモバイルも含めすべてのモダンブラウザ（EdgeじゃないIE除く）で実装完了されており、プロダクションレベルでも積極的に利用可能な情況になっています。

Webブラウザがモジュールをそのまま実行してくれるようになってくると（本来そうであるべき）、わざわざなんか面倒で複雑なバンドラって必要？ということになってきます。ReactのJSXをトランスパイルしなければいけないというのも、実は[TypeScript](https://www.typescriptlang.org/)のTSXで書いていたらTypeScriptがやってくれるのでBabelというトランスパイラは不要とかいろいろすっきりしそうな気がします。

![](https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/TypeScript_Logo_%28Blue%29.svg/320px-TypeScript_Logo_%28Blue%29.svg.png)

実際今、自分はいろいろ外部ツールを組み合わせてセットアップしないとWebアプリケーションが開発できないという複雑な情況をシンプルにするために、Reactアプリでも基本TypeScript(TSX)だけ、Babelとwebpackなしでそのままブラウザで展開するようにしています。

![Screenshot from 2018-08-19 16-48-09.png](https://kenokabetech.github.io/img/ts-react-electron/Screenshot%20from%202018-08-19%2016-48-09.png)
![Screenshot from 2018-08-19 16-46-44.png](https://kenokabetech.github.io/img/ts-react-electron/Screenshot%20from%202018-08-19%2016-46-44.png)

https://github.com/kenokabe/esm-bundlerless  
https://github.com/kenokabe/esm-bundlerless-react

## ESM/NPM(CJS)２つの互換性のないモジュールシステムの問題発生

2018年になって、ようやくモバイル含めてもうすべてのモダンブラウザがES6-Module(ESM)が普通に使えるようになった、素晴らしい。ではこれから書くライブラリはすべてESMで行こう！それならわざわざwebpackつかって面倒なセットアップと開発フローはなくて済むんでしょ？

現状はこういう流れになりつつあるのは間違いありません。それが本来の標準化されたモジュール化なのだから。

しかしここで問題はすでに確立されたnode.モジュールのnpmエコがあるということです。nodeのモジュールフォーマットである[CommonJS(CJS)](https://ja.wikipedia.org/wiki/CommonJS)ば後発のブラウザ標準のESMと互換性はありません。２つのメジャーなモジュールエコが互換性なく並立しているというのが現状です。

すでにnpmエコにおいてもコミュニティは積極的に`import`/`export`準拠でライブラリ・パッケージをリリースしているのですが、それはもちろんwebpack/browserifyのバンドラが処理してくれるという前提で皆そうしているようです。nodeはそもそもが自前のCJSモジュールベースで実装されているわけで、本来互換性のないESM対応についてはチーム内でもなかなか意見がまとまらないようで現状も混迷を極めており、早急な進展も望めない情況のようです。

## 静かにデファクトスタンダードになりつつあるnodeとESMのブリッジ`esm`ライブラリ

このような混迷した情況の中、あまりまだ知られていない（少なくとも2018/9月現在、日本語解説記事はまるでヒットしない）のがnpm/[yarn](https://yarnpkg.com/en/)に新たに実装された以下のコマンドです。

#### npm
```
npm init esm
```

#### yarn

```
yarn create esm
```

https://docs.npmjs.com/cli/init
によると、
>Create a new `esm`-compatible package using [`create-esm`](https://npm.im/create-esm):

ということで、実態は、
`npm init` あるいは`yarn create` する際に、
https://npm.im/create-esm
のコードをフックして「esmに対応した」新しいnpmプロジェクトを作成します。
実際に作成したに新規npmプロジェクトの`package.json`を見てみると、


```json
{
  "name": "my-esm-lib",
  "version": "1.0.0",
  "main": "index.js",
  "module": "main.js",
  "license": "MIT",
  "dependencies": {
    "esm": "^3.0.82"
  }
}
```

となっており、このパッケージの依存パッケージ(`dependency`)（ライブラリ）として[`esm`](https://www.npmjs.com/package/esm)が自動的に追加されているのがわかります。

[`esm`](https://www.npmjs.com/package/esm)と [`create-esm`](https://npm.im/create-esm
)は、MicrosoftのDeveloper Experiences PMであり[npmエコの中でももっとも多く依存されているライブラリ](https://www.npmjs.com/browse/depended)の[lodash](https://www.npmjs.com/package/lodash)（関数型プログラミングのライブラリ）の開発者でもある[John-David Dalton @jdalton](https://github.com/jdalton)によって開発メンテナンスされています。

`esm`ライブラリのダウンロード数は増加し続けており、コミュニティの支持とともに確固たる地位を獲得しているように見受けられます。

![](https://kenokabetech.github.io/img/esm-dl.png)

## nodeとESMのブリッジ`esm`ライブラリの役割

じゃあ、実際esmって何ができるのか？

webpackがnode/npmモジュールをブラウザでも活用できるようにしたのと対照的に、**esmはブラウザで標準化されたESMをnode/npmでも活用できるようにするブリッジである**、と理解すれば良いでしょう。

今後のJavaScriptのフロントエンド、あるいはサーバーサイドの開発者の基本方針としては、ES6以降で標準化されているESMでモジュールを書いていく、しかし同時にnodeのエコでもそのESM資産を無駄なく流用活用できるようにesmでブリッジできるので一石二鳥だ、そういう感じです。

esm（ライブラリ）の２大機能とは、

1. ESMをラップしてnode/npmエコでシームレスに扱えるnpmパッケージ化
2. nodeコマンドにフックをかけて直接ターミナルからESMを実行可能

です。おおざっぱにそういう理解でいいでしょう。

この（１）がまさに上で引用した

```
npm init esm
```

によってesmパッケージ依存込みで自動生成されるプロジェクトのテンプレです。

実際に作成された`package.json`では

```json
  //...
  "main": "index.js",
  //...
```
と、`index.js`がパッケージの起点となっており、その内容は以下のとおり自動生成されています。

##### index.js
```js
require  =  require("esm")(module/*, options*/)
module.exports  =  require("./main.js")
```

通常のCJSの`require`は一旦`("esm")`関数でフックをかけられることで、`esm`の文脈に変換された上で再定義されています。

再定義された`require`はESMファイルを読み込み解釈できるので、`./main.js`にはESMそのものずばりのコードを書けば良い、という仕組みです。

##### main.js
```js
// ESM syntax is supported.
export {}
```

## 実際の利用例

実際の例として、前回のエントリ[### JavaScript/TypeScriptに自己参照する「型」(type)を与えるtypeself](https://kenokabetech.blogspot.com/2018/09/javascripttypescripttypetypeself.html)は[npmパッケージとして公開](https://www.npmjs.com/package/typeself)したばかりですが、上記のESM互換の手順でプロジェクトを作成しています。

https://github.com/kenokabe/typeself

本体は、  
[./dist/build/modules/typeself.js](https://github.com/kenokabe/typeself/blob/master/dist/build/modules/typeself.js "typeself.js")
にESMとして書かれており、依存モジュールであるESM  
[./dist/build/modules/primitive-obj.js](https://github.com/kenokabe/typeself/blob/master/dist/build/modules/primitive-obj.js "primitive-obj.js")  
と共に、ブラウザ内のESMの`import`としてやればそのまま動作します。
https://github.com/kenokabe/typeself-dev/tree/master/dist/build

そして同時に、[./package.json](https://github.com/kenokabe/typeself/blob/master/package.json)で起点と指定される[./index.js](https://github.com/kenokabe/typeself/blob/master/index.js)では、
```js
require = require("esm")(module/*, options*/)
module.exports = require("./dist/build/modules/typeself.js")
```
と本体のESMへ`esm`フックをかけていて、あくまでCJSの`module.exports `とされており、通常のnpmパッケージとしてnodeから利用可能です。

さて上記（2）について、

[./dist/build/test/test-typeself.js](https://github.com/kenokabe/typeself/blob/master/dist/build/test/test-typeself.js "test-typeself.js")というテストコードもESMとして記述されていますが、

```sh
$ node -r esm ./dist/build/test/test-typeself.js
```

とesmフックをかけた`node`コマンドでESMがシームレスにターミナル上で実行できてしまいます。

1. パッケージ内でESMへフックをかけてCJS/npmパッケージ化できてしまう、
2.  ESM単体でもターミナルからnodeコマンドにフックをかけて直接実行可能、

と、もの凄く洗練された設計と実装となっています。

## 次のエントリでは`esm`開発者の@jdaltonのブログ記事を翻訳して公開

実は、そろそろESMの開発環境を整えようと、上記の「Reactアプリでも基本TypeScript(TSX)だけ、Babelとwebpackなしでそのままブラウザで展開」するための開発ツール  
https://github.com/kenokabe/esm-bundlerless  
https://github.com/kenokabe/esm-bundlerless-react  
を[Electron](https://electronjs.org/)をベースに構築しようとしていた時に、「Electronっていうのは、Chromiumブラウザとnodeランタイムのハイブリッド環境なので両方の技術おいしいとこどりでなんでも簡単にできるはず」とタカくくっていたところ、単純にやっぱりnodeではESMは扱えない事実が判明していたのでした。

すでに書いた通り、node組み込みのESMローダーはまったく迷走しているし、どうしたものかと、[electron/node](https://github.com/electron/node)界隈を調査していると
[Contexts: supporting new Node's ESM Loader (without hacking)](https://github.com/electron/node/issues/33)というIssueにたどり着き、同じように文句垂れている人を見かけたので、自分も便乗して「同意見だ」などと長文で遠回しに文句垂れていたところ、@jdaltonが「とりあえず[`esm`](https://www.npmjs.com/package/esm)みたいなものがある、これならElectronのmain/render両方のプロセスでも一貫性のあるESMの利用ができる」と親切に教えてくれたので、見てみると、英語圏でも知られているようでまだそれほど知られているわけではなさそうな`esm`ですが、これがもの凄いハックで、はじめてBrowserifyというバンドラを見たときと同じくらい衝撃を受けました。それが`esm`のことを知った経緯です。

そもそもElectronとはGitHub製のAtomEditorのガワ部分が独立して公開されていたもので、先日Microsoftが自社製のVisualStudioCodeの土台にもなっているElectronと一緒にGitHubを買収してしまったので、今現在、ElectronはMicrosoftの資産となっています。その流れか、前からかは知りませんが、MicrosoftのPMの@jdaltonもElectronの開発メンバーになっているのでIssueをWatchしていたのでしょう。

彼はnode/moduleの策定メンバーにもなっているようなので、「今後`esm`をnodeのデフォルトESMローダーとしてマージする心づもりなのか？」と質問しましたが、そのつもりは全く無いようです。彼のブログを熟読すると彼の志向はどの開発環境、開発スタイルにでも馴染むような汎用的なライブラリ（lodashもたしかにそんな感じだ）の作成で、スタンダードに馴染み、開発者から自然に選択されるデファクトスタンダードを目指しているようです。

ということで、今回の記事では、筆者がES Module/ESM界隈の最新情報、これまでの経緯とこれからの見通しを俯瞰、そして勝手に`esm`の解説もしましたが、やはり開発者自身の設計思想も含めて理解できる一次ソースに勝る情報はないと思うことと、とても重要な文章だと思うので日本語圏の開発者がよりリーチしやすいように日本語でシェアするために、@jdaltonの許可と協力を得ながら、[彼のブログ記事](https://medium.com/web-on-the-edge/tomorrows-es-modules-today-c53d29ac448c)を翻訳公開したいと思います。

↓　次に読む

[明日のES Modulesを今日使おう！(esm ライブラリ開発者 @jdalton による解説記事の翻訳)](https://kenokabetech.blogspot.com/2018/09/es-modulesesm-jdalton.html)














<!--stackedit_data:
eyJoaXN0b3J5IjpbMTA4NDk3MTM5NiwtMzI0NTE3OTczLC0xOT
g2MjQzMjQyLC01ODA5MDIzMjYsNzUxMDQ0NzAsLTg0OTY2NjA3
NCw2OTczNzUzMzQsMzE0NDU5MzY2LDE1NTE4NTM5MjIsLTE2Nj
cyODQzNzEsLTc5MzIxNDQ5OSw1NTQxNDYzMzcsLTY2MzI5NzA1
MiwtMjAyNDE0OTI1Nyw2Mjc1NjYzMDgsMjEyMjI3NzY5NSwxOD
kyODY2NzM2LDE0NzEzMzIzMDAsOTU5MTc3NTk2LDY4MjExNzc2
Ml19
-->