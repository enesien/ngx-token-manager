# NgxTokenManager

Small Angular service to easily manage tokens (like JWT) asynchronously in the browser without the use of localStorage.

## Usage

Install

`npm install ngx-token-manager`

Provide `NgxTokenModule` in your app.module.ts file

```javascript
import { NgxTokenModule } from "ngx-token-manager";

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    // ...
    NgxTokenModule,
  ],
})
export class AppModule {}
```

Inject and use `NgxTokenManager`

```javascript
constructor(private $token: NgxTokenManager<YourTokenModel>) {
  // get status of the token
  this.$token.getStatus().subscribe(status => {
    switch (status) {
      case TokenStatus.NONE: // there is no token
      case TokenStatus.EXPIRED: // token already expired
      case TokenStatus.UNEXPIRED: // token exists and hasn't expired
    }
  })
}
```

### All Methods

```javascript
  setKey(key: string): void
  getStatus(): Observable<TokenStatus>
  isExpired(): Observable<boolean>
  setToken(token: string): Observable<Date>
  getPayload(): Observable<YourTokenModel>
  delete(): Observable<void>
  changes$: Observable<YourTokenModel>
```
