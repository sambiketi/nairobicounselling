import { db } from '../client.js';
import { AnyPgTable } from 'drizzle-orm/pg-core';

export abstract class BaseRepository<TTable extends AnyPgTable> {
  constructor(protected table: TTable) {}

  protected get db() {
    return db;
  }
}
