import { BaseSchema } from '@adonisjs/lucid/schema'
import Helper from '../../app/services/helper_service.js'

export default class extends BaseSchema {
  protected tableName = 'settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('key')
      table.json('value').nullable().collate('utf8mb4_general_ci')
      table.boolean('editable').defaultTo(true)

      table.timestamps()
    })

    Helper.createSettings()
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
