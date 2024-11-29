import { describe, it } from "node:test";
import test from "node:test";
import assert from "node:assert";
import { Post, POST_KINDS, search } from "./search";

describe("Empty filter", () => {
  it("should return all posts if filter is empty", async () => {
    const posts = await search({});
    assert(posts.length === 100_000);
    assertPostsAreSorted(posts);
  });
});

describe("Filter with title", () => {
  it("should return all posts if title is empty", async () => {
    const posts = await search({ title: "" });
    assert(posts.length === 100_000);
    assertPostsAreSorted(posts);
  });

  it('should return all posts if searching for "post" in lowercase', async () => {
    const posts = await search({ title: "post" });
    assert(posts.length === 100_000);
    assertPostsAreSorted(posts);
  });

  it('should return all posts if searching for "Post" in uppercase', async () => {
    const posts = await search({ title: "Post" });
    assert(posts.length === 100_000);
    assertPostsAreSorted(posts);
  });

  it('should return nothing if searching for "NON_EXISTING_POST"', async () => {
    const posts = await search({ title: "Post NON_EXISTING_POST" });
    assert(posts.length === 0);
  });

  it('should return matching posts if searching for "9"', async () => {
    const posts = await search({ title: "9" });
    assert(posts.length > 0);
    assertPostsAreSorted(posts);
    assert(posts.every((post) => post.title.includes("9")));
  });
});

describe("Filter with kind", () => {
  for (const kind of POST_KINDS) {
    it(`should return matching posts if kind is "${kind}"`, async () => {
      const posts = await search({ kind });
      assert(posts.length > 0);
      assertPostsAreSorted(posts);
      assert(posts.every((post) => post.kind === kind));
    });
  }
});

describe("Filter with category", () => {
  it('should return matching posts if searching for "Notícia"', async () => {
    const posts = await search({ category: "Notícia" });
    assert(posts.length > 0);
    assertPostsAreSorted(posts);
    assert(posts.every((post) => post.category.includes("Notícia")));
  });

  it('should return nothing if searching for "NON_EXISTING_CATEGORY"', async () => {
    const posts = await search({ category: "NON_EXISTING_CATEGORY" });
    assert(posts.length === 0);
  });
});

describe("Filter with target", () => {
  it('should return matching posts if searching for "Aluno"', async () => {
    const posts = await search({ target: "Aluno" });
    assert(posts.length > 0);
    assertPostsAreSorted(posts);
    assert(posts.every((post) => post.targets.includes("Aluno")));
  });

  it('should return nothing if searching for "NON_EXISTING_TARGET"', async () => {
    const posts = await search({ target: "NON_EXISTING_TARGET" });
    assert(posts.length === 0);
  });
});

describe("Filter with publishedAtStart", () => {
  it("should return matching posts if publishedAtStart", async () => {
    const date = new Date("2024-06-01");
    const posts = await search({ publishedAtStart: date });
    assert(posts.length > 0);
    assertPostsAreSorted(posts);
    assert(posts.every((post) => new Date(post.publishedAt) >= date));
  });

  it("should return nothing if publishedAtStart is in the future", async () => {
    const date = new Date("2025-06-01");
    const posts = await search({ publishedAtStart: date });
    assert(posts.length === 0);
  });
});

describe("Filter with publishedAtEnd", () => {
  it("should return matching posts if publishedAtEnd", async () => {
    const date = new Date("2024-05-20");
    const posts = await search({ publishedAtEnd: date });
    assert(posts.length > 0);
    assertPostsAreSorted(posts);
    assert(posts.every((post) => new Date(post.publishedAt) <= date));
  });

  it("should return nothing if publishedAtEnd is in the past", async () => {
    const date = new Date("1995-05-20");
    const posts = await search({ publishedAtEnd: date });
    assert(posts.length === 0);
  });
});

describe("Filter with createdAtStart", () => {
  it("should return matching posts if createdAtStart", async () => {
    const date = new Date("2023-10-10");
    const posts = await search({ createdAtStart: date });
    assert(posts.length > 0);
    assertPostsAreSorted(posts);
    assert(posts.every((post) => new Date(post.createdAt) >= date));
  });

  it("should return nothing if createdAtStart is in the future", async () => {
    const date = new Date("2025-10-10");
    const posts = await search({ createdAtStart: date });
    assert(posts.length === 0);
  });
});

describe("Filter with createdAtEnd", () => {
  it("should return matching posts if createdAtEnd", async () => {
    const date = new Date("2023-10-20");
    const posts = await search({ createdAtEnd: date });
    assert(posts.length > 0);
    assertPostsAreSorted(posts);
    assert(posts.every((post) => new Date(post.createdAt) <= date));
  });

  it("should return nothing if createdAtEnd is in the past", async () => {
    const date = new Date("1995-10-20");
    const posts = await search({ createdAtEnd: date });
    assert(posts.length === 0);
  });
});

describe("Combining filters", () => {
  it("Using title and kind", async () => {
    const posts = await search({ title: "9", kind: "report" });
    assert(posts.length > 0);
    assertPostsAreSorted(posts);
    assert(
      posts.every((post) => post.title.includes("9") && post.kind === "report")
    );
  });

  it("Using title and category", async () => {
    const posts = await search({ title: "9", category: "Notícia" });
    assert(posts.length > 0);
    assertPostsAreSorted(posts);
    assert(
      posts.every(
        (post) => post.title.includes("9") && post.category.includes("Notícia")
      )
    );
  });

  it("Using all filters", async () => {
    const posts = await search({
      title: "9",
      kind: "report",
      category: "Notícia",
      target: "Aluno",
      publishedAtStart: new Date("2024-01-01"),
      publishedAtEnd: new Date("2024-06-20"),
      createdAtStart: new Date("2023-08-01"),
      createdAtEnd: new Date("2023-12-20"),
    });
    assert(posts.length > 0);
    assertPostsAreSorted(posts);
    assert(
      posts.every(
        (post) =>
          post.title.includes("9") &&
          post.kind === "report" &&
          post.category.includes("Notícia") &&
          post.targets.includes("Aluno") &&
          new Date(post.publishedAt) >= new Date("2024-01-01") &&
          new Date(post.publishedAt) <= new Date("2024-06-20") &&
          new Date(post.createdAt) >= new Date("2023-08-01") &&
          new Date(post.createdAt) <= new Date("2023-12-20")
      )
    );
  });

  it("Using publishedAtStart and publishedAtEnd", async () => {
    const publishedAtStart = new Date("2024-03-01");
    const publishedAtEnd = new Date("2024-04-01");
    const posts = await search({
      publishedAtStart,
      publishedAtEnd,
    });
    assert(posts.length > 0);
    assertPostsAreSorted(posts);
    assert(
      posts.every(
        (post) =>
          new Date(post.publishedAt) >= publishedAtStart &&
          new Date(post.publishedAt) <= publishedAtEnd
      )
    );
  });

  it("Using createdAtStart and createdAtEnd", async () => {
    const createdAtStart = new Date("2023-08-01");
    const createdAtEnd = new Date("2023-12-20");
    const posts = await search({
      createdAtStart,
      createdAtEnd,
    });
    assert(posts.length > 0);
    assertPostsAreSorted(posts);
    assert(
      posts.every(
        (post) =>
          new Date(post.createdAt) >= createdAtStart &&
          new Date(post.createdAt) <= createdAtEnd
      )
    );
  });
});

function assertPostsAreSorted(posts: Post[]) {
  for (let i = 0; i < posts.length - 1; i++) {
    assert(posts[i].publishedAt >= posts[i + 1].publishedAt);
  }
}
