---

# 明日のES Modulesを今日使おう！(esm ライブラリ開発者 @jdalton による解説記事の翻訳) 

---

_この記事は[esm](https://www.npmjs.com/package/esm)ライブラリの開発者@jdalton自身による解説記事
https://medium.com/web-on-the-edge/tomorrows-es-modules-today-c53d29ac448c
を本人の許可と協力を得て翻訳したものです。_

_ES Modules(ESM)の解説も含め、前回のブログ記事: 
[2018年9月時点のJavaScriptモジュール(ES Module/ESM)界隈の最新情報、これまでの経緯とこれからの見通しを解説](http://kenokabetech.blogspot.com/2018/09/20189javascriptes-moduleesm.html)
もあわせて読むとより全体像がつかみやすくなると思います。_

---

オリジナル記事著者：

[![Go to the profile of John-David Dalton](https://cdn-images-1.medium.com/fit/c/54/54/0*imWJQZ_gjtseyCvB.jpeg)](https://medium.com/@jdalton?source=post_header_lockup)

[John-David Dalton](https://medium.com/@jdalton?source=post_header_lockup)

JavaScript思想家, バグフィクサー & ベンチマークランナー • [lodash](https://www.npmjs.com/package/lodash)開発者 • 前職 Chakra Perf PM • 現在 Web Apps & Frameworks PM @Microsoft　 主張は個人の見解です。

オリジナル記事投稿日　3月29日

# Tomorrow’s ES Modules Today!（明日のES Modulesを今日使おう！）

### ⚵ より深く知るには [Node Module Summit video](https://www.youtube.com/watch?v=JcZ-FzfDq8A#t=5)をチェック

7ヶ月前、 私はNodeでESモジュールを有効にできる[実験的なモジュールローダをリリースしました](https://medium.com/web-on-the-edge/es-modules-in-node-today-32cff914e4b)。100万を超えるダウンロード、数千のコミット、そしてJavaScriptコミュニティのアーリーアダプター達のとてつもない援助を経て、安定版リリースの準備が整いました！🎕🎕🎕

[`esm`](https://www.npmjs.com/package/esm)を紹介しましょう　ー　高速でプロダクション(本番)利用可、パッケージ依存なしのESモジュールローダで、Node 6+で利用可能、素晴らしい開発者体験をもたらします！

これまでの環境のままで、開発者は好みのツールのオプションに _“require”_ オプションをつけることで、 容易にESモジュールを有効に出来ます。

```js
node -r esm  
mocha -r esm  
nyc -i esm  
webpack -r esm
```

⚵   [AVA](https://github.com/avajs/ava) テストランナーはESMサポートのために[`esm`でdefer可能です。](https://github.com/avajs/ava/blob/master/docs/recipes/es-modules.md)

加えて今回からは、パッケージ作者は以下のいずれかのコマンドを使用することにより`esm`が使えるパッケージを新規作成できます。


npm init esm _(npm@6)_  
yarn create esm


⚵   `-y` フラグを活用することで、すべてのプロンプトに “yes”と答えられます 

![](https://cdn-images-1.medium.com/max/716/1*8T_TfwMUl9DyLtC7GKZvkA.gif)

npx create-esm の使用例：esm有効化パッケージを新規作成している

### Setting the Stage　舞台の前口上

[`esm`](https://www.npmjs.com/package/esm)を掘り下げる前に、あるバックストーリーを前口上させてください。

私は20年間JavaScriptを書いてきて、そのうち、オープンソースに参画して仕様を読んできたのが13年間です。 Web 2.0の時代に生きてきて、モダンなJavaScriptライブラリとフレームワークの誕生に貢献するために自身の役割を果たしてきました。JavaScriptのエコシステムでどのようなアプローチと姿勢がうまく機能して、どういうものが失敗して立ち消えになってしまのうかを眼の当たりにしてきました。

私はMicrosoftでtechnical program manager _(PM)_ として6年間務めてきました。Chakra、MicrosoftのJavaScriptエンジンのperformance PMとして3年間務めた後、現在はWebプラットフォームチームのDeveloper Experiences PMです。Program management（プログラム管理）ではユーザーと共感し、ユーザの事情、機能要件、外部依存関係、潜在的なブロッカーを特定する必要があります。最初のアイデアから出荷されるコードまで機能を見守るために、チーム間、さらには企業間で作業する必要があります。

私はLodash JavaScriptユーティリティライブラリを作りました。LodashはUnderscoreライブラリのフォークとして始まりました。UnderscoreはNodeと同年にリリースされるとあっという間にそのデファクトユーティリティパッケージになります。3年後、私はLodashをリリースしますが、まったく何も継承することもなく、数百万のユーザに利用される最も依存される数が多いnpmパッケージに成長しました。 これを達成するには、開発者のプラクティスやアプローチはこちら側が修正していく問題として見なすべきではないというマインドセットが必要でした。エコシステムを押す代わりに、私は、彼らの様々なモジュールフォーマット、プログラミングスタイル、多様な環境設定をそのまま受け入れるようにしました。開発者達をブロックしてしまわないことで彼らの移行プロセスを苦痛のないものにしました。パフォーマンスクリティカルなシナリオについて改善し、開発をシンプルにさせました。信頼を養い、開発者がリーチしやすい何かを作ったのです。　

これらの経験が、`esm`が互換性と相互運用性についてアプローチする方法を形成したのです。

### Zero Configuration　ゼロ・コンフィギュレーション

[esm](https://www.npmjs.com/package/esm)が[最初にリリースされた](https://medium.com/web-on-the-edge/es-modules-in-node-today-32cff914e4b)のは遡ること2017年8月ですが、そのときはNodeのESモジュールのフラグが外れるまで9ヶ月を残すのみでした。今、その8ヶ月後、NodeはESモジュールのフラグを外すことを暫定的にさらに9〜27ヶ月先延ばしにした上で、新しい[Nodeモジュールワーキンググループ](https://github.com/nodejs/modules)が形成 （私はメンバー） されました。そして、かつてのNodeロードマップは今後必ずしもその通りになるとは限りません。

現時点で「Nodeルール」に追従するのは、特にその仕様が未だ固まっていないような時は、正しい選択ではないように見えます。開発者はESMを選択し、すぐさまコーディングにとりかかれるようにすべきです。理想的には、ESMのサポートは、エコシステムが現在あるところに寄り添ったものでなければなりません。 `esm`は、ゼロコンフィギュレーションで可能な限りCommonJS  _(CJS)_ と 相互運用可能であるべきでしょう。今あなたが愛してやまないもの、アプリケーションパフォーマンスモニタ、バンドラ、 code coverage instrumenters、トランスパイラそしてタイプチェッカーは、引き続きそのままきちんと動作し続けるべきです。

NodeのESMプランでは今でも `.mjs`ファイル拡張をモジュールパースのゴールを通知するためのデフォルト機構としています。しかし、Nodeの `.mjs`青写真は完全には書かれていないためJavaScriptエコシステムは、Babel 7やWebpack 4で見られるように責務としてかろうじて最小限の機能しかサポートしていません。 `esm`も追従して、すべての` esm`オプションで`.mjs`を無効化してしまっています。これはつまり現状あなたが開発していくにあたり`.js`がベストな選択であるということです。 `esm`は今日のESMから明日のESMへのブリッジです。 今後NodeのESMへの道筋が明確になっていけば、`esm`も開発者にその機能を解放するでしょう。

（＊訳者注＊　
@jdaltonに2018/09時点のNodeのESモジュールサポートの最新の状況を確認したところ、現在までさらに半年ほど、目に見えるような進展はないそうです。また今後、`esm`をNodeの標準ESモジュールローダとしてマージする心積もりはあるのか？という質問をしたところ、現状技術的にはマニュアルで [`esm` をNodeにコンパイルすることは可能](https://github.com/standard-things/esm/wiki/Compile-Node)ではあるが、その心積もりはまるでなく、あくまでもこの記事で表明されている思想のとおり、仕様に沿った範囲で、移行パス、パフォーマンス、現実世界の利用シナリオに基づいて、引き続き改善を加え続ける、ということです。）　　

### Mostly JavaScript is Mighty Good　ほとんどがJavaScriptで書かれる事は大変素晴らしい


[`esm`](https://www.npmjs.com/package/esm)は完全にネイティブコードではなく、そのほとんどがJavaScriptで書かれていることから、本質的に劣っていると考えるかもしれません。しかし、ほとんどJavaScriptであることが、実は大きな強みとなっているのです。NodeのESMのサポートを追加するには、いくつかの外部のチームや標準化団体からの仕入れや協力が必要です。彼ら各々が異なるアジェンダ、優先順位、タイムラインを持っています。 NodeのESMサポートの統一されたビジョンに向けてすべての関係者を招集しようとするのは現実的ではありません。ほとんどJavaScriptであるということは、ESMのサポートが固まる間に`esm`はこれらの依存関係をゼロにする必要があり、他のアプローチよりも速い開発とより良いエコシステムのサポートを可能にします。これにより、`esm`をアンブロックするだけでなく、 [`vm.Module`](https://nodejs.org/api/vm.html#vm_class_vm_module)のようなネイティブヘルパーが利用可能になり次第活用できる自由度を与えます。ビルトイン機能をJavaScriptで記述することは何も新しいことではありません。Node自身のビルトインモジュールや、その現在進行系のESM関連は[JavaScriptで書かれています](https://github.com/nodejs/node/tree/master/lib)。 [Chakra](https://github.com/Microsoft/ChakraCore/tree/master/lib/Runtime/Library/InJavascript), [SpiderMonkey](https://hg.mozilla.org/mozilla-central/file/default/js/src/builtin)や [V8](https://cs.chromium.org/chromium/src/v8/src/js/)のようなJavaScriptエンジンのパーツでさえ、セルフホストされたJavaScriptで記述されています。おそらくもっともエキサイティングなのは、`esm`がスタンドアロンのローダであるため、 [ChakraCore](https://github.com/nodejs/node-chakracore)であってもJavaScriptエンジンを問わず動作可能であったり、極めて容易に [Nodeに直接コンパイル可能](https://github.com/standard-things/esm/wiki/Compile-Node)であることでしょう。

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">For my Sunday evening experiment I compiled std/esm into Node core. Took ~30 mins to figure it out. ESM &quot;just works&quot; 🎉 <a href="https://t.co/e2cbKuytjh">pic.twitter.com/e2cbKuytjh</a></p>&mdash; John-David “just works” Dalton (@jdalton) <a href="https://twitter.com/jdalton/status/973013760603402241?ref_src=twsrc%5Etfw">March 12, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


### Better than “Just works”　「ちゃんと動く」以上のこと

ESモジュールのシンタックスがあるのは素敵ですが、Nodeが仕事するために無くてはならないというものでもありません。適応させる障壁は**驚くほど低い**必要があり明確な恩恵が示されない限り、開発者はすでにこなれて確立しているCJSに固執してしまうことでしょう。これはつまり、  [`esm`](https://www.npmjs.com/package/esm) はESMに即座にシームレスに適応させる、**それ以上**のことをしなければいけないということです。

-   **Resilient　堅牢性** 
     `esm` は独自のコンテクストで動作するのでプロトタイプやポリフィルの改竄に強いです。
-   **Reduce pain points　苦痛なポイントを低減する**  
    `esm` はNodeのバージョン間APIの不一致加減を低減します。たとえば、[`require.resolve`](https://nodejs.org/dist/latest-v9.x/docs/api/all.html#modules_require_resolve_request_options) と [`require.resolve.paths`](https://nodejs.org/dist/latest-v9.x/docs/api/all.html#modules_require_resolve_paths_request) はNode 8+での拡張ですが、Node 6では利用不能です。 `esm` を利用することで、たとえNode 6であってもこれらのAPIにアクセスできるようになります。

-   **Improve performance　パフォーマンスの向上**
    `esm`は [エンジンコードキャッシュ](https://v8project.blogspot.com/2018/04/improved-code-caching.html) を利用することで、あなたのアプリケーションのスタートアップタイムを改善させます。Parcel, Webpack, Yarn, そして数多くのElectronアプリケーションといったプロジェクトで今日から恩恵があります。

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Adding v8-compile-cache for webpack v.4.0.0-alpha-1 on &quot;minor source code&quot;:<br><br>webpack add (definePlugin):<br><br>no v8: 11492.589ms<br><br>v8: 6979.034ms<br><br>webpack-lighthouse-plugin demo (production mode, no plugins):<br><br>no v8: 1416.967ms <br><br>v8: 1385.388ms</p>&mdash; Even Stensberg (@ev1stensberg) <a href="https://twitter.com/ev1stensberg/status/943865463406301184?ref_src=twsrc%5Etfw">December 21, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### Powering-Up Developers　開発者をパワーアップさせる

[`esm`](https://www.npmjs.com/package/esm)は、モダンなシンタックスへの人工的な障壁を取り除き、開発者を増強するために存在します。



-   **Full-stack**  フルスタック
    `esm`を使うことで開発者はサーバサイドとクライアントサイドの両方でESMを書けるようになります。例えば、`esm`は[Svelteコンポーネントのサーバサイドレンダリング](https://svelte.technology/guide#server-side-api) を拡張しますし、 [クロスプラットフォームアプリケーション（Electron）](https://electronjs.org/)をすべてESMで完全に書くことを可能にします。（＊訳者注＊　@jdalton による[ESM版のelectron-quick-start](https://github.com/standard-things/electron-quick-start)が公開されているので、その具体的作法もつかめるはず）

-   **Real-time**  リアルタイム
    [Quokka.js](https://quokkajs.com/) と [Wallaby.js](https://wallabyjs.com/) は、スクラッチパッドとテキストエディタと統合されたテスト環境を提供します、 [VS code](https://code.visualstudio.com/)のように。どちらのプロジェクトも、`esm`を利用することでさらなる面倒な手続き（ESMのみのローダーフック、MIMEタイプのジャグリング、またはコードベースのフォーク）なしで、リアルタイムのESMシンタックスのサポートができています。統合されたスクラッチパッドであるQuokka.jsでは、 `esm`はファイル拡張子なし、保存もされていないドキュメントの解析すらもサポートしています！


<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">While the best minds of our generation are still deciding on how to implement ES modules in node (no irony, it is hard to make everyone happy), but esm by <a href="https://twitter.com/jdalton?ref_src=twsrc%5Etfw">@jdalton</a> just works for tens of thousands of Quokka and Wallaby users everyday (&gt;1 million downloads per year of both tools). <a href="https://t.co/7eGWZ5oViW">https://t.co/7eGWZ5oViW</a></p>&mdash; Wallaby.js (@wallabyjs) <a href="https://twitter.com/wallabyjs/status/972630198070820864?ref_src=twsrc%5Etfw">March 11, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

### Pay it forward　事前に支払っておこう

私は、[`esm`](https://www.npmjs.com/package/esm)を開発している間ずっと、それが潜在的に他にインパクトを与える可能性について注視してきました。

-   Babylonで トップレベルの`await`をパースしてlintできるように[パッチ済み](https://github.com/babel/babel/pull/7637) です。

-  [Chakra](https://github.com/Microsoft/ChakraCore/issues/4729), [V8](https://bugs.chromium.org/p/v8/issues/detail?id=7484), JavaScriptCore,そして SpiderMonkey の`Proxy` についてのいくつかの問題(issue)が、CJSモジュールの `named exports`をサポートするための開発を通じて明らかになりました。 

- Nodeで `--check` と `--require` オプションで問題なく動作するように [パッチ済み](https://github.com/nodejs/node/pull/19600) です。

- Nodeビルトインモジュール（＊訳者注＊[fs](https://nodejs.org/api/fs.html)などのこと）にESM形式の`named exports`がサポートされるように、`esm`の初期の実装に基づいて[プルリクエストをしている最中](t](https://github.com/nodejs/node/pull/20403) )（＊訳者注＊現在プルリクエストはマージ済み）です。
　　
-   `npm` [ES modules proposal](https://gist.github.com/ceejbot/b49f8789b2ab6b09548ccb72813a1054)（[Node モジュールワーキンググループ](https://github.com/nodejs/modules)の作成を促した）は、代替実装は可能であるとインスピレーションを与えるものとして`esm`を取り上げています。

### What’s Next　次は何か

[`esm`](https://www.npmjs.com/package/esm)は目出度く安定版リリースにはなりましたが、それでもまだ沢山すべきことがあります。

-  [loader hooks](https://nodejs.org/api/esm.html#esm_loader_hooks)の基礎はこれまで`esm`にあるので、Nodeの仕様が固まり次第、 `esm` は準拠します。

- 私は、Nodeのバンドラ、 instrumenters、ローダそしてユーティリティの中心的パフォーマンスをJavaScriptエンジンがトラックできる[Node tooling benchmark](https://github.com/nodejs/benchmarking/pull/207/files#diff-434b5ce5d208190fcbd6975c63ed5179R31)の作成を任されています。
-   私は、 npmで`npm init <create-pkg-name>` が可能なようにチーム作りをしています！

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">`npm init` will soon be able to initialize more than package.json 🎉 <a href="https://t.co/E2U5Pw53u0">pic.twitter.com/E2U5Pw53u0</a></p>&mdash; John-David “just works” Dalton (@jdalton) <a href="https://twitter.com/jdalton-esmhttpswww/status/984344424472756224?ref_src=twsrc%5Etfw">April 12, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

- 実験的WASMサポートが間もなく開始されます。`wasm`オプションを用いることで、CJSとESMの`.wasm` ファイルのロードが解禁されます！

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Starting on experimental WebAssembly support in std/esm 👨‍🔬 <a href="https://t.co/NcQAVYYc6a">pic.twitter.com/NcQAVYYc6a</a></p>&mdash; John-David “just works” Dalton (@jdalton) <a href="https://twitter.com/jdalton/status/967966333940858880?ref_src=twsrc%5Etfw">February 26, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

これまで私は開発者たちのESMコードが _きちんと動いた_ ときの彼らの感動を見てきましたし、`esm`がリファレンス実装として、そして何が可能なのか？を示す強力な実例として、貢献できることを願っています！



---

-   [![Go to the profile of John-David Dalton](https://cdn-images-1.medium.com/fit/c/54/54/0*imWJQZ_gjtseyCvB.jpeg)](https://medium.com/@jdalton?source=footer_card "Go to the profile of John-David Dalton")
    
    ### [John-David Dalton](https://medium.com/@jdalton "Go to the profile of John-David Dalton")
    
    JavaScript tinkerer, bug fixer, & benchmark runner • Creator of lodash • Former Chakra Perf PM • Current Web Apps & Frameworks PM [@Microsoft](http://twitter.com/Microsoft "Twitter profile for @Microsoft"). Opinions are mine.
    
 
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTMyNDI5NDYyMSwxNDQyNzExNjE1LDE1MT
U0MDQ0MzUsMTY2MDk2MDUwOSwtMTE3MjQ4Njk4NywxNjYwOTYw
NTA5LC0xMjYxMjEwNDU5LC0xNzE0MDUxMzUxLDE0OTIyNjE2Mz
csLTY3MTA0MTc0MSwtODIwODY1NjEwLC0xNjYxMzYxMTM5LDIw
NzE3Mzk5MDUsMjk5OTAyMzMsNzQ5NzA4MjE2LC0zNTkyMDM3OT
YsLTEwODMxNzMyOTAsLTE5NzIwOTkxMjMsOTY5MjU4OTMyLC0x
MzAwNTI5ODE0XX0=
-->