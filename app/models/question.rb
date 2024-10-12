class Question < ApplicationRecord
    validates :content, presence: true
    validates :option1, presence: true
    validates :option2, presence: true
    validates :option3, presence: true
    validates :option4, presence: true
    validates :solution, presence: true
end
