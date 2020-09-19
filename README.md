# HUST Course Excel to ICS

尝试将 HUST 教务处课表，从 Excel 解析并转化为 ICS 的工具。

用于解决教务系统内课程不灵活无法调整的问题。

## Table of Contents

- [HUST Course Excel to ICS](#hust-course-excel-to-ics)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Plans](#plans)
  - [Contributing](#contributing)

## Installation

```sh
git clone git@github.com:MMMartt/HUST-course-Excel-to-ICS.git
cd HUST-course-Excel-to-ICS
yarn
# move excel to input directory first
mv a b c ouput
yarn start
```

建议版本：

- Node.js >= v12.16.1

或自己调整 `tsconfig.json` 中编译选项，没有测试过。

## Usage

将原始课表文件放到 `input` 文件夹下，`yarn start` 即可，自带基本用法说明。

需要注意的一些问题包括：

- 如果遇到问题，可以在 `index.ts` 中取消两行输出文件注释调试。

- 大部分问题应该都是出在表格格式不正确上，可以自行修改表格或[提出 issue](https://github.com/MMMartt/HUST-course-Excel-to-ICS/issues/new)。

- 需多次使用可 `build` 后直接跑 JS。

- 如果需要从 HUB 上爬取，可以尝试 [HUST Course to ICS](https://github.com/MMMartt/hust-courses-to-ics)。

## Plans

- [ ] 支持配置文件选择课程
- [ ] 完善夏季作息冬季作息
- [ ] 更友好的界面

## Contributing

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/MMMartt/HUST-course-Excel-to-ICS/compare/).
