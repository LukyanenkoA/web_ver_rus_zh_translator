import fastapi as _fastapi
import sqlalchemy.orm as _orm
import database as _database, model as _model, schemas as _schemas


def create_database():
    return _database.Base.metadata.create_all(bind=_database.engine)


def get_db():
    db = _database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_word_by_simplified(simplified: str, db: _orm.Session):
    return db.query(_model.Word).filter(_model.Word.simplified == simplified).first()


async def create_word(word: _schemas.WordCreate, db: _orm.Session):
    word_obj = _model.Word(
        traditional=word.traditional, simplified=word.simplified, english=word.english,
        pinyin=word.pinyin, hsk=word.hsk)
    db.add(word_obj)
    db.commit()
    db.refresh(word_obj)
    return word_obj


# async def fill_in(list_of_dicts: list, db: _orm.Session):
#     for one_dict in list_of_dicts:
#         new_word = _model.Word(traditional=one_dict['traditional'], simplified=one_dict['simplified'],
#                                english=one_dict['english'], pinyin=one_dict['pinyin'], hsk=1)
#         db.add(new_word)
#         db.commit()
#         db.refresh(new_word)
