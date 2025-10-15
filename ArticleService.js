export const getArticleList = (page, pageSize, keyword) => {
  let url = new URL("https://panda-market-api-crud.vercel.app/articles");
  url.searchParams.append("page", page);
  url.searchParams.append("pageSize", pageSize);
  // if (arguments[2] !== undefined) argument 는 function 에서만 자동으로 정의되는 객체
  if (keyword !== undefined) {
    url.searchParams.append("keyword", keyword);
  }
  return fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    });
};

//-----------------------------------------------------------------------------
export const getArticle = (id) => {
  return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    });
};

//------------------------------------------------------------------------------
export const creatArticle = (NewArticle) => {
  return fetch(`https://panda-market-api-crud.vercel.app/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(NewArticle),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    });
};

//------------------------------------------------------------------------------
export const patchArticle = (id, articleData) => {
  return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(articleData),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    });
};

//--------------------------------------------------------------------------------------
export const deleteArticle = (id) => {
  return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    });
};
