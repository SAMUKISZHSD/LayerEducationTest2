import { PostFilter, search } from "./search"

async function main() {
  // Você pode essa função à vontade também pra testar!
  const filter: PostFilter = {
    title: '9',
    kind: 'report',
    category: 'Notícia',
    target: 'Aluno',
    publishedAtStart: new Date('2024-01-01'),
    publishedAtEnd: new Date('2024-06-20'),
    createdAtStart: new Date('2023-08-01'),
    createdAtEnd: new Date('2023-12-20'),
  }

  console.time('filter')
  const posts = await search(filter)
  console.timeEnd('filter')

  console.table(posts)
}
main()
