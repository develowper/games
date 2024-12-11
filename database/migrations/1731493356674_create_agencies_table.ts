import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'agencies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 100).nullable()
      table.tinyint('level').unsigned()
      table
        .integer('parent_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('agencies')
        .onDelete('CASCADE')

      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
