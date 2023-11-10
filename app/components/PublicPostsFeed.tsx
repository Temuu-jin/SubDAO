'use client';

import { gql, useQuery } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { Post, Vote } from '../../util/types';

const getPublicPostsQuery = gql`
  query GetPublicPosts {
    getPublicPosts {
      id
      title
      body
      userId
      daoId
      createdAt
    }
  }
`;

const getAllVotesQuery = gql`
  query GetVotes {
    votes {
      id
      userId
      postId
      commentId
      voteType
    }
  }
`;

export function PublicPostsFeed() {
  const {
    data: dataPosts,
    loading: loadingPosts,
    error: errorPosts,
  } = useQuery(getPublicPostsQuery, { pollInterval: 500 });

  const {
    data: dataVotes,
    loading: loadingVotes,
    error: errorVotes,
  } = useQuery(getAllVotesQuery, { pollInterval: 500 });

  if (loadingPosts) return <div>Loading...</div>;
  if (errorPosts) return <div>Error: {errorPosts.message}</div>;

  if (loadingVotes) return <div>Loading...</div>;
  if (errorVotes) return <div>Error: {errorVotes.message}</div>;

  const posts: Post[] = dataPosts.getPublicPosts;
  const votes: Vote[] = dataVotes.votes;

  return (
    <div className="bg-white  text-left">
      <h2 className="text-xl font-bold mb-4">Posts</h2>
      <ul className="divide-y border border-[#d9d9d9] divide-gray-200">
        {posts.map((post) => (
          <li
            key={`post-${post.id}`}
            className="p-4 hover:bg-gray-100  transition-colors duration-200"
          >
            {/* Post Content */}
            <div className="flex">
              {/* Voting Arrows */}
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
              <div className="flex-shrink-0 mr-4">
                <Image
                  src="https://i.redd.it/75dkc76f6xyb1.jpg"
                  className="h-20 w-20"
                  width={200}
                  height={200}
                  alt="Post avatar"
                />
              </div>
              <div className="flex-grow">
                <div className="mb-2">
                  {post.daoId > 0 ? (
                    <span className="text-xs font-semibold text-gray-500 uppercase hover:underline">
                      d/{post.daoId}
                      <span className="text-xs text-gray-400"> • </span>
                    </span>
                  ) : null}

                  <span className="text-xs font-semibold text-gray-500 hover:underline">
                    u/{post.userId}
                  </span>
                </div>
                <Link
                  href={`/post/${post.id}`}
                  className="text-lg font-semibold text-blue-600 hover:underline"
                >
                  {post.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">{post.body}</p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-4 text-gray-500 text-xs">
              <span> Comments</span>
              <div className="flex space-x-4">
                <button>Share</button>
                <button>Save</button>
              </div>
            </div>
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
