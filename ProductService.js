export async function getProductList(page, pageSize, keyword) {
  let url = new URL("https://panda-market-api-crud.vercel.app/products");
  url.searchParams.append("page", page);
  url.searchParams.append("pageSize", pageSize);
  if (arguments[2] !== undefined) {
    url.searchParams.append("keyword", keyword);
  }
  let res = await fetch(url);

  let data = await res.json();

  return data;
}
//-----------------------------------------------------------------------
export async function getProduct(id) {
  let res = await fetch(
    `https://panda-market-api-crud.vercel.app/products/${id}`
  );
  let data = await res.json();
  return data;
}
//------------------------------------------------------------------------
export async function creatProduct(productData) {
  let res = await fetch("https://panda-market-api-crud.vercel.app/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });
  let data = await res.json();
  return data;
}
const NewProductData = {
  name: "RTX9080",
  description: "Graphic Card",
  price: 600000000,
  tags: "전자제품",
  images: ["https://example.com/..."],
};
//------------------------------------------------------------------------
export async function patchPrduct(id, productData) {
  let res = await fetch(
    `https://panda-market-api-crud.vercel.app/products/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    }
  );

  let data = await res.json();
  return data;
}
//---------------------------------------------------------------------
export async function deleteProduct(id) {
  let res = await fetch(
    `https://panda-market-api-crud.vercel.app/products/${id}`,
    {
      method: "DELETE",
    }
  );
  let data = await res.json();
  return data;
}
//=======================================================================
