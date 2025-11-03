import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validate } from '../middleware/validate.js';
import { CreateOrder } from '../structers/orderStruct.js';
const orderRouter = express.Router();

const prisma = new PrismaClient();

orderRouter.route('/').post(validate(CreateOrder), async (req, res) => {
  const { user, orderItems } = req.body;
  const productIds = orderItems.map((orderItem) => orderItem.product.productId);
  //const productIds = orderItems.product.map((orderItem) => orderItem.product.productId);
  // map은 배열에서 사용 가능한 매서드이기 때문에 ,rderItems.map 이 맞음
  //orderItems  배열을 순회하여 product.productId 를 변수에 담음

  function getQuantity(productId) {
    const orderItem = orderItems.find((orderItem) => orderItem.product.productId === productId);
    //array.find 는 배열에서 충족하는 첫번째 요소(값)자체를 반환
    return orderItem.quantity;
  }

  // 오더아이템의 재고확인
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    // where id in 옵션은 배열안에 담긴 값과 일치하는 모든 레코드를 찾아 달라는 옵션
    //일치하는 모든 레코드들이 변수에 담김
  });
  const isSufficentStock = products.every((product) => {
    //Array every() 메서드는 제공된 테스트 함수를 만족시키지 못한 배열 내 요소를 하나 찾으면 false를 반환. 그렇지 않으면 true를 반환.
    const { id, stock } = product;
    return stock >= getQuantity(id);
    //true 반환 >> 상품 재고보다 주문 수량이 적음
    //false 반환 >> 상품 재고보다 주문 수량이 많음 (재고 없음)
  });

  if (isSufficentStock === false) return res.status(500).send({ message: '상품 재고 없음' });

  //주문 수량만큼 재고 감소 / 트랜잭션 $transaction
  const queries = productIds.map((id) => {
    return prisma.product.update({
      where: { id },
      data: { stock: { decrement: getQuantity(id) } },
    });
  });
  // awiat를 안쓰는 이유는 promise를 배열에 담아 트랜잭션으로 한번에 처리하기 위해서
  // await를 쓰면 여러번 작동을 하다가 오류가 나면,주문은 실패했는데 재고만 줄어드는 데이터 불일치 상태가 발생
  //decrement 칼럼의 값을 낮추는 옵션
  //map이 productIds를 순회하며 인자로 받음, 프로덕트 모델에 접근 하여 인자로 받은 값을 where에 할당하여 레코드를 찾음,
  //data 옵션 처럼 찾은 레코드의 칼럼 값을 수정 , 그 후 promise객체에 담아 quries 라는 변수에 배열로 담음

  //order생성
  const [order] = await prisma.$transaction([
    prisma.order.create({
      data: {
        user: { connect: { id: user.userId } },
        orderItems: {
          create: orderItems.map((item) => {
            // DB에서 조회한 안전한 상품 정보를 사용합니다.
            const product = products.find((p) => p.id === item.product.productId);
            return {
              quantity: item.quantity,
              unitPrice: product.price, // 규칙 1 해결: DB 가격으로 unitPrice 설정
              product: {
                connect: { id: item.product.productId }, // 규칙 2 해결: 올바른 관계 연결
              },
            };
          }), // 오더아이템스라는 새로운 레코드를 만들면서 유닛프라이스 값에 대한 로직>>이부분은 시간이 없어서 ai로 긁어 오기만 했음 다음에 다시 살펴보기
        },
      },
      include: { orderItems: true },
    }),
    ...queries,
    //트랜섹션을 이용
    //queries는 배열이니 스프레드 문법으로
  ]);
  res.status(201).send(order);
});

export default orderRouter;
