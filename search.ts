import { readFileSync } from 'fs'

export type Post = {
  id: number
  title: string
  kind: 'report' | 'gallery' | 'video' | 'banner' | 'informative'
  publishedAt: Date
  createdAt: Date
  category: string[]
  targets: string[]
}

export type PostFilter = {
  title?: string
  kind?: 'report' | 'gallery' | 'video' | 'banner' | 'informative'
  category?: string
  target?: string
  publishedAtStart?: Date
  publishedAtEnd?: Date
  createdAtStart?: Date
  createdAtEnd?: Date
}


export async function search(filter: PostFilter): Promise<Post[]> {
  const posts: Post[] = JSON.parse(readFileSync('./data/posts.json', 'utf-8'))

  /********************************************
   *            CODIFIQUE AQUI!
   *    Você deve implementar essa função
   ********************************************/
 const FilteredPosts = posts.filter(post => {
  if (filter.title && !post.title.toLowerCase().includes(filter.title.toLowerCase())) {
  return false
} 

if (filter.kind && post.kind !== filter.kind) {
  return false
}

if (filter.category && !post.category.includes(filter.category)) {
  return false 
} 

if (filter.target && !post.targets.includes(filter.target)) {
  return false
}

if (filter.publishedAtStart && new Date (post.publishedAt) < filter.publishedAtStart) {
 return false
}

if (filter.publishedAtEnd && new Date (post.publishedAt) > filter.publishedAtEnd) {
  return false
 }

if (filter.createdAtStart && new Date (post.createdAt) < filter.createdAtStart){
  return false 
}

if (filter.createdAtEnd && new Date (post.createdAt) > filter.createdAtEnd) {
  return false
 }
 
 return true
})


  return FilteredPosts.sort((b, a) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
}
