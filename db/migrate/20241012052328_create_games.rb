class CreateGames < ActiveRecord::Migration[7.2]
  def change
    create_table :games do |t|
      t.boolean :complete, default: false

      t.timestamps
    end
  end
end
