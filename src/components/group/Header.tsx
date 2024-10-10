import { useRef, useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { updateImage } from '@/services/userService';

interface HeaderProps {
  selectedGroup: string | null;
}

const Header: React.FC<HeaderProps> = ({ selectedGroup }) => {
  const { data: session } = useSession();
  const user = session?.user as User | null;
  const [image, setImage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleUpdateImage = async () => {
    if (image) {
      const response = await updateImage(image);
      if (response && user) {
        user.image = response as string;
      }
      setImage(null);
    }
  };

  return (
    <div className="navbar bg-base-300 w-full justify-between fixed top-0 z-10">
      <div className="flex-none">
        <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" className="inline-block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>
      </div>
      <div className="text-center">{selectedGroup || 'Star Fly'}</div>

      <div ref={dropdownRef} className="dropdown dropdown-end">
        <div
          tabIndex={0}
          className="btn btn-ghost btn-circle avatar online"
        >
          {user?.image ? (
            <img alt="User Profile" src={user?.image} className="w-10 rounded-full" />
          ) : (
            <span className="text-lg font-bold text-gray-700">
              {user?.name
                ? user.name
                  .split(' ')
                  .slice(0, 2)
                  .map((namePart) => namePart[0].toUpperCase())
                  .join('')
                : ''}
            </span>
          )}
        </div>
        <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-4 shadow">
          <li className="mb-2">
            <div className="flex flex-col items-center">
              <span className="text-sm font-semibold">{user?.name}</span>
              <span className="text-xs text-gray-500">{user?.email}</span>
              <label className="block text-sm font-semibold mt-2">Alterar foto</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => setImage(event.target?.result as string);
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
              />
              <button className={`btn btn-sm btn-outline ${image ? '' : 'btn-disabled'}`} onClick={handleUpdateImage}>
                Salvar
              </button>
            </div>
          </li>
          <li className="h-min">
            <button onClick={() => signOut()} className="text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
                <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
