import type { GoalItem } from 'atlasgp-api'

export type Project = GoalItem

export type ProjectSaveData = {
  name: string
  description: string
  estimateUnit: 'hours' | 'points'
}
