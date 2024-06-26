import type { D1Database, CacheStorage, Cache } from '@cloudflare/workers-types';
import 'unplugin-icons/types/svelte'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
	  // interface Error {}
	  // interface Locals {}
	  // interface PageData {}
	  interface Platform {
		env: {
		  DB: D1Database;
		};
		context: {
		  waitUntil(promise: Promise<any>): void;
		};
		caches: CacheStorage & { default: Cache };
	  }
	}
  }
  
  export {};