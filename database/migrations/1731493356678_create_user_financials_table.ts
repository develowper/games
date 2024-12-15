import { BaseSchema } from '@adonisjs/lucid/schema'
import Helper, {createUsers} from '#services/helper_service'

export default class extends BaseSchema {
  protected tableName = 'user_financials'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table
        .bigInteger('user_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.bigint('balance').defaultTo(0)
      table.string('card', 20).nullable().defaultTo(null)
      table.string('sheba', 40).nullable().defaultTo(null)
      table.timestamps()

      createUsers()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
