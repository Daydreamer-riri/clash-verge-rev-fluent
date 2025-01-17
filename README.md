<h1 align="center">
  <img src="./src-tauri/icons/icon.png" alt="Clash" width="128" />
  <br>
  Fluent of <a href="https://github.com/zzzgydi/clash-verge">Clash Verge</a>
  <br>
</h1>

<h3 align="center">
A Clash Meta GUI based on <a href="https://github.com/tauri-apps/tauri">Tauri</a>.
</h3>

## Preview

| Dark                             | Light                             |
| -------------------------------- | --------------------------------- |
| ![预览](./docs/preview_dark.png) | ![预览](./docs/preview_light.png) |

> [!IMPORTANT]
> 该项目为[clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev)的 fork，修改为了 fluent design 风格界面。不做任何功能性维护。本项目的会定期合并上游代码，做出我认为必要的 UI 修改后发布安装包。
> 目前大部分第一层界面风格已经修改为 fluent 风格，还存在部分内部页面有待修改。欢迎 PR！

## Install

请到发布页面下载对应的安装包：[Release page](https://github.com/Daydreamer-riri/clash-verge-rev-fluent/releases)<br>
Go to the [release page](https://github.com/Daydreamer-riri/clash-verge-rev-fluent/releases) to download the corresponding installation package<br>
Supports Windows (x64/x86/arm64), Linux (x64/arm64) and macOS 10.15+ (intel/apple).

### 安装说明和常见问题，请到[文档页](https://clash-verge-rev.github.io/)查看：[Doc](https://clash-verge-rev.github.io/)

---

### TG Group: [@clash_verge_rev](https://t.me/clash_verge_rev)

## Features

- Since the clash core has been removed. The project no longer maintains the clash core, but only the Clash Meta core.
- Profiles management and enhancement (by yaml and Javascript). [Doc](https://clash-verge-rev.github.io)
- Improved UI and supports custom theme color.
- Built-in support [Clash.Meta(mihomo)](https://github.com/MetaCubeX/mihomo) core.
- System proxy setting and guard.

### FAQ

Refer to [Doc FAQ Page](https://clash-verge-rev.github.io/faq/windows.html)

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

To run the development server, execute the following commands after all prerequisites for **Tauri** are installed:

```shell
pnpm i
pnpm run check
pnpm dev
```

## Contributions

Issue and PR welcome!

## Acknowledgement

Clash Verge rev was based on or inspired by these projects and so on:

- [zzzgydi/clash-verge](https://github.com/zzzgydi/clash-verge): A Clash GUI based on tauri. Supports Windows, macOS and Linux.
- [tauri-apps/tauri](https://github.com/tauri-apps/tauri): Build smaller, faster, and more secure desktop applications with a web frontend.
- [Dreamacro/clash](https://github.com/Dreamacro/clash): A rule-based tunnel in Go.
- [MetaCubeX/mihomo](https://github.com/MetaCubeX/mihomo): A rule-based tunnel in Go.
- [Fndroid/clash_for_windows_pkg](https://github.com/Fndroid/clash_for_windows_pkg): A Windows/macOS GUI based on Clash.
- [vitejs/vite](https://github.com/vitejs/vite): Next generation frontend tooling. It's fast!

## License

GPL-3.0 License. See [License here](./LICENSE) for details.
