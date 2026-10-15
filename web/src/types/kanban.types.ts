import type { GoalItem, KanbanColumnItem, KanbanFilters, KanbanResponseTasksForColumn } from 'atlasgp-api'

export type KanbanStoreState = {
    tasksData: {
        [key: KanbanColumnItem['id']]: KanbanResponseTasksForColumn | undefined;
    };
    // TODO: rename to columns
    statuses: KanbanColumnItem[];
    goalId: GoalItem['id'];
    filters: KanbanFilters;
};