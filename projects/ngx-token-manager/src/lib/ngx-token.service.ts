import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageMap } from '@ngx-pwa/local-storage';
import { BehaviorSubject, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NgxTokenManager<T> {

  constructor(private $storage: StorageMap) {
    this.$storage.watch(this.key, { type: 'string' }).subscribe(token => {
      const load = this.helper.decodeToken<T>(token);
      this._changes.next(load);
    });
  }

  private key = 'jwt_token';

  private readonly helper = new JwtHelperService();

  private readonly _changes = new BehaviorSubject<T | null>(null);

  /**
   * Observbale that emits the current decoded token payload and again each time the token is changed via
   * setToken() or delete().
   */
  public readonly changes$ = this._changes.asObservable();
  /**
   * Set the key to be used to store the token
   */
  public setKey(key: string) {
    this.key = key;
  }
  /**
   * Returns an obseravable that emits the token's Date of expiration, or null if no expiration.
   */
  public getExpiration() {
    return this.getStoredToken().pipe(map(token => {
      return this.helper.getTokenExpirationDate(token);
    }))
  }
  /**
   * Returns an observable that emits true if token is already expired, false if not.
   */
  public isExpired() {
    return this.getStoredToken().pipe(map(token => {
      return this.helper.isTokenExpired(token);
    }))
  }
  /**
   * Returns an observable that emits the current token's status
   * @see TokenStatus
   */
  public getStatus() {
    return this.getStoredToken().pipe(map(token => {
      return this.parseTokenStatus(token);
    }))
  }
  /**
   * Sets the token value and returns an observable that emits the token's expiration, or null if no expiration.
   */
  public setToken(token: string | undefined) {
    if (this.parseTokenStatus(token) !== TokenStatus.UNEXPIRED) {
      return throwError('Cannot set an expired or invalid token.')
    }
    return this.$storage.set(this.key, token).pipe(map(() => {
      return this.helper.getTokenExpirationDate(token);
    }))
  }
  /**
   * Deletes the token and returns an observable that emits void when complete.
   */
  public delete() {
    return this.$storage.delete(this.key);
  }
  /**
   * Returns an observable that emits the decoded token payload.
   */
  public getPayload() {
    return this.getStoredToken().pipe(map(token => {
      return this.helper.decodeToken<T>(token);
    }));
  }
  /**
   * Returns an observable that emits the stored token, or undefined if none
   */
  public getStoredToken() {
    return this.$storage.get<string>(this.key, { type: 'string' });
  }

  private parseTokenStatus(token: string | undefined) {
    if (!token) return TokenStatus.NONE
    if (this.helper.isTokenExpired(token)) return TokenStatus.EXPIRED
    else return TokenStatus.UNEXPIRED;
  }
}

export enum TokenStatus {
  NONE,
  EXPIRED,
  UNEXPIRED
}
