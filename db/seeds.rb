# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
require 'json'

file = File.read(Rails.root.join('db', 'trivia_questions.json'))
questions = JSON.parse(file)

questions.each do |question_data|
    Question.find_or_create_by!(
        content: question_data['content'],
        option1: question_data['option1'],
        option2: question_data['option2'],
        option3: question_data['option3'],
        option4: question_data['option4'],
        solution: question_data['solution']
    )
end