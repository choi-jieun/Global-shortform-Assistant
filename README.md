# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.


---

# AI-based Global Short-form Assistant

매경미디어의 긴 영상에서 숏폼으로 활용하기 좋은 구간을 추천하고,
영어 자막, 제목, 설명, 해시태그 등 숏폼 제작에 필요한 자료를 생성해주는 웹서비스입니다.

## Project Overview

긴 영상을 유튜브 쇼츠, 인스타그램 릴스, 틱톡 등의 숏폼 콘텐츠로 활용하기 위해서는
영상의 핵심 구간을 찾고, 자막과 번역을 작성하고, 제목과 설명 등을 만드는 과정이 필요합니다.

이 프로젝트는 이러한 작업을 AI를 활용해 보조하는 것을 목표로 합니다.

숏폼 영상 자체를 자동으로 제작하기보다는,
콘텐츠 제작자가 실제 편집에 활용할 수 있는 **숏폼 제작용 자료를 제공하는 서비스**에 초점을 맞추었습니다.

## Main Features

* 영상 링크 입력 및 분석
* 숏폼으로 활용하기 좋은 핵심 구간 추천
* 추천 구간의 한국어 자막 제공
* 영어 번역 자막 제공
* 숏폼 제목 생성
* 영상 설명 생성
* 해시태그 추천
* 썸네일 문구 생성
* 생성 결과 복사

## Service Flow

#### 1. 영상 입력

사용자가 분석할 영상의 링크를 입력합니다.

#### 2. 영상 분석

입력된 영상의 내용을 분석하고 숏폼으로 활용하기 좋은 구간을 찾습니다.

#### 3. 구간 추천

분석한 영상에서 숏폼 후보 구간과 해당 구간을 추천하는 이유를 제공합니다.

#### 4. 콘텐츠 생성

추천된 구간을 바탕으로 다음 내용을 생성합니다.

* 한국어 자막
* 영어 번역 자막
* 제목
* 영상 설명
* 해시태그
* 썸네일 문구

#### 5. 결과 확인

생성된 결과를 확인하고 필요한 내용을 복사하여 실제 숏폼 제작에 활용할 수 있습니다.

## Screens

#### Start Screen

영상 링크를 입력하고 분석을 시작하는 화면입니다.

#### Analysis Screen

영상 분석 진행 상태를 확인할 수 있는 화면입니다.

#### Result Screen

추천 숏폼 구간과 구간별 분석 결과를 확인할 수 있습니다.

#### Content Result Screen

자막, 영어 번역, 제목, 설명, 해시태그 등 생성된 숏폼 제작 자료를 확인할 수 있습니다.

## Tech Stack

**Frontend**

* React
* TypeScript
* Vite
* CSS

**Backend / AI**

* REST API
* JSON
* 영상 및 자막 데이터 처리
* 번역 및 콘텐츠 생성

**Tools**

* Figma
* Replit
* GitHub Copilot
* ChatGPT
* GitHub

## Team

| 이름  | 역할                     | 담당                                  |
| --- | ---------------------- | ----------------------------------- |
| 최지은 | UI/UX · Frontend       | UI/UX 설계, 사용자 흐름 설계, React 기반 화면 구현 |
| 이예은 | Frontend · Integration | 프론트엔드 및 백엔드 API 연동, 데이터 출력 및 오류 수정  |
| 정서원 | Backend                | 영상 및 자막 데이터 처리, 번역 및 콘텐츠 생성, API 구성 |

## Development

#### Frontend

* Figma를 활용한 서비스 화면 설계
* React와 TypeScript를 활용한 화면 구현
* Mock Data를 활용한 서비스 흐름 구현

#### Backend

* 영상 및 자막 데이터 처리
* 숏폼 추천 구간 생성
* 영어 번역
* 제목, 설명, 해시태그 생성
* API 응답 구성

#### Integration

* 기존 Mock Data를 실제 API 응답으로 변경
* Frontend와 Backend API 연결
* 분석 결과 화면 출력
* 오류 처리 및 기능 점검

## Scope

현재 프로젝트에서는 숏폼 영상을 직접 편집하여 생성하는 기능까지는 구현하지 않았습니다.

대신 하나의 긴 영상을 분석해 다음과 같은 숏폼 제작 자료를 제공하는 데 집중했습니다.

* 추천 구간
* 한국어 자막
* 영어 번역
* 제목
* 설명
* 해시태그
* 썸네일 문구

추후에는 실제 숏폼 영상 생성, 다국어 번역, 결과 다운로드 등의 기능을 추가할 수 있습니다.

## Getting Started

```bash
git clone <repository-url>
cd <project-directory>
npm install
npm run dev
```

## License

This project is licensed under the [MIT License](LICENSE).

