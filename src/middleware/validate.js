import { assert } from 'superstruct';

export function validate(struct) {
  return (req, res, next) => {
    try {
      assert(req.body, struct);
      next();
    } catch (e) {
      next(e);
    }
  };
}
//ai 도움으로 만들었음.
// 발리데이터 함수를 이용하는 이유 : assert를 api 로직에 그대로 넣으면 비지니스 로직에 리퀘스트와 리스폰스를 다루는 로직 외에
//한가지 로직이 더 생김으로 직관성이 떨어지고 재사용성이 떨어짐 그래서 파라미터 값으로 스트럭트 로직을 받는 로칼 미들웨어를 반환하는 팩토리 함수 만들어서 사용
