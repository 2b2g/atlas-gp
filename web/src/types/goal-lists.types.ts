import type { GoalListItem } from 'atlasgp-api'

/** @deprecated use GoalListItem[] from atlasgp-api instead */
export type GoalListItems = GoalListItem[];

export type GoalListsStoreState = {
    lists: GoalListItem[];
    loading: boolean;
};

export type GoalListEventMoreMenu = {
    activator: HTMLElement;
    list: GoalListItem;
};

export type GoalListActionsItemsEvents = 'editList' | 'deleteList' | 'archiveGoalList';

export type GoalListActionsItems = {
    id: number;
    name: string;
    eventName: GoalListActionsItemsEvents;
    icon?: string;
}[];
