export async function getProductList(page, pageSize, keyword) {
  let url;
  let res;
  try {
    url = new URL("https://panda-market-api-crud.vercel.app/products");
    url.searchParams.append("page", page);
    url.searchParams.append("pageSize", pageSize);
    if (arguments[2] !== undefined) {
      url.searchParams.append("keyword", keyword);
    }
    res = await fetch(url);
  } catch (err) {
    console.log(err);
    throw new Error("네트워크 오류 발생");
  }
  if (!res.ok) {
    throw new Error("response생성 중 오류 발생");
  }
  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error("제이슨 파싱 중 오류 발생");
  }

  return data;
}
//-----------------------------------------------------------------------
export async function getProduct(id) {
  let res;
  try {
    res = await fetch(
      `https://panda-market-api-crud.vercel.app/products/${id}`
    );
  } catch (err) {
    console.log(err);
    throw new Error("네트워크 오류 발생");
  }

  if (!res.ok) {
    throw new Error("response생성 중 오류 발생");
  }

  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error("제이슨 파싱 중 오류 발생");
  }
  return data;
}

//------------------------------------------------------------------------
export async function createProduct(productData) {
  let res;
  try {
    res = await fetch("https://panda-market-api-crud.vercel.app/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
  } catch {
    console.log(err);
    throw new Error("네트워크 오류 발생");
  }

  if (!res.ok) {
    throw new Error("response생성 중 오류 발생");
  }

  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error("제이슨 파싱 중 오류 발생");
  }
  return data;
}

//------------------------------------------------------------------------
export async function patchProduct(id, productData) {
  let res;
  try {
    res = await fetch(
      `https://panda-market-api-crud.vercel.app/products/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      }
    );
  } catch (err) {
    console.log(err);
    throw new Error("네트워크 오류 발생");
  }

  if (!res.ok) {
    throw new Error("response생성 중 오류 발생");
  }

  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error("제이슨 파싱 중 오류 발생");
  }
  return data;
}

//---------------------------------------------------------------------
export async function deleteProduct(id) {
  let res;
  try {
    res = await fetch(
      `https://panda-market-api-crud.vercel.app/products/${id}`,
      {
        method: "DELETE",
      }
    );
  } catch (err) {
    console.log(err);
    throw new Error("네트워크 오류 발생");
  }

  if (!res.ok) {
    throw new Error("response생성 중 오류 발생");
  }

  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error("제이슨 파싱 중 오류 발생");
  }
  return data;
}

//=======================================================================
