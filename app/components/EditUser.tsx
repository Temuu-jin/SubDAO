'use client';
import { CldImage, CldUploadButton } from 'next-cloudinary';
import { useState } from 'react';
import { User } from '../../util/types';

export default function EditUser({ user }: { user: User }) {
  const [username, setUsername] = useState(user?.username);
  const [email, setEmail] = useState(user?.email);
  const [image, setImage] = useState(user?.image);
  const [password, setPassword] = useState();
  const [passwordConfirmation, setPasswordConfirmation] = useState();

  return (
    <div>
      <main className="bg-gray-100 min-h-screen p-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-lg shadow p-6">
            {user === undefined ? (
              <div>No user</div>
            ) : (
              <div className="flex my-4">
                <div className="w-44 h-32 mr-10 ml-2 flex-shrink-0 bg-gray-200 rounded-full overflow-hidden">
                  <CldImage
                    width="960"
                    height="600"
                    src={user.image}
                    sizes="100vw"
                    alt="Description of my image"
                    className="object-cover w-full h-full"
                  />

                  <CldUploadButton
                    onError={(error) => {
                      console.log(error);
                    }}
                    onSuccess={async (result) => {
                      if (
                        typeof result.info === 'object' &&
                        'public_id' in result.info &&
                        result.info.public_id
                      ) {
                        console.log(
                          'inside: ',
                          result.info.public_id.toString(),
                        );
                        setImage(result.info.public_id.toString());
                        console.log(
                          'image inside cld upload onSuccess: ',
                          image,
                        );
                      }
                    }}
                    uploadPreset="pkondbsy"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold mb-4">
                    {user.username}
                  </h1>
                  <div className="border-b pb-4 mb-4">
                    <div className="font-medium">
                      Email: <span className="font-normal">{user.email}</span>
                    </div>
                    <div className="font-medium">
                      Member since:{' '}
                      <span className="font-normal">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      );
    </div>
  );
}
