class CreateQuestions < ActiveRecord::Migration[7.2]
  def change
    create_table :questions do |t|
      t.string :content
      t.string :option1
      t.string :option2
      t.string :option3
      t.string :option4
      t.string :solution

      t.timestamps
    end
  end
end
