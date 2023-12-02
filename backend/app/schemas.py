from . import ma
from .models import Post

#This is to Serialize the data to pass into the Frontend
class PostSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Post
        load_instance = True
