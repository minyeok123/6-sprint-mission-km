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
      if (res.status >= 300) {
        console.log("응답 코드가 2XX가 아님!");
      }
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};

//-----------------------------------------------------------------------------
export const getArticle = (id) => {
  return fetch(`https://panda-market-api-crud.vercel.app/articles/${id}`)
    .then((res) => {
      if (res.status >= 300) {
        console.log("응답 코드가 2XX가 아님!");
      }
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};

//------------------------------------------------------------------------------
export const createArticle = (NewArticle) => {
  return fetch(`https://panda-market-api-crud.vercel.app/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(NewArticle),
  })
    .then((res) => {
      if (res.status >= 300) {
        console.log("응답 코드가 2XX가 아님!");
      }
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
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
      if (res.status >= 300) {
        console.log("응답 코드가 2XX가 아님!");
      }
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};

//--------------------------------------------------------------------------------------
export const deleteArticle = (id) => {
  return fetch(
    `https://panㅁㄴㅇda-market-api-crud.vercel.app/articles/${id}`,
    {
      method: "DELETE",
    }
  )
    .then((res) => {
      if (res.status >= 300) {
        console.log("응답 코드가 2XX가 아님!");
      }
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};
