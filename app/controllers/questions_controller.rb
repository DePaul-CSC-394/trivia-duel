class QuestionsController < ApplicationController
    def next
      questions_file = File.read(Rails.root.join('db', 'trivia_questions.json'))
      questions = JSON.parse(questions_file)
      question = questions.sample
      render json: {
        content: question["content"],
        option1: question["option1"],
        option2: question["option2"],
        option3: question["option3"],
        option4: question["option4"],
        solution: question["solution"]
      }
    end
  end
