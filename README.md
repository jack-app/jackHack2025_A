# キャンセラビット（jackHack2025チームA）

かわいいうさぎが、ネガティブな文章を検知したらポジティブな文章に変えてくれるChrome拡張機能です

## プロダクト紹介
デモ動画：https://www.youtube.com/watch?v=w4L3FMTnRj8

<img src="assets/キャンセラビットタイトル.png" alt="キャンセラビットタイトル" width="480">
<img src="assets/キャンセラビット紹介.png" alt="キャンセラビット紹介" width="480">

## 使用テンプレート

このリポジトリは以下のテンプレートをベースに作成されています：

[**Jonghakseo/chrome-extension-boilerplate-react-vite (v0.4.3)**](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/tree/0.4.3)
Chrome 拡張機能を React + Vite + TypeScript で開発するためのボイラープレートです。

## インストール手順

以下の手順に従って、このChrome拡張機能をローカル環境にセットアップしてください。

### 前提条件

* [Git](https://git-scm.com/)がインストールされていること
* [Node.js](https://nodejs.org/)（v16以上推奨）がインストールされていること
* [pnpm](https://pnpm.io/)がインストールされていること

  * インストールされていない場合は、`npm install -g pnpm`でインストールできます

### 1. リポジトリのクローン

ターミナルを開き、以下のコマンドを実行して、リポジトリをクローンします：

```bash
git clone git@github.com:jack-app/jackHack2025_A.git
```

### 2. プロジェクトディレクトリに移動

クローンしたリポジトリのディレクトリに移動します：

```bash
cd jackHack2025_A
```

### 3. .env ファイルの作成と Gemini API キーの設定

プロジェクトルートに `.env` ファイルを作成し、以下のように Gemini API キーを登録してください：

```env
CEB_API_KEY="登録した GeminiAPI key"
```

Gemini API キーの取得方法については、以下のドキュメントをご参照ください：

* [Google Cloud Generative AI (Gemini) API キーの取得方法](https://cloud.google.com/generative-ai/docs/getting-started)
  サービスアカウントの作成とキー生成手順を含みます。

### 4. 依存関係のインストール

pnpmを使用して、必要なパッケージをインストールします：

```bash
pnpm install
```

### 5. 開発サーバーの起動とビルド

以下のコマンドで開発サーバーを起動し、拡張機能をビルドします：

```bash
pnpm dev
```

このコマンドを実行すると：

* プロジェクトがビルドされます
* `dist`ディレクトリに拡張機能の実行ファイルが生成されます
* ファイルの変更を監視し、変更があれば自動的に再ビルドされます

### 6. Chrome拡張機能として読み込む

1. Google Chromeを開きます
2. アドレスバーに `chrome://extensions/` と入力してEnterキーを押します
3. 右上の「デベロッパーモード」をオンにします（トグルスイッチが右側になっていることを確認）
4. 左上に表示される「パッケージ化されていない拡張機能を読み込む」ボタンをクリックします
5. 表示されるダイアログで、このプロジェクトの `dist` ディレクトリを選択して「フォルダーの選択」をクリックします

これで拡張機能がChromeに読み込まれ、ツールバーに拡張機能のアイコンが表示されるはずです。

## ライセンス

本プロジェクトは [MIT License](LICENSE) の下で公開されています。

## Credits

* テンプレート提供元: [Jonghakseo](https://github.com/Jonghakseo)
  リポジトリ: [chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)
  ライセンス: MIT License
* 上記テンプレートをベースに、構成や機能をカスタマイズして本プロジェクトを作成しています。
