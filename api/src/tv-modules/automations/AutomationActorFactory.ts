import { AppUser } from '../../core/AppUser';

export class AutomationActorFactory {
    async forUser(userId: number): Promise<AppUser | null> {
        const user = await new AppUser().authManager.repository.fetchUserById(userId);
        if (!user || user.block !== 0) return null;

        const actor = new AppUser({ id: 0, userData: { id: user.id, login: user.login, email: user.email } });
        actor.setUserDataFromDb(user);
        return actor;
    }
}
