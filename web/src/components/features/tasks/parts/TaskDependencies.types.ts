export type DependencyTask = {
  id: number
  description: string
  complete: number | boolean
}

export type DependencyEntry = {
  edgeId: number
  task: DependencyTask
}

export type DependencyEdgeAddArgs = {
  source: number
  target: number
  task: DependencyTask
}
