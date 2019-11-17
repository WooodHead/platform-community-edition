import { Injectable } from '@angular/core';
import {
  UserType,
  UserlistGQL,
  UpdateProfileGQL,
  SetNewPasswordGQL,
  ResendVerificationEmailGQL,
  AddUserGQL,
  DeleteUserGQL,
  UserlistQuery,
  UserlistDocument
} from '../../core/types';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private userlistGQL: UserlistGQL,
    private updateProfileGQL: UpdateProfileGQL,
    private setNewPasswordGQL: SetNewPasswordGQL,
    private resendVerificationEmailGQL: ResendVerificationEmailGQL,
    private addUserGQL: AddUserGQL,
    private deleteUserGQL: DeleteUserGQL
  ) {}

  setNewPassword(password: string) {
    return this.setNewPasswordGQL
      .mutate({ password })
      .pipe(first())
      .subscribe();
  }

  updateProfile(profileData: { email: string; forename: string; lastname: string }) {
    return this.updateProfileGQL
      .mutate(profileData)
      .pipe(first())
      .subscribe();
  }

  getUserList() {
    return this.userlistGQL.watch().valueChanges;
  }

  resendVerificationEmail() {
    return this.resendVerificationEmailGQL
      .mutate()
      .pipe(first())
      .subscribe();
  }

  addUser(email: string) {
    return this.addUserGQL
      .mutate(
        { email },
        {
          update: (store, { data: { inviteNewUser } }) => {
            const data: UserlistQuery = store.readQuery({
              query: UserlistDocument
            });
            data.users.push(inviteNewUser);
            store.writeQuery({ query: UserlistDocument, data });
          }
        }
      )
      .pipe(first())
      .subscribe();
  }

  deleteUser(user: UserType) {
    return this.deleteUserGQL
      .mutate(
        { id: user.id },
        {
          update: (
            store,
            {
              data: {
                deleteUser: { id }
              }
            }
          ) => {
            const data: UserlistQuery = store.readQuery({
              query: UserlistDocument
            });
            data.users = data.users.filter(u => u.id !== id);
            store.writeQuery({ query: UserlistDocument, data });
          }
        }
      )
      .pipe(first())
      .subscribe();
  }

  resendInvitation(user: UserType) {
    throw new Error('Method not implemented.');
  }
}
