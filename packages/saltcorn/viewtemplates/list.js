const db = require("../db");
const Field = require("../db/field");
const { mkTable, h } = require("../routes/markup.js");

const list = {
  name: "List",
  idArgument: false,
  configuration_form: async table_name => {
    const table = await db.get_table_by_name(table_name);

    const fields = await Field.get_by_table_id(table.id);
    const fldOptions = fields.map(f => f.name);
    return [
      {
        name: "field_list",
        label: "Field list",
        input_type: "ordered_multi_select",
        options: fldOptions
      }
    ];
  },

  validate_config: table => config => true,

  run: async (table_id, { field_list }) => {
    const table = await db.get_table_by_id(table_id);

    const fields = await Field.get_by_table_id(table.id);
    var tfields = fields
      .filter(f => field_list.includes(f.name))
      .map(f => ({ label: f.label, key: f.name }));
    const rows = await db.select(table.name);
    return h(1, table.name) + mkTable(tfields, rows);
  }
};

module.exports = {
  ...list
};