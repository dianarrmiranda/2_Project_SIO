import React, { useState } from 'react';
import Rating from '@mui/material/Rating';
import useSessionStorage from '../../hooks/useSessionStorage';

import axios from '../../api/axios';

const ProductComments = ({ comments, user_id, product, setComments }) => {
  const [newHeader, setNewHeader] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState('');

  const [user, setItem] = useSessionStorage('auth');

  const username = user;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('productID', product.id);
      formData.append('userID', user_id);
      formData.append('header', newHeader);
      formData.append('description', newComment);
      formData.append('stars', newRating);

      /* const response = await fetch(
        `http://localhost:8080/product/addReview?token=${username.token}`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.text(); */
      axios
        .post(`product/addReview?token=${username.token}`, formData)
        .then((res) => {
          if (res.status === 200) {
            console.log('Review sucessfully added');
            setNewHeader('');
            setNewComment('');
            setComments([
              ...comments,
              { header: newHeader, comment: newComment },
            ]);
            window.location.reload(); // Atualiza a página para aparecer tudo direitinho
          } else {
            console.error('Review failed to be added');
          }
        });
    } catch (error) {
      console.error('Error during API call', error);
    }
  };

  return (
    <div className="flex flex-wrap">
      <div className="w-full">
        {
          //Zona dos comentários
          comments.length > 0 ? ( // Verifica se há comentários
            <>
              <h2 className="font-light text-start ">
                What our customers think about this product...
              </h2>
              <ul>
                {comments.map((comment, index) => (
                  <li
                    key={index}
                    className="p-4 rounded-lg"
                  >
                    <h2 className="font-bold">{comment.user}</h2>
                    <Rating
                      value={comment.numStars}
                      readOnly
                      size="small"
                      precision={0.5}
                      className="my-2"
                    />
                    <h3 className="text-lg font-bold text-accent">
                      {comment.header}
                    </h3>
                    <p className="font-light">{comment.description}</p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <h2 className="font-light text-center">
              Be the first to comment about this product!
            </h2> // Mensagem se não houver comentários
          )
        }
      </div>

      <div className="w-full p-2">
        <h2 className="font-light divider ">Let us know what you think</h2>
        {/* Formulário para adicionar comentários */}
        {user_id == null && (
          <h3 className="my-2 font-bold text-accent divider">
            - You must be logged in to add a review -
          </h3>
        )}
        <form
          onSubmit={handleReviewSubmit}
          className={user_id == null ? 'blur-sm' : ''}
        >
          <span className="flex flex-col">
            <label
              className="my-2 font-light"
              htmlFor="rating"
            >
              Your rating
            </label>
            <Rating
              id="rating"
              name="half-rating"
              defaultValue={0}
              precision={0.5}
              size="large"
              onChange={(e) => {
                setNewRating(e.target.value ? e.target.value : 0);
              }}
              disabled={user_id == null}
            />
          </span>

          <div className="flex flex-col mt-2">
            <label className="my-2 font-light">Your review</label>
            <span>
              <input
                className="w-full p-2 my-2 rounded-lg input-sm"
                type="text"
                placeholder="Title"
                value={newHeader}
                onChange={(e) => setNewHeader(e.target.value)} // Campo para o título
                disabled={user_id == null}
              />
            </span>
            <textarea
              id="comment-section"
              className="min-h-[25vh] p-2 border-secondary focus:border-secondary rounded-lg w-full"
              placeholder="Write your comment here"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)} // Campo para a descrição
              disabled={user_id == null}
            />
          </div>
          <div className="flex my-2 text-right">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                newRating === '' || newHeader === '' || newComment === ''
              }
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductComments;
