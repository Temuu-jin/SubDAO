'use client';

import { gql, useQuery } from '@apollo/client';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { use, useState } from 'react';
import { getUser, GetUserResponse } from '../../util/auth';
import {
  Comment,
  Dao,
  Post,
  PostWithCommentsAndVotes,
  User,
  Vote,
} from '../../util/types';
import Comments from './Comments';
import CreateCommentForm from './CreateCommentForm';

const getPublicPostsWithCommentsAndVotesQuery = gql`
  query PublicPostsWithCommentsAndVotes {
    publicPostsWithCommentsAndVotes {
      id
      title
      body
      userId
      daoId
      membersOnly
      createdAt
      updatedAt
      user {
        username
      }
      comments {
        body
        createdAt
        updatedAt
        user {
          username
        }
      }
      dao {
        name
      }
    }
  }
`;

type PublicPostsFeedProps = {
  loggedUser?: GetUserResponse;
};

export function PublicPostsFeed({ loggedUser }: PublicPostsFeedProps) {
  const [showComments, setShowComments] = useState(false);
  const {
    data: dataPosts,
    loading: loadingPosts,
    error: errorPosts,
  } = useQuery(getPublicPostsWithCommentsAndVotesQuery, { pollInterval: 500 });

  if (loadingPosts) return <div>Loading...</div>;
  if (errorPosts) return <div>Error: {errorPosts.message}</div>;
  console.log('dataPosts', dataPosts);

  const posts: PostWithCommentsAndVotes[] =
    dataPosts.publicPostsWithCommentsAndVotes;
  console.log('posts', posts);
  return (
    <div className="text-left">
      <ul className="divide-y divide-gray-200 ">
        {posts &&
          posts.map((post) => (
            <li
              key={`post-${post.id}`}
              className="p-4 hover:bg-gray-100  transition-colors duration-200 border border-[#d9d9d9] mb-4"
            >
              <div className="flex">
                <div className="flex flex-col justify-center items-center mr-4 text-gray-400">
                  <button aria-label="upvote">
                    <svg
                      className="h-6 w-6 text-gray-500 hover:text-orange-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </button>
                  <span className="text-xs text-gray-500">Vote</span>
                  <button aria-label="downvote">
                    <svg
                      className="h-6 w-6 text-gray-500 hover:text-orange-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex-shrink-0 mr-4 pt-5">
                  <Image
                    src="https://i.redd.it/75dkc76f6xyb1.jpg"
                    className="h-20 w-20"
                    width={200}
                    height={200}
                    alt="Post avatar"
                  />
                </div>
                <div className="flex-grow">
                  <div className="">
                    {post.daoId > 0 ? (
                      <span className="text-xs font-semibold text-gray-500 hover:underline">
                        d/{post.dao.name}
                        <span className="text-xs text-gray-400"> • </span>
                      </span>
                    ) : null}
                    <span className="text-xs font-semibold text-gray-500 hover:underline">
                      u/{post.user.username}{' '}
                    </span>
                    <span className="justify-end text-xs font-semibold text-gray-500 hover:underline">
                      {' - '}
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <a
                    href={`/posts/${post.id}`}
                    className="text-lg font-semibold text-blue-600 hover:underline"
                  >
                    {post.title}
                  </a>
                  <p className="text-sm text-gray-500 mt-1">{post.body}</p>
                </div>
              </div>
              {/* Action Buttons */}

              <div className="flex justify-between items-center mt-4 text-gray-500 text-xs">
                <button onClick={() => setShowComments(!showComments)}>
                  {' '}
                  Comments {'('}
                  {post.comments.length}
                  {')'}
                </button>
                <div className="flex space-x-4">
                  <button>Share</button>
                  <button>Save</button>
                </div>
              </div>
              <div className="mt-2">
                {loggedUser ? (
                  <CreateCommentForm
                    userId={parseInt(loggedUser!.id)}
                    postId={post.id}
                    commentId={null}
                  />
                ) : (
                  <Link href="/login" className="text-xs">
                    Login to Comment{' '}
                  </Link>
                )}
              </div>
              {showComments ? (
                <Comments loggedUser={loggedUser} comments={post.comments} />
              ) : null}
            </li>
          ))}
      </ul>
    </div>
  );
}

// return (
//   <div className="bg-white rounded-lg shadow-md p-4 text-left">
//     <h2 className="text-xl font-bold mb-4">Posts</h2>
//     <ul className="divide-y divide-gray-200">
//       {posts.map((post) => (
//         <li
//           key={`post-${post.id}`}
//           className="p-4 hover:bg-gray-100 rounded-lg transition-colors duration-200"
//         >
//           {/* Post Content */}
//           <div className="flex">
//             {/* Voting Arrows */}
//             <div className="flex flex-col justify-center items-center mr-4 text-gray-400">
//               <button aria-label="upvote">
//                 <svg
//                   className="h-6 w-6 text-gray-500 hover:text-orange-500"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M5 15l7-7 7 7"
//                   />
//                 </svg>
//               </button>
//               <span className="text-xs text-gray-500">Vote</span>
//               <button aria-label="downvote">
//                 <svg
//                   className="h-6 w-6 text-gray-500 hover:text-orange-500"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <div className="flex-shrink-0 mr-4">
//               <Image
//                 src="https://i.redd.it/75dkc76f6xyb1.jpg"
//                 className="h-20 w-20"
//                 width={200}
//                 height={200}
//                 alt="Post avatar"
//               />
//             </div>
//             <div className="flex-grow">
//               <div className="mb-2">
//                 <span className="text-xs font-semibold text-gray-500 uppercase hover:underline">
//                   d/{post.daoId}
//                 </span>
//                 <span className="text-xs text-gray-400"> • </span>
//                 <span className="text-xs font-semibold text-gray-500 hover:underline">
//                   u/{post.userId}
//                 </span>
//               </div>
//               <Link
//                 href={`/post/${post.id}`}
//                 className="text-lg font-semibold text-blue-600 hover:underline"
//               >
//                 {post.title}
//               </Link>
//               <p className="text-sm text-gray-500 mt-1">{post.body}</p>
//             </div>
//           </div>
//           {/* Action Buttons */}
//           <div className="flex justify-between items-center mt-4 text-gray-500 text-xs">
//             <span> Comments</span>
//             <div className="flex space-x-4">
//               <button>Share</button>
//               <button>Save</button>
//             </div>
//           </div>
//         </li>
//       ))}
//     </ul>
//   </div>
// );
