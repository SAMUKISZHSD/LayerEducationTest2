import { Post } from '.'
import { writeFile } from 'fs/promises'
import { sampleSize } from 'lodash'

async function generateData() {
  const posts: Post[] = []
  const possibleKinds = ['report', 'gallery', 'video', 'banner', 'informative']
  const possibleCategories = [
    'Notícia',
    'Prova',
    'Tarefa',
    'Avaliação',
    'Material',
  ]
  const possibleTargets = [
    'Aluno',
    'Professor',
    'Coordenador',
    'Diretor',
    'Pais',
  ]
  const publishedAtDateRange = {
    start: new Date('2024-01-01'),
    end: new Date('2024-06-20'),
  }
  const createdAtDateRange = {
    start: new Date('2023-08-01'),
    end: new Date('2023-12-20'),
  }

  for (let i = 0; i < 100_000; i++) {
    const post: Post = {
      id: i + 1,
      title: `Post ${i + 1}`,
      kind: possibleKinds[
        Math.floor(Math.random() * possibleKinds.length)
      ] as any,
      publishedAt: new Date(
        publishedAtDateRange.start.getTime() +
          Math.random() *
            (publishedAtDateRange.end.getTime() -
              publishedAtDateRange.start.getTime())
      ),
      createdAt: new Date(
        createdAtDateRange.start.getTime() +
          Math.random() *
            (createdAtDateRange.end.getTime() -
              createdAtDateRange.start.getTime())
      ),
      category: sampleSize(
        possibleCategories,
        1 + Math.floor(Math.random() * 2)
      ),
      targets: sampleSize(possibleTargets, 1 + Math.floor(Math.random() * 2)),
    }
    posts.push(post)
  }
  await writeFile('./data/posts.json', JSON.stringify(posts, null, 2))
}

generateData()
