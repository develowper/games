import { BaseSchema } from '@adonisjs/lucid/schema'
import Helper from '#services/helper_service'

export default class extends BaseSchema {
  protected tableName = 'admins'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').notNullable()
      table.string('telegram_id', 50).nullable()
      table.string('phone', 30).nullable()
      table.string('full_name', 100).nullable()
      table.string('username', 30).notNullable().unique()
      table.enum('role', Helper.ADMIN_ROLES)
      table.boolean('is_active').defaultTo(true)
      table.string('password').notNullable()
      table.json('settings').defaultTo(null)
      // table.timestamp('created_at').notNullable()
      // table.timestamp('updated_at').nullable()

      table
        .integer('agency_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('agencies')
        .onDelete('CASCADE')
      table.tinyint('agency_level').unsigned()
      table.text('storage').nullable()
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
