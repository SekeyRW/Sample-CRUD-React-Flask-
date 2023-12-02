from datetime import datetime

from flask import Blueprint, request, jsonify

from . import db, socketio
from .models import Post
from .schemas import PostSchema

views = Blueprint('views', __name__)

#Call the Schema of the model
post_schema = PostSchema()
post_schemas = PostSchema(many=True)

#REST API to connect the backend to Frontend

#VIEW POSTS API
@views.route('/posts', methods=['GET'])
def posts_view():
    #Pagination
    page = request.args.get('page', 1, type=int)
    page_size = request.args.get('page_size', 10, type=int)

    #Query it to get the posts
    data = Post.query.order_by(Post.created_date.asc())

    #Paginate it
    data_paginated = data.limit(page_size).offset((page - 1) * page_size).all()

    #Serialize the data
    result = post_schemas.dump(data_paginated)

    #Pass the data to the Frontend
    return jsonify({
        "data": result,
        "total": data.count()
    }), 200

#ADD POST API
@views.route('/add/post', methods=['POST'])
def post_add():
    new_data = request.get_json()

    new_post = Post(
        title=new_data['title'],
        description=new_data['description'],
        created_by='USER',
    )

    db.session.add(new_post)
    db.session.commit()

    new_added_data = post_schema.dump(new_post)

    #Call SocketIO to broadcast it on frontend
    socketio.emit('post_added', new_added_data)
    return jsonify({'message': 'Post successfully added!'})

#UPDATE POST API
@views.route('/update/post/<int:id>', methods=['PUT'])
def post_update(id):
    new_data = request.get_json()

    data = Post.query.filter_by(id=id).first()

    data.title = new_data['title']
    data.description = new_data['description']
    data.updated_by = 'USER'
    data.updated_date = datetime.now()
    db.session.commit()

    updated_data = post_schema.dump(data)
    socketio.emit('post_updated', updated_data)
    return jsonify({'message': f'Post updated successfully!',}), 200

#DELETE POST API
@views.route('/delete/post/<int:id>', methods=['DELETE'])
def delete_staff(id):
    data = Post.query.get(id)
    if data is None:
        return jsonify({'message': 'Post not found.'}), 400

    db.session.delete(data)
    db.session.commit()

    socketio.emit('post_deleted', id)
    return 'Success!', 200