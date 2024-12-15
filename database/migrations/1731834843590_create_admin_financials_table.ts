import { BaseSchema } from '@adonisjs/lucid/schema'
import Helper, {createAdmins} from '#services/helper_service'

export default class extends BaseSchema {
  protected tableName = 'admin_financials'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table
        .bigInteger('admin_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('admins')
        .onDelete('CASCADE')
      table.bigint('balance').defaultTo(0)
      table.string('card', 20).nullable().defaultTo(null)
      table.string('sheba', 40).nullable().defaultTo(null)
      table.timestamps()
    })
     createAdmins()
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
