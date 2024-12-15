import { BaseSchema } from '@adonisjs/lucid/schema'
import Helper, {createSettings} from '../../app/services/helper_service.js'

export default class extends BaseSchema {
  protected tableName = 'settings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('key')
      table.text('value').nullable()
      table.boolean('editable').defaultTo(true)

      table.timestamps()
    })

     createSettings()
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
