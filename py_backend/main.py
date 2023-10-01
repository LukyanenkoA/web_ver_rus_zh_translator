import fastapi as _fastapi
import sqlalchemy.orm as _orm
from fastapi.middleware.cors import CORSMiddleware

import services as _services, schemas as _schemas, model as _model

app = _fastapi.FastAPI()


@app.post("/api/words")
async def create_word(
        word: _schemas.WordCreate, db: _orm.Session = _fastapi.Depends(_services.get_db)
):
    db_word = await _services.get_word_by_simplified(word.simplified, db)
    if db_word:
        raise _fastapi.HTTPException(status_code=400, detail="Word is already in use")

    return await _services.create_word(word, db)


@app.get('/')
def hello_world():
    return {'hello': 'world'}


@app.get("/api/words")
def get_words(db: _orm.Session = _fastapi.Depends(_services.get_db)):
    return db.query(_model.Word).all()


origins = [
    "https://lukyanenkoa.github.io/web_ver_rus_zh_translator/",
    "http://localhost:8000l",
    "http://127.0.0.1:8000/api/words/",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/words/{word}", response_model=_schemas.Word)
async def get_word(word, db: _orm.Session = _fastapi.Depends(_services.get_db)):
    # get translated word by simplified version
    db_word = db.query(_model.Word).filter(_model.Word.simplified == word).first()
    if db_word is None:
        return _fastapi.responses.JSONResponse(status_code=404, content={"message": "No such word found"})
    return db_word
