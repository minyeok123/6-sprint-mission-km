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
