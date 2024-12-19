declare module '../resources/js/storage' {
  import { AsyncLocalStorage } from 'node:async_hooks'
  export const storage: AsyncLocalStorage
}
