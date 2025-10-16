export class ARTICLE {
  constructor(
    title,
    content,
    writer = Writer[Math.floor(Math.random() * 7)] //'Math.floor(Math.random() * 7)' <= mdn 참고
  ) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = "👍x 0";
    this.createdAt = new Date().toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul", // ''toLocaleString''mdn 40분동안 찾아보다가 어지러워서 gpt에게 도움 요청
    });
  }

  like() {
    console.log(`${this.title}을(를) 좋아합니다👍`);
    let num = Number(this.likeCount[3]);
    num += 1;
    this.likeCount = this.likeCount.slice(0, 3) + num;
  }
}

const Writer = [
  "김민혁",
  "방 구흐",
  "J. K. 랄링",
  "피어니스트 헤밍 웨이",
  "앙투안 드 생때쥐페리",
  "스티븐 퀸",
  "스티븐 스틸버그",
];
