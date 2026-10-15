import type { CollaborationResponseFetchAllUsers } from 'atlasgp-api'

export type CollaborationUsers = CollaborationResponseFetchAllUsers[];

export type CollaborationStore = {
    users: CollaborationUsers;
    allUsers: CollaborationUsers;
};
