import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const workflowSteps = [
  {
    number: "1",
    title: "영상을 읽습니다",
    descriptions: ["음성을 한국어 텍스트로 옮기고", "장면 흐름을 파악합니다"],
  },
  {
    number: "2",
    title: "AI가 숏츠 구간을 고릅니다",
    descriptions: [
      "발화 밀도와 화제 전환을 기준으로",
      "30~60초 구간을 추천합니다",
    ],
  },
  {
    number: "3",
    title: "숏폼 소재를 만듭니다",
    descriptions: ["영어 번역 자막과 제목·설명·", "해시태그를 생성합니다"],
  },
];

const exampleLinks = ["《알토란》김치찌개 편", "MBN 뉴스와이드 물가 특집"];

export const Element = (): JSX.Element => {
  const [videoLink, setVideoLink] = useState("");
  const [, setLocation] = useLocation();

  const handleExampleClick = (example: string) => {
    setVideoLink(example);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation("/analyzing");
  };

  return (
    <main className="min-h-[692px] overflow-hidden bg-white [font-family:'Inter',Helvetica] text-[#2b2f36]">
      <header className="border-b border-[#eeeeee]">
        <div className="mx-auto flex h-[35px] max-w-[800px] items-center justify-between px-[27px]">
          <a
            href="#main-content"
            className="flex items-center gap-[6px] text-[10px] font-bold tracking-[0] leading-none text-[#2b2f36]"
          >
            <span
              className="h-[13px] w-[13px] rounded-[3px] bg-[#ff6a13]"
              aria-hidden="true"
            />
            MBN Global Shorts Finder
          </a>
          <Button
            type="button"
            variant="ghost"
            className="h-auto p-0 text-[7px] font-normal text-[#767c86] hover:bg-transparent hover:text-[#2b2f36]"
          >
            더보기
          </Button>
        </div>
      </header>
      <section
        id="main-content"
        className="mx-auto flex max-w-[800px] flex-col items-center px-6 pt-[161px] text-center"
        aria-labelledby="page-title"
      >
        <h1
          id="page-title"
          className="text-[27px] font-bold tracking-[-1.2px] leading-[1.2] text-[#2b2f36]"
        >
          긴 영상에서 글로벌 숏폼 소재를 찾아 드립니다
        </h1>
        <form
          className="mt-[17px] flex w-full max-w-[498px] gap-[9px]"
          onSubmit={handleSubmit}
        >
          <Input
            aria-label="영상 링크"
            defaultValue={videoLink}
            key={videoLink}
            placeholder="영상 링크를 붙여넣으세요"
            className="h-[37px] flex-1 rounded-[6px] border-[#ffbb92] px-[14px] text-[8px] text-[#767c86] placeholder:text-[#767c86] focus-visible:ring-[#ff6a13]"
          />
          <Button
            type="submit"
            className="h-[37px] w-[89px] rounded-[5px] bg-[#ff6a13] text-[9px] font-bold text-white hover:bg-[#e95d0b]"
          >
            START
          </Button>
        </form>
        <p className="mt-[17px] text-[9px] leading-[1.35] text-[#767c86]">
          매경미디어 영상 링크를 넣으면 숏츠 추천 구간과
          <br />
          한국어·영어 자막,제목·설명·해시태그까지 한 번에 만들어 줍니다.
        </p>
        <section
          className="mt-[62px] w-full"
          aria-labelledby="how-it-works-title"
        >
          <h2
            id="how-it-works-title"
            className="text-[11px] font-bold leading-none text-[#2b2f36]"
          >
            How to AI work?
          </h2>
          <div className="mx-auto mt-[13px] grid max-w-[401px] grid-cols-3 gap-[12px] text-left">
            {workflowSteps.map((step) => (
              <Card
                key={step.number}
                className="h-[126px] rounded-[7px] border-[#ebedf0] bg-white shadow-none"
              >
                <CardContent className="p-[14px]">
                  <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#fff3ed] text-[9px] font-bold text-[#ff6a13]">
                    {step.number}
                  </span>
                  <h3 className="mt-[12px] whitespace-nowrap text-[9px] font-bold leading-none text-[#2b2f36]">
                    {step.title}
                  </h3>
                  <div className="mt-[10px] space-y-[4px] text-[7px] leading-none text-[#767c86]">
                    {step.descriptions.map((description) => (
                      <p key={description}>{description}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-[12px] text-[6px] text-[#767c86]">
            ※ 영상 파일 자동 편집·생성은 지원하지 않습니다.
          </p>
        </section>
        <section className="mt-[20px]" aria-label="예시 영상 링크">
          <p className="text-[7px] text-[#767c86]">
            Try an example link first!
          </p>
          <div className="mt-[8px] flex justify-center gap-[7px]">
            {exampleLinks.map((example) => (
              <Button
                key={example}
                type="button"
                variant="outline"
                onClick={() => handleExampleClick(example)}
                className="h-auto rounded-full border-[#e4e6e9] bg-white px-[7px] py-[3px] text-[7px] font-normal leading-none text-[#767c86] hover:bg-[#fff3ed] hover:text-[#ff6a13]"
              >
                {example}
              </Button>
            ))}
          </div>
        </section>
      </section>
      <footer
        className="mt-[89px] border-t border-[#eeeeee]"
        aria-hidden="true"
      />
    </main>
  );
};
