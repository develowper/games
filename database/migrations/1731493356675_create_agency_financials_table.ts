import { BaseSchema } from '@adonisjs/lucid/schema'
import { createAgencies } from '#services/helper_service'

export default class extends BaseSchema {
  protected tableName = 'agency_financials'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('agency_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('agencies')
        .onDelete('CASCADE')
      table.bigint('balance').defaultTo(0)
      table.string('card', 20).nullable().defaultTo(null)
      table.string('sheba', 40).nullable().defaultTo(null)
      table.timestamps()
      table.datetime('last_charge').nullable()
    })

    createAgencies()
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
