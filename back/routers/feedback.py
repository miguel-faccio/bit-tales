from fastapi import APIRouter, HTTPException
from models.feedback import FeedbackDB
from schemas.feedback import (
    FeedbackCreate,
    FeedbackRead,
    FeedbackReadList,
)

router_feedback = APIRouter(prefix='/feedbacks', tags=['FEEDBACKS'])

@router_feedback.post('', response_model=FeedbackRead)
def criar_feedback(novo_feedback: FeedbackCreate):
    feedback = FeedbackDB.create(**novo_feedback.dict())
    return feedback

@router_feedback.get('', response_model=FeedbackReadList)
def listar_feedbacks():
    feedbacks = FeedbackDB.select()
    return {'feedbacks': [feedback for feedback in feedbacks]}

@router_feedback.get('/{feedback_id}', response_model=FeedbackRead)
def ler_feedback(feedback_id: int):
    feedback = FeedbackDB.get_or_none(FeedbackDB.id_feedback == feedback_id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback não encontrado")
    return feedback


@router_feedback.delete('/{feedback_id}', response_model=FeedbackRead)
def eliminar_feedback(feedback_id: int):
    feedback = FeedbackDB.get_or_none(FeedbackDB.id_feedback == feedback_id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback não encontrado")
    feedback.delete_instance()
    return feedback
