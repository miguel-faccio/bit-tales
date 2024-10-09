from pydantic import BaseModel
from enum import Enum
from typing import Optional
from schemas.users import UsuarioReadWithFeedback

class RatingEnum(str, Enum):
    ZERO = '0'
    ONE = '1'
    TWO = '2'
    THREE = '3'
    FOUR = '4'
    FIVE = '5'

class FeedbackCreate(BaseModel):
    text_feed: Optional[str] = None
    rating: RatingEnum
    usuario_id: int

class FeedbackRead(BaseModel):
    id_feedback: int
    text_feed: Optional[str] = None
    rating: RatingEnum
    usuario: UsuarioReadWithFeedback


class FeedbackReadList(BaseModel):
    feedbacks: list[FeedbackRead]
