// POST CARD
const card = (post) => {
  return `
    <div class="card z-depth-4">
        <div class="card-content">
            <span class="card-title">${post.name}</span>
            <p style="white-space: pre-line;">${post.text}</p>
            <p style="white-space: pre-line;">${post.tags}</p>
            <small>${new Date(post.date).toLocaleDateString()}</small>
        </div>
        <div class="card-action">
            <button class="btn btn-small red js-remove" data-id="${post._id}">
            <i class="material-icons">clear</i>
            </button>
        </div>
    </div>
    `;
};

let posts = [];
let modal;
const BASE_URL = "/api/post";

class PostAPI {
  static fetch() {
    return fetch(BASE_URL, { method: "get" }).then((res) => res.json());
  }

  static create(post) {
    return fetch(BASE_URL, {
      method: "post",
      body: JSON.stringify(post),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  }

  static remove(id) {
    return fetch(`${BASE_URL}/${id}`, {
      method: "delete",
    }).then((res) => res.json());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  PostAPI.fetch().then((backendPosts) => {
    posts = backendPosts.concat();
    renderPosts(posts);
  });

  modal = M.Modal.init(document.querySelector(".modal"));
  document.querySelector("#createPost").addEventListener("click", onCreatePost);
  document.querySelector("#posts").addEventListener("click", onDeletePost);
});

const renderPosts = (_posts = []) => {
  const $posts = document.querySelector("#posts");

  if (_posts.length > 0) {
    $posts.innerHTML = _posts.map((post) => card(post)).join(" ");
  } else {
    $posts.innerHTML = `<div class="center">В данный момент записей нет.</div>`;
  }
};

// ДОБАВЛЕНИЕ ЗАПИСИ

const onCreatePost = () => {
  const $name = document.querySelector("#name");
  const $text = document.querySelector("#text");
  const $tags = document.querySelector("#tags");

  if ($name.value && $text.value && tagTitles.length > 0) {
    const newPost = {
      name: $name.value,
      text: $text.value,
      tags: tagTitles.join(" "),
    };
    PostAPI.create(newPost).then((post) => {
      posts.push(post);
      renderPosts(posts);
    });
    modal.close();
    $name.value = "";
    $text.value = "";
    $tags.value = "";
    M.updateTextFields();
  }
};

// УДАЛЕНИЕ ЗАПИСИ

const onDeletePost = (event) => {
  if (
    event.target.classList.contains("js-remove") ||
    event.target.parentNode.classList.contains("js-remove")
  ) {
    const decision = confirm("Вы уверены, что хотите удалить запись");

    if (decision) {
      const id =
        event.target.getAttribute("data-id") ||
        event.target.parentNode.getAttribute("data-id");
      PostAPI.remove(id).then(() => {
        const postIndex = posts.findIndex((post) => post._id === id);
        posts.splice(postIndex, 1);
        renderPosts(posts);
      });
    }
  }
};

// TAGS

const tagContainer = document.querySelector(".tag-container");
const inputTag = document.querySelector(".tag-container input");

let tagTitles = [];

let createTag = (label) => {
  const div = document.createElement("div");
  div.setAttribute("class", "tag");
  const spanLabel = document.createElement("span");
  spanLabel.innerHTML = label;
  const span = document.createElement("span");
  span.setAttribute("class", "material-icons");
  span.setAttribute("data-item", label);
  span.innerHTML = "clear";

  div.appendChild(spanLabel);
  div.appendChild(span);

  return div;
};

let reset = () => {
  document.querySelectorAll(".tag").forEach((tagTitle) => {
    tagTitle.parentElement.removeChild(tagTitle);
  });
};

let addTagTitle = () => {
  reset();
  tagTitles
    .slice()
    .reverse()
    .forEach((tagTitle) => {
      const inputTagName = createTag(tagTitle);
      tagContainer.prepend(inputTagName);
    });
};

inputTag.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    tagTitles.push(inputTag.value);
    addTagTitle();
    inputTag.value = "";
  }
});

document.addEventListener("click", (event) => {
  if (event.target.tagName === "SPAN") {
    const value = event.target.getAttribute("data-item");
    const index = tagTitles.indexOf(value);
    tagTitles = [...tagTitles.slice(0, index), ...tagTitles.slice(index + 1)];
    addTagTitle();
  }
});
